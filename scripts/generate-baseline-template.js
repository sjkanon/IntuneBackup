#!/usr/bin/env node
/**
 * Generates the CIPP baselines in `BaselineTemplate/`, as files:
 *
 * - `Baseline.json`: the Intune baseline, packages per stage from the manifest;
 * - `Defender-Office365.json`: email protection (Safe Links, Safe Attachments, anti-spam,
 *   quarantine notifications) as Exchange/Defender standards, from `lib/defender-office.js`.
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
const { BASELINE_STAGES, PACKAGE_PREFIX, packagePlan } = require("./lib/templates");
const { DEFENDER_BASELINE } = require("./lib/defender-office");

const REPO_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_DIR = path.join(REPO_ROOT, "IntuneTemplate");
const MANIFEST_PATH = path.join(TEMPLATE_DIR, "_manifest.json");
const ASSIGNMENTS_PATH = path.join(TEMPLATE_DIR, "_assignments.json");
const OUT_DIR = path.join(REPO_ROOT, "BaselineTemplate");
const OUT_PATH = path.join(OUT_DIR, "Baseline.json");
const DEFENDER_OUT_PATH = path.join(OUT_DIR, "Defender-Office365.json");

const TEMPLATE_NAME = "CXNM - Standard - Baseline";

/** `CXNM - Standard - Baseline-SEC-Update-Ring1` -> `sec-update-ring1`; de sleutel achter de `#` in een instance. */
function instanceSuffix(pkg) {
  return pkg.slice(PACKAGE_PREFIX.length).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
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
      excludeGroup: "",
      assignmentFilter: "",
      assignmentFilterType: "include",
      verifyAssignments: entry.opties.assignTo !== "On",
      levenshteinDistance: 0,
    },
    remediateEnabled: true,
    alertEnabled: true,
    alertOnRemediate: false,
  };
}

function build(manifest, assignments) {
  const plan = packagePlan(manifest, assignments).filter((p) => p.pakket);

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
      console.log(`    ${s.variables.intuneTemplatePackage.padEnd(30)}${target}`);
    }
  }
  const defender = buildDefender();
  console.log(`  ${defender.templateName}`);
  for (const s of defender.stages[0].standards) console.log(`    ${s.standard}`);
  console.log("");

  const ok = [
    writeOrCheck(OUT_PATH, content, checkOnly),
    writeOrCheck(DEFENDER_OUT_PATH, JSON.stringify(defender, null, 2) + "\n", checkOnly),
  ];
  if (ok.includes(false)) process.exit(1);
}

main();
