#!/usr/bin/env node
/**
 * Puts this clone on a different organisation: a different name prefix for every policy, CIPP
 * package and baseline, and/or a different CA repo URL. Both live in IntuneTemplate/_organisation.json.
 *
 * The prefix is not only read by the scripts; it is also in the data and the generated output —
 * every displayName in IntuneTemplate/, _assignments.json, the export file names, the docs. So a new
 * prefix is a rewrite of the whole repo, and this script does it in one go:
 *
 *  1. Replaces the old prefix with the new one in every text file in git, and in the file names.
 *     Also the form without hyphens before a platform ("Contoso Std WIN …"): Intune refuses a
 *     hyphen in an Autopilot profile name, so that one profile carries the prefix that way.
 *  2. _renames.json: the current name of each policy goes into its `previousNames`, so that
 *     Rename-BaselinePolicy.ps1 renames the policies in a tenant instead of CIPP deploying a
 *     second copy next to them. `previousNames` itself is not rewritten — those are old names.
 *  3. Writes _organisation.json.
 *  4. Regenerates what is derived from the name rather than copied from it: the GUID of the CIPP
 *     app templates (stable per name), the baseline that refers to it, the export and the docs.
 *
 * The new prefix must not be in the repo yet (outside _renames.json): text that already has it
 * cannot be told apart from text that gets it, and the next switch would take it along. The script
 * refuses then and shows where it is.
 *
 * sync-mirror.js runs this in a mirror whose own _organisation.json differs, so the mirror keeps
 * its own prefix while getting the content from here.
 *
 * Usage:
 *   node scripts/set-organisation.js --prefix "Contoso - "
 *   node scripts/set-organisation.js --ca-url https://github.com/<org>/<repo>/blob/main/
 *   node scripts/set-organisation.js --no-ca-url
 *   node scripts/set-organisation.js ... --dry-run        # only show what would change
 *   node scripts/set-organisation.js ... --no-generate    # skip step 4
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { ORGANISATION_PATH, readOrganisation, escapeRegExp } = require("./lib/organisation");

const REPO_ROOT = path.resolve(__dirname, "..");
const RENAMES_REL = "IntuneTemplate/_renames.json";
const ORGANISATION_REL = path.relative(REPO_ROOT, ORGANISATION_PATH).split(path.sep).join("/");

/** In file names on Windows, and in JSON strings and regexes the scripts build, these break things. */
const FORBIDDEN = /["\\/:*?<>|]/;

function parseArgs(argv) {
  const opts = { prefix: undefined, caUrl: undefined, dryRun: false, generate: true };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--prefix") opts.prefix = argv[++i];
    else if (arg === "--ca-url") opts.caUrl = argv[++i];
    else if (arg === "--no-ca-url") opts.caUrl = null;
    else if (arg === "--dry-run") opts.dryRun = true;
    else if (arg === "--no-generate") opts.generate = false;
    else {
      console.error(`Onbekende optie: ${arg}`);
      process.exit(2);
    }
  }
  if (opts.prefix === undefined && opts.caUrl === undefined) {
    console.error('Gebruik: node scripts/set-organisation.js [--prefix "<tekst> - "] [--ca-url <url> | --no-ca-url] [--dry-run] [--no-generate]');
    process.exit(2);
  }
  if (opts.prefix !== undefined) {
    if (!opts.prefix || !opts.prefix.endsWith(" - ") || FORBIDDEN.test(opts.prefix)) {
      console.error(`Ongeldig voorvoegsel ${JSON.stringify(opts.prefix)}: het eindigt op " - " en bevat geen " \\ / : * ? < > |.`);
      process.exit(2);
    }
  }
  if (opts.caUrl && !/^https:\/\/.+\/blob\/[^/]+\/$/.test(opts.caUrl)) {
    console.error(`Ongeldige CA-URL ${opts.caUrl}: verwacht https://…/blob/<branch>/`);
    process.exit(2);
  }
  return opts;
}

const git = (args) => execFileSync("git", ["-C", REPO_ROOT, ...args], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

/** Wat in git zit plus wat nieuw is en niet genegeerd wordt — een verse wijziging gaat ook mee. */
function repoFiles() {
  return git(["ls-files", "-z", "--cached", "--others", "--exclude-standard"])
    .split("\0")
    .filter(Boolean)
    .filter((rel, i, all) => all.indexOf(rel) === i && fs.existsSync(path.join(REPO_ROOT, rel)));
}

const isText = (buf) => !buf.includes(0);

/** "Contoso - Std - " -> "Contoso Std "; zie WIN-Autopilot-Deployment-Profile.json. */
const compact = (prefix) => prefix.split(" - ").filter(Boolean).join(" ") + " ";

/** Het voorvoegsel, en de vorm zonder koppeltekens — die alleen vóór een platform, anders te gretig. */
function replacePrefix(text, from, to) {
  const compactFrom = new RegExp(`${escapeRegExp(compact(from))}(?=(WIN|MAC|IOS|AND) )`, "g");
  return text.split(from).join(to).replace(compactFrom, () => compact(to));
}

function containsPrefix(text, prefix) {
  return text.includes(prefix) || new RegExp(`${escapeRegExp(compact(prefix))}(WIN|MAC|IOS|AND) `).test(text);
}

/** previousNames + target per policy, als tekst — zo blijft de opmaak van _renames.json staan. */
const RENAME_ENTRY_RE = /"previousNames": \[(.*?)\],(\s*)"target": (null|"(?:[^"\\]|\\.)*")/g;

