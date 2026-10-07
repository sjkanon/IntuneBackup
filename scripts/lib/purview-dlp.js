/**
 * The Purview DLP baseline: data loss prevention for Exchange, SharePoint and OneDrive as CIPP
 * DLP policy templates. Read by `generate-dlp-templates.js`, which writes the templates to
 * `DlpCompliancePolicyTemplate/`, and by `generate-baseline-template.js`, which writes
 * `BaselineTemplate/Purview-DLP.json`.
 *
 * Sources, combined:
 * - Microsoft's built-in templates (https://learn.microsoft.com/en-us/purview/dlp-policy-templates-include):
 *   every financial/PII template has a low-volume rule (1-9 matches, notify) and a high-volume rule
 *   (10+, block and incident report), both on "shared with people outside my organization". There
 *   is no Netherlands or Belgium template; their SITs only occur in "GDPR Enhanced", which also
 *   pulls in 27 EU address types and trainable classifiers — far too noisy for a small tenant.
 * - Microsoft's "Default Office 365 DLP policy" (credit cards 1-9 shared externally, tip only)
 *   and the rollout order in https://learn.microsoft.com/en-us/purview/dlp-create-deploy-policy:
 *   see what fires before anything blocks.
 * - kingsrule50/m365-purview-data-protection: tiered rules, custom tip text, maxCount -1 instead
 *   of Microsoft's 500 (a file with 501 credit cards would otherwise miss the high rule).
 * - Mehsin-Khan/microsoft-purview-dlp-policy-lab: the same 1+/10+ split for IBAN, which we only
 *   use for bulk (see below).
 *
 * Choices that are deliberately this way:
 *
 * 1. **Exchange, SharePoint and OneDrive only.** That is what Business Premium licenses
 *    (https://learn.microsoft.com/en-us/office365/servicedescriptions/microsoft-365-service-descriptions/microsoft-365-tenantlevel-services-licensing-guidance/microsoft-purview-service-description).
 *    Teams chat DLP and Endpoint DLP need E5-class licences. Files shared in Teams live in
 *    SharePoint/OneDrive and are covered anyway.
 * 2. **Report first, block later, by adding — not by switching.** Baseline stages stack, so a
 *    policy that is in test mode in stage 1 and enabled in stage 2 would be two templates fighting
 *    over one policy. Instead stage 1 deploys "Notify" policies that are *on* but only notify and
 *    report, and stage 2 adds separate "Block" policies with the same high-volume thresholds.
 *    The incident reports of stage 1 are therefore exactly the list of what stage 2 will block:
 *    that is the simulation Microsoft asks for, with real data.
 * 3. **No override.** CIPP's DLP deploy path does not carry `NotifyAllowOverride`
 *    (Get-CIPPDlpComplianceFieldList), so a block here is a hard block. That is why the block
 *    rules only fire on bulk (10+ identity numbers, 10+ cards, 20+ IBANs) sent outside the
 *    organisation: there is hardly a legitimate reason for that, and the stage is manual.
 * 4. **Alerts go to `SiteAdmin`.** CIPP does not replace custom variables such as
 *    `%SecurityAlertMail%` in DLP templates, and a fixed address would end up in every tenant.
 *    Alerts always appear in Purview → DLP → Alerts; per-tenant mail is set there.
 * 5. **Confidence per SIT, from its definition.** BSN only ever matches at High (checksum plus a
 *    keyword such as "bsn" or "burgerservicenummer"); the Dutch passport and driver's license
 *    numbers top out at Medium, so High would never fire for them. All three Belgian types top out at
 *    Medium too (the national number needs its checksum plus a keyword for that; checksum alone is
 *    Low, which is too loose for a number that is also a valid date plus digits). Microsoft's
 *    keyword list has "identiteitskaart" and "numéro national" but not "rijksregisternummer". IBAN is High on the checksum
 *    alone — every invoice carries one — so it is left out of the low rule and only counts in
 *    bulk (a salary or SEPA export). The VAT number (and the Belgian enterprise number) is left out
 *    entirely: it is on every invoice by law.
 *
 * Rule names are unique tenant-wide and at most 64 characters; the generator checks the length.
 */

const { PREFIX } = require("./organisation");

const DLP_PREFIX = PREFIX + "DLP - ";

/**
 * Sensitive information types. GUIDs from each SIT's definition page on learn.microsoft.com
 * (sit-defn-*); the name is what Get-DlpSensitiveInformationType returns.
 */
