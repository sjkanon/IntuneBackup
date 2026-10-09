#!/usr/bin/env node
/**
 * Generates the CIPP baselines in `BaselineTemplate/`, as files:
 *
 * - `Baseline.json`: the Intune baseline, packages per stage from the manifest;
 * - `Defender-Office365.json`: email protection (Safe Links, Safe Attachments, anti-spam,
 *   quarantine notifications) as Exchange/Defender standards, from `lib/defender-office.js`;
 * - `Windows-Updates.json`: Windows Update rings, Edge and Microsoft 365 Apps updates as their
 *   own packages, plus Winget-AutoUpdate as an application template, from `lib/windows-updates.js`;
 * - `Purview-DLP.json`: data loss prevention for Exchange, SharePoint and OneDrive as DLP policy
 *   templates, notify first and block later, from `lib/purview-dlp.js`;
 * - `Purview-DLP-Aviation.json`: extra DLP for aviation tenants, notify only, from the same file.
 *
 * `IntuneTemplate/` supplies the policies, but in CIPP templates just sit there — deploying is
 * done by a **baseline**: a set of *standards* spread over stages that tenants move through.
 * Filling in that screen by hand means adding the same standard nine times and picking the
 * right assignment target each time; one typo puts 80 policies on the wrong audience. So the
 * baseline comes from the same source as everything else.
 *
 * CIPP recognises the file by `TemplateType: "BaselineTemplate"` and by the folder
 * `BaselineTemplate/` (Import-CIPPBaselineTemplate); it does not go to the templates table
 * but to the baseline editor. To import: Tools → Community Repos → this repo → this file
 * → Import.
 *
 * Three things that are deliberately this way:
 *
 * 1. **Packages, not individual templates.** Each stage gets `IntuneTemplatePackage` instances
 *    and not 141 individual `IntuneTemplate` instances. CIPP resolves the membership of a
 *    package again on every run, so a new policy in this repo comes along automatically
 *    without the baseline being touched. A baseline that CIPP exports *itself* flattens
 *    packages into individual templates — that is a snapshot and exactly what we do not want.
 * 2. **`assignedTenants` is the placeholder.** CIPP's own export does the same: an imported
 *    baseline is assigned to no one, so that whoever pulls it in chooses the tenants
 *    deliberately. So nothing gets deployed by this file alone.
 * 3. **`remediateEnabled` is on.** Without it the baseline only reports and fixes nothing;
 *    *that* is what "the baseline guards the tenant" means. `verifyAssignments` is on for
 *    every package that assigns, because a policy that *does* exist but is assigned to no one
 *    is exactly the silent drift this is meant to catch.
 *
 * Usage:
 *   node scripts/generate-baseline-template.js            writes the file
 *   node scripts/generate-baseline-template.js --check     writes nothing, exit 1 if one is out of date
 */

const fs = require("fs");
const path = require("path");
const { BASELINE_STAGES, PACKAGE_PREFIX, packagePlan, splitClassSuffix } = require("./lib/templates");
const { DEFENDER_BASELINE } = require("./lib/defender-office");
const { PREFIX } = require("./lib/organisation");
const { UPDATES_PREFIX, UPDATE_PACKAGES, UPDATES_BASELINE, WAU_TEMPLATE_FILE } = require("./lib/windows-updates");
const { DLP_BASELINES, DLP_TEMPLATE_DIR } = require("./lib/purview-dlp");

const REPO_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_DIR = path.join(REPO_ROOT, "IntuneTemplate");
const MANIFEST_PATH = path.join(TEMPLATE_DIR, "_manifest.json");
const ASSIGNMENTS_PATH = path.join(TEMPLATE_DIR, "_assignments.json");
const OUT_DIR = path.join(REPO_ROOT, "BaselineTemplate");
const OUT_PATH = path.join(OUT_DIR, "Baseline.json");
const DEFENDER_OUT_PATH = path.join(OUT_DIR, "Defender-Office365.json");
const UPDATES_OUT_PATH = path.join(OUT_DIR, "Windows-Updates.json");
const APP_TEMPLATE_DIR = path.join(REPO_ROOT, "AppTemplate");

const TEMPLATE_NAME = PREFIX + "Baseline";

