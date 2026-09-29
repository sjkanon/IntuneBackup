#!/usr/bin/env node
/**
 * Generates `BaselineTemplate/Baseline.json`: the CIPP baseline itself, as a file.
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
 *   node scripts/generate-baseline-template.js --check     writes nothing, exit 1 if it is out of date
 */

const fs = require("fs");
const path = require("path");
const { BASELINE_STAGES, packagePlan } = require("./lib/templates");

const REPO_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_DIR = path.join(REPO_ROOT, "IntuneTemplate");
const MANIFEST_PATH = path.join(TEMPLATE_DIR, "_manifest.json");
const ASSIGNMENTS_PATH = path.join(TEMPLATE_DIR, "_assignments.json");
const OUT_DIR = path.join(REPO_ROOT, "BaselineTemplate");
const OUT_PATH = path.join(OUT_DIR, "Baseline.json");

const TEMPLATE_NAME = "Baseline";

/** `Baseline-SEC-Update-Ring1` -> `sec-update-ring1`; de sleutel achter de `#` in een instance. */
function instanceSuffix(pkg) {
  return pkg.replace(/^Baseline-/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
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
      "De afgesproken Intune-baseline uit de baseline-repository. Elke stage rolt " +
      "Intune-templatepakketten uit; het lidmaatschap van een pakket volgt de repo, dus een " +
      "nieuwe policy komt er vanzelf bij. Wijs de tenants toe voor je hem laat draaien.",
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

function main() {
  const checkOnly = process.argv.includes("--check");

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  const assignments = fs.existsSync(ASSIGNMENTS_PATH) ? JSON.parse(fs.readFileSync(ASSIGNMENTS_PATH, "utf8")) : {};
  const baseline = build(manifest, assignments);
  const content = JSON.stringify(baseline, null, 2) + "\n";

  const rel = path.relative(REPO_ROOT, OUT_PATH).split(path.sep).join("/");
  for (const stage of baseline.stages) {
    console.log(`  ${stage.name}`);
    for (const s of stage.standards) {
      const target = s.variables.customGroup || s.variables.assignTo;
      console.log(`    ${s.variables.intuneTemplatePackage.padEnd(30)}${target}`);
    }
  }

  const before = fs.existsSync(OUT_PATH) ? fs.readFileSync(OUT_PATH, "utf8") : null;
  if (before === content) {
    console.log(`\n${rel} is bij.`);
    return;
  }
  if (checkOnly) {
    console.error(`\n${rel} loopt achter. Draai: node scripts/generate-baseline-template.js`);
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_PATH, content);
  console.log(`\n${rel} geschreven.`);
}

main();