const SIT = {
  bsn: { name: "Netherlands Citizen's Service (BSN) Number", id: "c5f54253-ef7e-44f6-a578-440ed67e946d", confidencelevel: "High" },
  passport: { name: "Netherlands Passport Number", id: "61786727-bafd-45f6-94d9-888d815e228e", confidencelevel: "Medium" },
  driversLicense: { name: "Netherlands Driver's License Number", id: "6247fbea-ab80-4be5-8233-308b7c031401", confidencelevel: "Medium" },
  tin: { name: "Netherlands Tax Identification Number", id: "01f42a64-eba7-4892-a67b-398237e4ade2", confidencelevel: "High" },
  beNationalNumber: { name: "Belgium National Number", id: "fb969c9e-0fd1-4b18-8091-a2123c5e6a54", confidencelevel: "Medium" },
  bePassport: { name: "Belgium Passport Number", id: "d7b1315b-21ca-4774-a32a-596010ff78fd", confidencelevel: "Medium" },
  beDriversLicense: { name: "Belgium Driver's License Number", id: "d89fd329-9324-433c-b687-2c37bd5166f3", confidencelevel: "Medium" },
  creditCard: { name: "Credit Card Number", id: "50842eb7-edc8-4019-85dd-5a5c1f2bb085", confidencelevel: "High" },
  euDebitCard: { name: "EU Debit Card Number", id: "0e9b3178-9678-47dd-a509-37222ca96b42", confidencelevel: "High" },
  iban: { name: "International Banking Account Number (IBAN)", id: "e7dc4711-11b7-4cb0-b88b-2c394a771f0e", confidencelevel: "High" },
};

/** `[sit, min, max]` -> the hashtable New-DlpComplianceRule takes; max -1 = no upper bound. */
const match = ([sit, min, max]) => ({ ...sit, mincount: String(min), maxcount: String(max) });

/**
 * Per category: which SITs from which count are "a few" (notify) and "bulk" (report, later block).
 * BSN counts as bulk from 5: it is the identifier the Dutch DPA treats most strictly. The Belgian
 * national number (rijksregisternummer) gets the same: it is also the tax and social security
 * number, so it is the one that opens everything.
 */
const CATEGORIES = {
  personal: {
    name: "Personal Data NL",
    what: "Dutch citizen's service numbers (BSN), passport, driver's license and tax identification numbers",
    few: [[SIT.bsn, 1, 4], [SIT.passport, 1, 9], [SIT.driversLicense, 1, 9], [SIT.tin, 1, 9]],
    bulk: [[SIT.bsn, 5, -1], [SIT.passport, 10, -1], [SIT.driversLicense, 10, -1], [SIT.tin, 10, -1]],
    tip: {
      few: "Dit bevat persoonsgegevens (bijvoorbeeld een BSN of paspoortnummer) en gaat naar iemand buiten de organisatie. Is dat echt nodig?",
      bulk: "Dit bevat veel persoonsgegevens (BSN, paspoort, rijbewijs of fiscaal nummer) en gaat naar buiten de organisatie. De beheerder krijgt hiervan een melding.",
      block: "Geblokkeerd: dit bevat veel persoonsgegevens (BSN, paspoort, rijbewijs of fiscaal nummer) en mag niet buiten de organisatie worden gedeeld. Neem contact op met de beheerder.",
    },
  },
  personalBe: {
    name: "Personal Data BE",
    what: "Belgian national numbers (rijksregisternummer), passport and driver's license numbers",
    few: [[SIT.beNationalNumber, 1, 4], [SIT.bePassport, 1, 9], [SIT.beDriversLicense, 1, 9]],
    bulk: [[SIT.beNationalNumber, 5, -1], [SIT.bePassport, 10, -1], [SIT.beDriversLicense, 10, -1]],
    // Tweetalig: in Belgische tenants zitten Nederlandstalige en Franstalige gebruikers.
    tip: {
      few: "Persoonsgegevens (rijksregisternummer, paspoort) naar buiten de organisatie: is dat nodig? / Données personnelles (numéro national, passeport) vers l'extérieur : est-ce nécessaire ?",
      bulk: "Veel persoonsgegevens naar buiten de organisatie; de beheerder wordt verwittigd. / Beaucoup de données personnelles vers l'extérieur ; l'administrateur est averti.",
      block: "Geblokkeerd: veel persoonsgegevens mogen niet buiten de organisatie. Contacteer de beheerder. / Bloqué : beaucoup de données personnelles ne peuvent pas sortir. Contactez l'administrateur.",
    },
  },
  financial: {
    name: "Financial",
    what: "credit and debit card numbers, and IBANs in bulk",
    few: [[SIT.creditCard, 1, 9], [SIT.euDebitCard, 1, 9]],
    bulk: [[SIT.creditCard, 10, -1], [SIT.euDebitCard, 10, -1], [SIT.iban, 20, -1]],
    tip: {
      few: "Dit bevat een betaalkaartnummer en gaat naar iemand buiten de organisatie. Deel kaartgegevens nooit per mail of link.",
      bulk: "Dit bevat veel betaalkaart- of rekeningnummers en gaat naar buiten de organisatie. De beheerder krijgt hiervan een melding.",
      block: "Geblokkeerd: dit bevat veel betaalkaart- of rekeningnummers en mag niet buiten de organisatie worden gedeeld. Neem contact op met de beheerder.",
    },
  },
};

