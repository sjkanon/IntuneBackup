/**
 * The Defender for Office 365 baseline: email protection as CIPP standards, not as Microsoft's
 * preset security policies. Read by `generate-baseline-template.js`, which writes it to
 * `BaselineTemplate/Defender-Office365.json`.
 *
 * Why custom policies and not the Standard/Strict presets: a preset cannot be changed and CIPP
 * cannot measure it, so drift goes unseen. The CIPP standards create custom policies at
 * priority 0 scoped to every accepted domain, which CIPP checks and repairs on every run.
 * CIS (2.1.x), ORCA and CISA ScubaGear all accept custom policies with comparable protection.
 * Mind the precedence: a preset that *is* assigned in a tenant beats these policies silently.
 *
 * Values follow Microsoft's Strict column
 * (https://learn.microsoft.com/en-us/defender-office-365/recommended-settings-for-eop-and-office365)
 * except where noted. Variable names are those of CIPP-API `Config/BaselineStandards/`.
 *
 * Quarantine policies: CIPP only offers the three built-in ones in these fields.
 * `DefaultFullAccessWithNotificationPolicy` is the one that sends the user the digest (every
 * four hours, see GlobalQuarantineNotifications); `AdminOnlyAccessPolicy` stays on high
 * confidence phish and malware, which users can never release themselves anyway.
 */

const NOTIFY = "DefaultFullAccessWithNotificationPolicy";
const ADMIN_ONLY = "AdminOnlyAccessPolicy";

/**
 * Bovenop de 53 standaardextensies die CIPP altijd meeneemt: scripts, OneNote-bijlagen,
 * schijfimages en SVG — de vormen waarin phishing nu binnenkomt. Een greep uit de CIS
 * 2.1.11-lijst; Office-bestanden en archieven (zip, rar, 7z) bewust niet, die zijn te gewoon.
 */
const EXTRA_FILE_TYPES = ["cpl", "hlp", "inf", "ins", "isp", "js", "jse", "one", "onepkg", "ps1", "psm1", "svg", "vhd", "vhdx", "xlam"];

