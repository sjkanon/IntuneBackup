#!/usr/bin/env node
/**
 * Zet het veld `Package` in elk template in IntuneTemplate/, afgeleid uit _manifest.json en
 * _assignments.json.
 *
 * `Package` is de vrije-tekstkolom waarop CIPP zijn pakketten groepeert. De standard
 * "Intune Template Package" in een baseline rolt in één keer élk template met dezelfde
 * waarde uit, en bepaalt dat lidmaatschap bij iedere run opnieuw — maar kopieert de
 * deploy-opties letterlijk op elk lid. Eén package is dus één toewijzingsdoel, en daarom
 * staat er niet meer op alle 141 templates hetzelfde. De verdeling en het waarom staan in
 * lib/templates.js bij `packageFor`.
 *
 * Dit script is de enige schrijver van dat veld. De importscripts zetten het bij een nieuw
 * of overschreven template meteen goed (via dezelfde functie), maar met de hand onderhouden
 * policies komen daar nooit langs, en een gewijzigde fase of toewijzing raakt het bestand
 * zelf niet. Draai dit dus na elke wijziging in _manifest.json of _assignments.json;
 * check-scope.js meldt het als het niet is gebeurd.
 *
 * Alleen het buitenste veld wordt aangeraakt, niet de genestelde JSON-string met de policy
 * zelf: de inhoud van een policy verandert hier niet.
 *
 * Gebruik:
 *   node scripts/set-packages.js            schrijft de bestanden bij die niet kloppen
 *   node scripts/set-packages.js --check     schrijft niets, exit 1 als er iets niet klopt
 */

const fs = require("fs");
const path = require("path");
const { listTemplateFiles, readTemplate, packageFor, packagePlan } = require("./lib/templates");

const REPO_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_DIR = path.join(REPO_ROOT, "IntuneTemplate");
const MANIFEST_PATH = path.join(TEMPLATE_DIR, "_manifest.json");
const ASSIGNMENTS_PATH = path.join(TEMPLATE_DIR, "_assignments.json");

function main() {
  const checkOnly = process.argv.includes("--check");

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  const assignments = fs.existsSync(ASSIGNMENTS_PATH) ? JSON.parse(fs.readFileSync(ASSIGNMENTS_PATH, "utf8")) : {};
  const byTarget = new Map((manifest.policies || []).map((p) => [p.target, p]));

  const changed = [];
  const problems = [];

  for (const file of listTemplateFiles(TEMPLATE_DIR)) {
    const template = readTemplate(file);
    const entry = byTarget.get(template.baseName);
    if (!entry) {
      problems.push(`${template.baseName}: geen regel in _manifest.json — geen package af te leiden`);
      continue;
    }
    const expected = packageFor(entry, assignments[template.displayName]);
    if (expected === null) {
      problems.push(`${template.baseName}: fase ${entry.fase} en de toewijzing leveren samen geen package op`);
      continue;
    }
    if (template.outer.Package === expected) continue;

    changed.push(`${template.baseName}: "${template.outer.Package ?? ""}" -> "${expected}"`);
    if (!checkOnly) {
      // Sleutelvolgorde van de rij blijft zoals hij is; alleen de waarde gaat om.
      const row = { ...template.outer, Package: expected };
      fs.writeFileSync(file, JSON.stringify(row) + "\n");
    }
  }

  console.log("Pakketindeling (bron: fase in _manifest.json + doel in _assignments.json)\n");
  for (const p of packagePlan(manifest, assignments)) {
    console.log(`  ${(p.pakket || "(geen package)").padEnd(30)}${String(p.leden.length).padStart(3)}  ${p.toewijzing}`);
  }

  if (changed.length > 0) {
    console.log(`\n${changed.length} template(s) ${checkOnly ? "kloppen niet" : "bijgewerkt"}:\n`);
    for (const c of changed) console.log(`  ${c}`);
  }
  if (problems.length > 0) {
    console.log(`\n${problems.length} probleem/problemen:\n`);
    for (const p of problems) console.log(`  ${p}`);
  }

  if (problems.length > 0 || (checkOnly && changed.length > 0)) {
    if (checkOnly && changed.length > 0) console.error("\nDraai: node scripts/set-packages.js");
    process.exit(1);
  }
  console.log(`\n${changed.length === 0 ? "Alle" : changed.length} template(s) ${changed.length === 0 ? "hadden al de juiste package" : "geschreven"}.`);
}

main();
