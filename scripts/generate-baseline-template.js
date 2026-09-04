#!/usr/bin/env node
/**
 * Genereert `BaselineTemplate/Baseline.json`: de CIPP-baseline zelf, als bestand.
 *
 * `IntuneTemplate/` levert de policies, maar in CIPP staan templates er alleen — uitrollen
 * doet een **baseline**: een stel *standards* verdeeld over stages, waar tenants doorheen
 * schuiven. Dat scherm met de hand invullen betekent negen keer dezelfde standard toevoegen
 * en elke keer het juiste toewijzingsdoel kiezen; één typefout zet 80 policies op het
 * verkeerde publiek. Dus komt de baseline uit dezelfde bron als de rest.
 *
 * CIPP herkent het bestand aan `TemplateType: "BaselineTemplate"` en aan de map
 * `BaselineTemplate/` (Import-CIPPBaselineTemplate); het gaat niet naar de templates-tabel
 * maar naar de baseline-editor. Importeren: Tools → Community Repos → deze repo → dit bestand
 * → Import.
 *
 * Drie dingen die bewust zo staan:
 *
 * 1. **Pakketten, geen losse templates.** Elke stage krijgt `IntuneTemplatePackage`-instances
 *    en geen 141 losse `IntuneTemplate`-instances. CIPP lost het lidmaatschap van een pakket
 *    bij iedere run opnieuw op, dus een nieuwe policy in deze repo schuift vanzelf mee zonder
 *    dat de baseline wordt aangeraakt. Een baseline die CIPP zélf exporteert klapt pakketten
 *    plat naar losse templates — dat is een momentopname en precies wat we niet willen.
 * 2. **`assignedTenants` is de placeholder.** CIPP's eigen export doet hetzelfde: een
 *    geïmporteerde baseline is aan niemand toegewezen, zodat wie hem binnenhaalt bewust de
 *    tenants kiest. Er rolt dus niets uit door dit bestand alleen.
 * 3. **`remediateEnabled` staat aan.** Zonder dat rapporteert de baseline alleen en zet hij
 *    niets recht; dát is wat "de baseline bewaakt de tenant" betekent. `verifyAssignments`
 *    staat aan voor elk pakket dat toewijst, want een policy die er wél staat maar aan
 *    niemand hangt is precies de stille drift die dit hoort te vangen.
 *
 * Gebruik:
 *   node scripts/generate-baseline-template.js            schrijft het bestand
 *   node scripts/generate-baseline-template.js --check     schrijft niets, exit 1 als het achterloopt
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
      "De afgesproken Intune-baseline uit github.com/sjkanon/IntuneBackup. Elke stage rolt " +
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