function rewriteRenames(text, from, to) {
  let out = "";
  let last = 0;
  let renamed = 0;
  for (const m of text.matchAll(RENAME_ENTRY_RE)) {
    out += replacePrefix(text.slice(last, m.index), from, to);
    last = m.index + m[0].length;
    let previous = JSON.parse(`[${m[1]}]`);
    let target = JSON.parse(m[3]);
    if (target && target.startsWith(from)) {
      const next = to + target.slice(from.length);
      if (!previous.includes(target)) previous.push(target);
      previous = previous.filter((name) => name !== next);
      target = next;
      renamed++;
    }
    out += `"previousNames": [${previous.map((n) => JSON.stringify(n)).join(", ")}],${m[2]}"target": ${JSON.stringify(target)}`;
  }
  out += replacePrefix(text.slice(last), from, to);
  return { text: out, renamed };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const current = readOrganisation();
  const next = {
    prefix: opts.prefix ?? current.prefix,
    caRepoUrl: opts.caUrl === undefined ? current.caRepoUrl : opts.caUrl,
  };
  const prefixChanges = next.prefix !== current.prefix;
  if (!prefixChanges && next.caRepoUrl === current.caRepoUrl) {
    console.log("Er verandert niets.");
    return;
  }

  const files = repoFiles().filter((rel) => rel !== ORGANISATION_REL);
  const edits = [];
  const moves = [];

  if (prefixChanges) {
    const from = current.prefix;
    const to = next.prefix;

    // Staat het nieuwe voorvoegsel er al, dan is na de wissel niet meer te zien wat van wie was.
    const clashes = [];
    for (const rel of files) {
      if (rel === RENAMES_REL) continue;
      const buf = fs.readFileSync(path.join(REPO_ROOT, rel));
      if (rel.includes(to) || (isText(buf) && containsPrefix(buf.toString("utf8"), to))) clashes.push(rel);
    }
    if (clashes.length > 0) {
      console.error(`"${to}" staat al in ${clashes.length} bestand(en); haal het daar eerst weg:`);
      for (const rel of clashes.slice(0, 20)) console.error(`  ${rel}`);
      process.exit(1);
    }

    for (const rel of files) {
      const buf = fs.readFileSync(path.join(REPO_ROOT, rel));
      if (isText(buf)) {
        const text = buf.toString("utf8");
        if (rel === RENAMES_REL) {
          const result = rewriteRenames(text, from, to);
          if (result.text !== text) edits.push({ rel, text: result.text, note: `${result.renamed} policies` });
        } else if (containsPrefix(text, from)) {
          edits.push({ rel, text: replacePrefix(text, from, to) });
        }
      }
      if (rel.includes(from)) moves.push({ from: rel, to: rel.split(from).join(to) });
    }
  }

  for (const e of edits) console.log(`~ ${e.rel}${e.note ? ` (${e.note})` : ""}`);
  for (const m of moves) console.log(`> ${m.from}\n    -> ${m.to}`);
  console.log(`~ ${ORGANISATION_REL}`);
  if (prefixChanges) console.log(`\nVoorvoegsel "${current.prefix}" -> "${next.prefix}": ${edits.length} bestanden aangepast, ${moves.length} hernoemd.`);
  if (next.caRepoUrl !== current.caRepoUrl) console.log(`CA-repo: ${current.caRepoUrl || "(geen)"} -> ${next.caRepoUrl || "(geen)"}`);

  if (opts.dryRun) {
    console.log("Dry run — er is niets geschreven.");
    return;
  }

  for (const e of edits) fs.writeFileSync(path.join(REPO_ROOT, e.rel), e.text);
  for (const m of moves) {
    const target = path.join(REPO_ROOT, m.to);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.renameSync(path.join(REPO_ROOT, m.from), target);
  }

  const org = JSON.parse(fs.readFileSync(ORGANISATION_PATH, "utf8"));
  org.prefix = next.prefix;
  org.caRepoUrl = next.caRepoUrl;
  fs.writeFileSync(ORGANISATION_PATH, JSON.stringify(org, null, 2) + "\n");

  if (!opts.generate) {
    console.log("\nNiet opnieuw gegenereerd (--no-generate). Draai de pijplijn uit scripts/README.md.");
    return;
  }
  // Een nieuw proces per stap: de scripts lezen _organisation.json bij het laden.
  const steps = [
    ["generate-app-templates.js"],
    ["generate-baseline-template.js"],
    ["export-intunebackup.js"],
    ["generate-docs.js"],
    ["check-scope.js"],
    ["set-packages.js", "--check"],
  ];
  for (const [script, ...args] of steps) {
    console.log(`\n> node scripts/${script} ${args.join(" ")}`.trimEnd());
    execFileSync(process.execPath, [path.join(__dirname, script), ...args], { cwd: REPO_ROOT, stdio: ["ignore", "ignore", "inherit"] });
  }
  console.log("\nKlaar. Bekijk de diff; de policies in de tenants hernoem je met scripts/Rename-BaselinePolicy.ps1.");
}

main();
