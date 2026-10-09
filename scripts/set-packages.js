#!/usr/bin/env node
/**
 * Sets the two derived fields in every template in IntuneTemplate/: `Package` and the
 * description (`Description`), both derived from _manifest.json and _assignments.json.
 *
 * `Package` is the free-text column on which CIPP groups its packages. The standard
 * "Intune Template Package" in a baseline deploys *every* template with the same value in one
 * go, and determines that membership again on every run — but copies the deploy options
 * verbatim onto every member. One package is therefore one assignment target, and that is why
 * not all 141 templates carry the same value any more. The split and the reasoning are in
 * lib/templates.js at `packageFor`.
 *
 * This script is the only writer of that field. The import scripts set it correctly right
 * away for a new or overwritten template (via the same function), but hand-maintained
 * policies never pass through there, and a changed fase or assignment does not touch the
 * file itself. So run this after every change to _manifest.json or _assignments.json;
 * check-scope.js reports it if that has not happened.
 *
 * The description is what an administrator sees next to the policy in Intune — in English,
 * see `composeDescription` in lib/templates.js. It lives in two places: `Description` in the
 * template (CIPP) and `description` in the policy body (IntuneBackupAndRestore). Beyond that
 * this script does not touch the nested JSON: a policy's settings do not change here, and
 * re-serialising an unchanged template produces exactly the same bytes.
 *
 * Usage:
 *   node scripts/set-packages.js            updates the files that are not correct
 *   node scripts/set-packages.js --check     writes nothing, exit 1 if anything is not correct
 */

const fs = require("fs");
const path = require("path");
const { listTemplateFiles, readTemplate, packageFor, packagePlan, composeDescription } = require("./lib/templates");
const { Translator } = require("./lib/i18n");

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
  const english = new Translator("en");

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
    const description = composeDescription(entry, assignments[template.displayName], english);
    // Een ADMX-body heeft geen `description`; die krijgt er dan ook geen bij.
    const hasBodyDescription = "description" in template.raw;
    const descriptionOk = template.inner.Description === description && (!hasBodyDescription || template.raw.description === description);
    if (template.outer.Package === expected && descriptionOk) continue;

    if (template.outer.Package !== expected) changed.push(`${template.baseName}: "${template.outer.Package ?? ""}" -> "${expected}"`);
    if (!descriptionOk) changed.push(`${template.baseName}: omschrijving`);
    if (!checkOnly) {
      // Sleutelvolgorde blijft zoals hij is; alleen de waarden gaan om.
      const raw = hasBodyDescription ? { ...template.raw, description } : template.raw;
      const inner = { ...template.inner, Description: description, RAWJson: JSON.stringify(raw) };
      const row = { ...template.outer, JSON: JSON.stringify(inner), Package: expected };
      fs.writeFileSync(file, JSON.stringify(row) + "\n");
    }
  }

  console.log("Pakketindeling (bron: fase in _manifest.json + doel in _assignments.json)\n");
  for (const p of packagePlan(manifest, assignments)) {
    console.log(`  ${(p.pakket || "(geen package)").padEnd(42)}${String(p.leden.length).padStart(3)}  ${p.toewijzing}`);
  }

  if (changed.length > 0) {
    console.log(`\n${changed.length} template(s) ${checkOnly ? "kloppen niet" : "bijgewerkt"}:\n`);
    for (const c of changed) console.log(`  ${c}`);
  }
  if (problems.length > 0) {
    console.log(`\n${problems.length} probleem/problemen:\n`);
    for (const p of problems) console.log(`  ${p}`);
  }

  if (english.missing.size > 0) {
    console.warn(`\nLet op: ${english.missing.size} tekst(en) zonder Engelse vertaling in _i18n/en.json — die gaan in het Nederlands de omschrijving in. Lijst: node scripts/generate-docs.js --missend`);
  }

  if (problems.length > 0 || (checkOnly && changed.length > 0)) {
    if (checkOnly && changed.length > 0) console.error("\nDraai: node scripts/set-packages.js");
    process.exit(1);
  }
  console.log(`\n${changed.length === 0 ? "Alle" : changed.length} template(s) ${changed.length === 0 ? "hadden al de juiste package" : "geschreven"}.`);
}

main();