const DEFENDER_BASELINE = {
  templateName: "CXNM - Standard - Defender for Office 365",
  description:
    "Email and collaboration protection as CIPP standards: Safe Links, Safe Attachments, " +
    "anti-phishing, anti-spam, anti-malware, Defender for SharePoint/OneDrive/Teams and user " +
    "quarantine notifications every four hours. Custom policies at Microsoft Strict level, so " +
    "CIPP can detect and repair drift. Do not assign the Standard/Strict preset policies in the " +
    "same tenant: they take precedence. Assign the tenants before you run it.",
  standards: [
    // De digest: 4 uur is het kortste wat Exchange toestaat (anders dagelijks of wekelijks).
    { standard: "GlobalQuarantineNotifications", variables: { NotificationInterval: "04:00:00" } },
    {
      standard: "SafeLinksPolicy",
      variables: {
        name: "CXNM - Standard - Safe Links",
        AllowClickThrough: false,
        DisableUrlRewrite: false,
        EnableOrganizationBranding: false,
        DoNotRewriteUrls: "",
      },
    },
    {
      standard: "SafeAttachmentPolicy",
      variables: {
        name: "CXNM - Standard - Safe Attachments",
        SafeAttachmentAction: "Block",
        QuarantineTag: ADMIN_ONLY,
        Redirect: false,
        RedirectAddress: "",
      },
    },
    // Safe Attachments en ZAP voor SharePoint, OneDrive en Teams; Safe Documents waar de licentie het heeft.
    { standard: "AtpPolicyForO365", variables: { AllowSafeDocsOpen: false } },
    {
      standard: "AntiPhishPolicy",
      variables: {
        name: "CXNM - Standard - Anti-Phishing",
        // Strict zegt 4; 3 (Standard, ook ORCA en CIS) scheelt veel valse positieven.
        PhishThresholdLevel: "3",
        EnableFirstContactSafetyTips: true,
        EnableSimilarUsersSafetyTips: true,
        EnableSimilarDomainsSafetyTips: true,
        EnableUnusualCharactersSafetyTips: true,
        // Strict quarantaineert spoof; ORCA-112 adviseert Junk, en spoof heeft vaak een legitieme bron.
        AuthenticationFailAction: "MoveToJmf",
        SpoofQuarantineTag: NOTIFY,
        MailboxIntelligenceProtectionAction: "Quarantine",
        MailboxIntelligenceQuarantineTag: NOTIFY,
        TargetedUserProtectionAction: "Quarantine",
        TargetedUserQuarantineTag: NOTIFY,
        TargetedDomainProtectionAction: "Quarantine",
        TargetedDomainQuarantineTag: NOTIFY,
      },
    },
    {
      standard: "SpamFilterPolicy",
      variables: {
        name: "CXNM - Standard - Anti-Spam",
        // Strict: spam in quarantaine mét melding, zodat de gebruiker hem in de digest ziet en zelf vrijgeeft.
        SpamAction: "Quarantine",
        SpamQuarantineTag: NOTIFY,
        HighConfidenceSpamAction: "Quarantine",
        HighConfidenceSpamQuarantineTag: NOTIFY,
        PhishSpamAction: "Quarantine",
        PhishQuarantineTag: NOTIFY,
        HighConfidencePhishQuarantineTag: ADMIN_ONLY,
        // Bulk: Standard (Junk, drempel 6). Nieuwsbrieven in quarantaine maakt de digest onleesbaar.
        BulkSpamAction: "MoveToJmf",
        BulkQuarantineTag: "DefaultFullAccessPolicy",
        BulkThreshold: 6,
        BulkMovesEnabled: "",
        // Advanced Spam Filter: Microsoft raadt alles uit, en geen toegestane domeinen (ORCA-109, ScubaGear 6.2).
        IncreaseScoreWithImageLinks: false,
        IncreaseScoreWithBizOrInfoUrls: false,
        MarkAsSpamFramesInHtml: false,
        MarkAsSpamObjectTagsInHtml: false,
        MarkAsSpamEmbedTagsInHtml: false,
        MarkAsSpamFormTagsInHtml: false,
        MarkAsSpamWebBugsInHtml: false,
        MarkAsSpamSensitiveWordList: false,
        EnableLanguageBlockList: false,
        LanguageBlockList: "",
        EnableRegionBlockList: false,
        RegionBlockList: "",
        AllowedSenderDomains: "",
      },
    },
    {
      standard: "MalwareFilterPolicy",
      variables: {
        name: "CXNM - Standard - Anti-Malware",
        FileTypeAction: "Reject",
        OptionalFileTypes: EXTRA_FILE_TYPES.join(","),
        QuarantineTag: ADMIN_ONLY,
        // Een beheeradres verschilt per tenant; wie het wil zet het in CIPP per tenant aan.
        EnableInternalSenderAdminNotifications: false,
        InternalSenderAdminAddress: "",
        EnableExternalSenderAdminNotifications: false,
        ExternalSenderAdminAddress: "",
      },
    },
    { standard: "TeamsZAP", variables: {} },
    // Teams controleert bestandstypen en URL-reputatie in chats ook zonder Defender-licentie.
    { standard: "TeamsChatProtection", variables: { FileTypeCheck: "Enabled", UrlReputationCheck: "Enabled" } },
    // Microsoft Standard: 500/1000/1000 en blokkeren. Strict (400/800/800) raakt gewone mailers te snel.
    {
      standard: "EXOOutboundSpamLimits",
      variables: {
        recipientLimitExternalPerHour: 500,
        recipientLimitInternalPerHour: 1000,
        recipientLimitPerDay: 1000,
        actionWhenThresholdReached: "BlockUser",
      },
    },
  ],
};

module.exports = { DEFENDER_BASELINE, EXTRA_FILE_TYPES };