/** `[Baseline] - Baseline-SEC-Update-Ring1` -> `sec-update-ring1`; de sleutel achter de `#` in een instance. */
function instanceSuffix(pkg) {
  const prefix = pkg.startsWith(UPDATES_PREFIX) ? UPDATES_PREFIX : PACKAGE_PREFIX;
  return pkg.slice(prefix.length).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function standardFor(entry) {
  return {
    standard: "IntuneTemplatePackage",
    // Multi-instance standards dragen hun sleutel achter een `#`. Die sleutel is de
    // identiteit van deze instance: CIPP hangt er de resultaatrijen en de per-tenant
    // uitzonderingen aan, dus hij moet stabiel blijven — vandaar afgeleid van de
    // pakketnaam en niet oplopend genummerd.
    instance: `IntuneTemplatePackage#${instanceSuffix(entry.pakket)}`,
    variables: {
      intuneTemplatePackage: entry.pakket,
      assignTo: entry.opties.assignTo,
      customGroup: entry.opties.customGroup,
      excludeGroup: entry.opties.excludeGroup || "",
      // De naam van het filter, niet het id: CIPP zoekt hem per tenant op displayName op
      // (Set-CIPPAssignedPolicy, `-like`). Bestaat hij in de tenant niet, dan wijst CIPP toe
      // zónder filter en logt alleen een waarschuwing — maak de filters dus vóór stage 1 aan.
      assignmentFilter: entry.opties.assignmentFilter || "",
      assignmentFilterType: entry.opties.assignmentFilterType || "include",
      verifyAssignments: entry.opties.assignTo !== "On",
      levenshteinDistance: 0,
    },
    remediateEnabled: true,
    alertEnabled: true,
    alertOnRemediate: false,
  };
}

function build(manifest, assignments) {
  // De update-pakketten staan in Windows-Updates.json, niet hier.
  const plan = packagePlan(manifest, assignments).filter((p) => p.pakket.startsWith(PACKAGE_PREFIX));

  const stages = BASELINE_STAGES.map((stage, i) => ({
    name: stage.name,
    logic: stage.logic,
    conditions: stage.conditions,
    standards: plan.filter((p) => p.stage === i + 1).map(standardFor),
  }));

  const leeg = stages.filter((s) => s.standards.length === 0);
  if (leeg.length > 0) throw new Error(`stage(s) zonder standards: ${leeg.map((s) => s.name).join(", ")}`);

  return {
    TemplateType: "BaselineTemplate",
    templateName: TEMPLATE_NAME,
    description:
      "The agreed Intune baseline from the baseline repository. Every stage deploys Intune " +
      "template packages; package membership follows the repo, so a new policy is added " +
      "automatically. Assign the tenants before you run it.",
    // CIPP's eigen export zet hier dezelfde placeholder: een geïmporteerde baseline hoort
    // zichtbaar nog niet toegewezen te zijn.
    assignedTenants: [{ label: "Exported Template", value: "Exported Template", type: "Tenant" }],
    excludedTenants: [],
    // Leeg = de globale CIPP-meldingsinstellingen (e-mail, webhook, PSA). Een adres van ons
    // hier zou bij iedereen die deze baseline importeert terechtkomen.
    alertEmails: "",
    alertWebhookUrl: "",
    stages,
    // De pakketten verwijzen niet naar losse templatebestanden, dus er is niets vooraf op te
    // halen: de templates komen uit deze repo via de gewone template-sync.
    referencedTemplates: [],
  };
}

/**
 * De Defender-baseline: één stage, want hier wacht niets op iets anders. Een eigen
 * `templateName` omdat CIPP bij een her-import op (repo, templateName) ontdubbelt; met de
 * Intune-baseline in één bestand zou elke tenant met Intune ook Defender-licenties nodig hebben.
 */
function buildDefender() {
  return {
    TemplateType: "BaselineTemplate",
    templateName: DEFENDER_BASELINE.templateName,
    description: DEFENDER_BASELINE.description,
    assignedTenants: [{ label: "Exported Template", value: "Exported Template", type: "Tenant" }],
    excludedTenants: [],
    alertEmails: "",
    alertWebhookUrl: "",
    stages: [
      {
        name: "Nu",
        logic: "and",
        conditions: [],
        // Eén instance per standard; zonder `#` is de standardnaam zelf de instance.
        standards: DEFENDER_BASELINE.standards.map((s) => ({
          standard: s.standard,
          instance: s.standard,
          variables: s.variables,
          remediateEnabled: true,
          alertEnabled: true,
          alertOnRemediate: false,
        })),
      },
    ],
    referencedTemplates: [],
  };
}

/**
 * De update-baseline: stage 1 rolt de update-pakketten uit, stage 2 Winget-AutoUpdate als
 * app-template. Het app-template staat in `referencedTemplates`, zodat de import-knop het uit
 * deze repo meeneemt vóór de baseline zelf (Import-CIPPBaselineTemplate) — anders verwijst
 * stage 2 naar een GUID die in CIPP nog niet bestaat.
 */
function buildUpdates(manifest, assignments) {
  // Een update-pakket kan net als de Baseline-pakketten een klasse-achtervoegsel hebben
  // (Updates-Ring3-Physical): Windows Update-ringen en Office-updates horen niet op AVD.
  const plan = packagePlan(manifest, assignments).filter((p) => UPDATE_PACKAGES[splitClassSuffix(p.pakket).base]);
  const missing = Object.keys(UPDATE_PACKAGES).filter((pkg) => !plan.some((p) => splitClassSuffix(p.pakket).base === pkg));
  if (missing.length > 0) throw new Error(`update-pakket(ten) zonder policies: ${missing.join(", ")}`);

  const appFile = path.join(APP_TEMPLATE_DIR, WAU_TEMPLATE_FILE);
  if (!fs.existsSync(appFile)) throw new Error(`AppTemplate/${WAU_TEMPLATE_FILE} ontbreekt. Draai eerst: node scripts/generate-app-templates.js`);
  const appRow = JSON.parse(fs.readFileSync(appFile, "utf8"));
  const app = { guid: appRow.GUID, name: JSON.parse(appRow.JSON).Displayname };

  const [nu, wau] = UPDATES_BASELINE.stages;
  return {
    TemplateType: "BaselineTemplate",
    templateName: UPDATES_BASELINE.templateName,
    description: UPDATES_BASELINE.description,
    assignedTenants: [{ label: "Exported Template", value: "Exported Template", type: "Tenant" }],
    excludedTenants: [],
    alertEmails: "",
    alertWebhookUrl: "",
    stages: [
      { ...nu, standards: plan.map(standardFor) },
      {
        ...wau,
        standards: [
          {
            standard: "IntuneAppTemplateDeploy",
            instance: "IntuneAppTemplateDeploy",
            variables: { templateIds: [{ label: app.name, value: app.guid }] },
            remediateEnabled: true,
            alertEnabled: true,
            alertOnRemediate: false,
          },
        ],
      },
    ],
    referencedTemplates: [{ path: `AppTemplate/${WAU_TEMPLATE_FILE}`, displayName: app.name, partition: "AppTemplate" }],
  };
}

/**
 * Een DLP-baseline, één per entry in DLP_BASELINES (bij Purview-DLP stage 1 de Notify-policies,
 * stage 2 handmatig de Block-policies). De
 * templates staan in `referencedTemplates`, zodat de import-knop ze uit deze repo meeneemt vóór
 * de baseline zelf — anders verwijzen de instances naar GUID's die in CIPP nog niet bestaan.
 * Eén instance per template, met de sleutel uit lib/purview-dlp.js achter de `#`: CIPP hangt
 * de resultaten en per-tenant uitzonderingen aan die sleutel, dus hij volgt niet de volgorde.
 */
function buildDlp(baseline) {
  const templates = baseline.policies.map((p) => {
    const file = path.join(REPO_ROOT, DLP_TEMPLATE_DIR, p.file);
    if (!fs.existsSync(file)) throw new Error(`${DLP_TEMPLATE_DIR}/${p.file} ontbreekt. Draai eerst: node scripts/generate-dlp-templates.js`);
    const row = JSON.parse(fs.readFileSync(file, "utf8"));
    return { ...p, guid: row.GUID, name: JSON.parse(row.JSON).name };
  });

  return {
    TemplateType: "BaselineTemplate",
    templateName: baseline.templateName,
    description: baseline.description,
    assignedTenants: [{ label: "Exported Template", value: "Exported Template", type: "Tenant" }],
    excludedTenants: [],
    alertEmails: "",
    alertWebhookUrl: "",
    stages: baseline.stages.map((stage, i) => ({
      ...stage,
      standards: templates
        .filter((t) => t.stage === i + 1)
        .map((t) => ({
          standard: "DlpCompliancePolicyTemplate",
          instance: `DlpCompliancePolicyTemplate#${t.key}`,
          variables: { dlpCompliancePolicyTemplate: { label: t.name, value: t.guid } },
          remediateEnabled: true,
          alertEnabled: true,
          alertOnRemediate: false,
        })),
    })),
    referencedTemplates: templates.map((t) => ({
      path: `${DLP_TEMPLATE_DIR}/${t.file}`,
      displayName: t.name,
      partition: "DlpCompliancePolicyTemplate",
    })),
  };
}

/** Schrijft `content` naar `outPath`, of meldt alleen dat hij achterloopt. Geeft false bij een achterstand in --check. */
function writeOrCheck(outPath, content, checkOnly) {
  const rel = path.relative(REPO_ROOT, outPath).split(path.sep).join("/");
  const before = fs.existsSync(outPath) ? fs.readFileSync(outPath, "utf8") : null;
  if (before === content) {
    console.log(`${rel} is bij.`);
    return true;
  }
  if (checkOnly) {
    console.error(`${rel} loopt achter. Draai: node scripts/generate-baseline-template.js`);
    return false;
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(outPath, content);
  console.log(`${rel} geschreven.`);
  return true;
}

function main() {
  const checkOnly = process.argv.includes("--check");

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  const assignments = fs.existsSync(ASSIGNMENTS_PATH) ? JSON.parse(fs.readFileSync(ASSIGNMENTS_PATH, "utf8")) : {};
  const baseline = build(manifest, assignments);
  const content = JSON.stringify(baseline, null, 2) + "\n";

  for (const stage of baseline.stages) {
    console.log(`  ${stage.name}`);
    for (const s of stage.standards) {
      const target = s.variables.customGroup || s.variables.assignTo;
      const filter = s.variables.assignmentFilter ? ` + filter ${s.variables.assignmentFilter}` : "";
      console.log(`    ${s.variables.intuneTemplatePackage.padEnd(44)} ${target}${filter}`);
    }
  }
  const updates = buildUpdates(manifest, assignments);
  console.log(`  ${updates.templateName}`);
  for (const stage of updates.stages) {
    console.log(`    ${stage.name}`);
    for (const s of stage.standards) {
      const v = s.variables;
      const label = v.intuneTemplatePackage || v.templateIds.map((t) => t.label).join(", ");
      const target = v.intuneTemplatePackage ? `${v.customGroup || v.assignTo}${v.excludeGroup ? ` (zonder ${v.excludeGroup})` : ""}${v.assignmentFilter ? ` + filter ${v.assignmentFilter}` : ""}` : "";
      console.log(`      ${label.padEnd(44)}${target}`);
    }
  }
  const defender = buildDefender();
  console.log(`  ${defender.templateName}`);
  for (const s of defender.stages[0].standards) console.log(`    ${s.standard}`);
  const dlps = DLP_BASELINES.map((b) => ({ file: b.file, baseline: buildDlp(b) }));
  for (const { baseline: dlp } of dlps) {
    console.log(`  ${dlp.templateName}`);
    for (const stage of dlp.stages) {
      console.log(`    ${stage.name}`);
      for (const s of stage.standards) console.log(`      ${s.variables.dlpCompliancePolicyTemplate.label}`);
    }
  }
  console.log("");

  const ok = [
    writeOrCheck(OUT_PATH, content, checkOnly),
    writeOrCheck(DEFENDER_OUT_PATH, JSON.stringify(defender, null, 2) + "\n", checkOnly),
    writeOrCheck(UPDATES_OUT_PATH, JSON.stringify(updates, null, 2) + "\n", checkOnly),
    ...dlps.map(({ file, baseline }) => writeOrCheck(path.join(OUT_DIR, file), JSON.stringify(baseline, null, 2) + "\n", checkOnly)),
  ];
  if (ok.includes(false)) process.exit(1);
}

main();