const LOCATIONS = { ExchangeLocation: ["All"], SharePointLocation: ["All"], OneDriveLocation: ["All"] };

/** What every rule shares: only content that leaves the organisation, sender/owner notified. */
const ruleBase = (name) => ({
  Name: name,
  Disabled: false,
  AccessScope: "NotInOrganization",
  NotifyUser: ["Owner", "LastModifier"],
});

function notifyPolicy(key) {
  const c = CATEGORIES[key];
  const name = `${DLP_PREFIX}${c.name} - Notify`;
  return {
    key: `${key}-notify`,
    stage: 1,
    file: `DLP_${c.name.replace(/\s+/g, "_")}_Notify.json`,
    policy: {
      name,
      comments:
        `Notifies on ${c.what} shared outside the organisation; reports bulk to the admins. ` +
        "Blocks nothing. Stage 1 of the Purview DLP baseline; the matching Block policy is stage 2.",
      Mode: "Enable",
      ...LOCATIONS,
      RuleParams: [
        {
          ...ruleBase(`${name} - few`),
          ContentContainsSensitiveInformation: c.few.map(match),
          NotifyPolicyTipCustomText: c.tip.few,
          ReportSeverityLevel: "Low",
        },
        {
          ...ruleBase(`${name} - bulk`),
          ContentContainsSensitiveInformation: c.bulk.map(match),
          NotifyPolicyTipCustomText: c.tip.bulk,
          GenerateIncidentReport: ["SiteAdmin"],
          IncidentReportContent: ["All"],
          GenerateAlert: ["SiteAdmin"],
          ReportSeverityLevel: "High",
        },
      ],
    },
  };
}

function blockPolicy(key) {
  const c = CATEGORIES[key];
  const name = `${DLP_PREFIX}${c.name} - Block`;
  return {
    key: `${key}-block`,
    stage: 2,
    file: `DLP_${c.name.replace(/\s+/g, "_")}_Block.json`,
    policy: {
      name,
      comments:
        `Blocks bulk ${c.what} shared outside the organisation, without override. ` +
        "The Notify policy of stage 1 reports the same matches; review those before moving a tenant to this stage.",
      Mode: "Enable",
      ...LOCATIONS,
      RuleParams: [
        {
          ...ruleBase(`${name} - bulk`),
          ContentContainsSensitiveInformation: c.bulk.map(match),
          BlockAccess: true,
          // PerUser = external users lose access in SharePoint/OneDrive; in Exchange the message
          // to the external recipients is blocked (the AccessScope condition already scopes it).
          BlockAccessScope: "PerUser",
          NotifyPolicyTipCustomText: c.tip.block,
          ReportSeverityLevel: "High",
        },
      ],
    },
  };
}

const DLP_POLICIES = [
  notifyPolicy("personal"),
  notifyPolicy("personalBe"),
  notifyPolicy("financial"),
  blockPolicy("personal"),
  blockPolicy("personalBe"),
  blockPolicy("financial"),
];

const DLP_BASELINE = {
  templateName: PREFIX + "Purview DLP",
  description:
    "Data loss prevention for Exchange, SharePoint and OneDrive (Business Premium): Dutch personal " +
    "identifiers (BSN, passport, driver's license, tax number), Belgian personal identifiers (national " +
    "number, passport, driver's license), payment cards and IBANs in bulk, " +
    "shared outside the organisation. Stage 1 notifies users and reports bulk to the admins; stage 2 " +
    "blocks bulk without override and is manual: move a tenant only after reviewing its DLP alerts. " +
    "Assign the tenants before you run it.",
  stages: [
    { name: "Melden", logic: "and", conditions: [] },
    // Handmatig: blokkeren zonder override hoort pas na iemand die de meldingen van stage 1 heeft gezien.
    { name: "Blokkeren", logic: "and", conditions: [{ type: "manual" }] },
  ],
};

const DLP_TEMPLATE_DIR = "DlpCompliancePolicyTemplate";

module.exports = { SIT, DLP_POLICIES, DLP_BASELINE, DLP_TEMPLATE_DIR };
