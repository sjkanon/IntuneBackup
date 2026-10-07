#!/usr/bin/env node
/**
 * Generates `DlpCompliancePolicyTemplate/*.json`: CIPP DLP policy templates for Microsoft
 * Purview, from the definitions in `lib/purview-dlp.js` (which explains the policy choices).
 *
 * Each file is a CIPP table row (`PartitionKey: DlpCompliancePolicyTemplate`), so the template
 * sync and Tools → Community Repos → Import write it straight into the templates table, keeping
 * its RowKey — which is what `BaselineTemplate/Purview-DLP.json` references. The folder name is
 * the partition on purpose: that is where Import-CIPPBaselineTemplate looks when a referenced
 * file has moved.
 *
 * The template body has the shape Invoke-AddDlpCompliancePolicyTemplate stores and
 * Set-CIPPDlpCompliancePolicy deploys: policy parameters plus `RuleParams`, one entry per rule.
 *
 * Usage:
 *   node scripts/generate-dlp-templates.js            writes the files
 *   node scripts/generate-dlp-templates.js --check    writes nothing, exit 1 if out of date
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { DLP_POLICIES, DLP_TEMPLATE_DIR } = require("./lib/purview-dlp");

const REPO_ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(REPO_ROOT, DLP_TEMPLATE_DIR);

/** Same form as in generate-app-templates.js: a UUIDv5-shaped GUID, stable per name. */
function stableGuid(name) {
  const h = crypto.createHash("sha1").update(`dlptemplate:${name}`).digest("hex");
  const v = (parseInt(h[16], 16) & 0x3) | 0x8;
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-5${h.slice(13, 16)}-${v.toString(16)}${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

/** Limits Purview enforces only at deploy time, when one bad rule fails the whole policy. */
function validate(policies) {
  const errors = [];
  const ruleNames = new Set();
  for (const { policy } of policies) {
    if (policy.name.length > 64) errors.push(`policy name over 64 characters: ${policy.name}`);
    for (const rule of policy.RuleParams) {
      if (rule.Name.length > 64) errors.push(`rule name over 64 characters: ${rule.Name}`);
      // Rule names are unique tenant-wide; CIPP skips a rule whose name another policy owns.
      if (ruleNames.has(rule.Name)) errors.push(`rule name used twice: ${rule.Name}`);
      ruleNames.add(rule.Name);
      if ((rule.NotifyPolicyTipCustomText || "").length > 256) errors.push(`policy tip over 256 characters: ${rule.Name}`);
    }
  }
  if (errors.length) throw new Error(errors.join("\n"));
}

function row({ policy }) {
  const guid = stableGuid(policy.name);
  // `Comment` is what New-DlpCompliancePolicy takes; `comments` is what CIPP's template list shows.
  const json = { name: policy.name, comments: policy.comments, Comment: policy.comments, ...policy };
  return { PartitionKey: "DlpCompliancePolicyTemplate", RowKey: guid, GUID: guid, JSON: JSON.stringify(json) };
}

function main() {
  const check = process.argv.includes("--check");
  validate(DLP_POLICIES);
  let stale = 0;
  for (const p of DLP_POLICIES) {
    const target = path.join(OUT_DIR, p.file);
    const content = JSON.stringify(row(p), null, 2) + "\n";
    const current = fs.existsSync(target) ? fs.readFileSync(target, "utf8").replace(/\r\n/g, "\n") : null;
    if (current === content) continue;
    if (check) {
      console.error(`Out of date: ${DLP_TEMPLATE_DIR}/${p.file}`);
      stale++;
    } else {
      fs.mkdirSync(OUT_DIR, { recursive: true });
      fs.writeFileSync(target, content);
      console.log(`Written: ${DLP_TEMPLATE_DIR}/${p.file}`);
    }
  }
  if (stale) {
    console.error("Run node scripts/generate-dlp-templates.js");
    process.exit(1);
  }
}

module.exports = { stableGuid };

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
