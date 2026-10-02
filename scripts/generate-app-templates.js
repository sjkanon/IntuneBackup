#!/usr/bin/env node
/**
 * Generates `AppTemplate/*.json`: CIPP application templates for the Win32 apps in
 * `extras/windows/win32-apps/` that CIPP can deploy without an uploaded installer.
 *
 * CIPP cannot template a Win32 app with its own `.intunewin` — it has no way to upload a
 * customer's package. What it can do is a *custom application* (`win32ScriptApp`): it uploads
 * a tiny placeholder package of its own and runs a PowerShell script as the installer. So the
 * install script fetches the installer itself, and the template carries only scripts.
 *
 * The file is a CIPP table row (`PartitionKey: AppTemplate`), so Tools → Community Repos →
 * this repo → the file → Import writes it straight into the templates table. Deploy it from
 * Applications → Application Templates, or with the standard *Deploy Intune Application
 * Template*. The template assigns nothing (`AssignTo: On`): the assignment is chosen when it is
 * deployed, because a fase-2 app goes to the pilot group first.
 *
 * The scripts stay the source: this script only reads them. It refuses to build when the
 * pinned version, hash or product code differ between the scripts and New-WAUPackage.ps1, or
 * when the exclusion list in the install script differs from excluded_apps.txt — the
 * hand-built .intunewin and the CIPP template must install the same thing.
 *
 * Usage:
 *   node scripts/generate-app-templates.js            writes the files
 *   node scripts/generate-app-templates.js --check    writes nothing, exit 1 if out of date
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const REPO_ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(REPO_ROOT, "AppTemplate");
const WAU_DIR = path.join(REPO_ROOT, "extras", "windows", "win32-apps", "winget-autoupdate");

/** Same form as in import-oib.js: a UUIDv5-shaped GUID, stable per name. */
function stableGuid(name) {
  const h = crypto.createHash("sha1").update(`apptemplate:${name}`).digest("hex");
  const v = (parseInt(h[16], 16) & 0x3) | 0x8;
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-5${h.slice(13, 16)}-${v.toString(16)}${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

/** Scripts go to the device as-is; line endings normalised so a Windows checkout gives the same file. */
function readScript(dir, file) {
  return fs.readFileSync(path.join(dir, file), "utf8").replace(/^﻿/, "").replace(/\r\n/g, "\n");
}

function pinned(script, variable, file) {
  const m = script.match(new RegExp(`\\$${variable}\\s*=\\s*'([^']+)'`));
  if (!m) throw new Error(`${file}: no $${variable} found`);
  return m[1];
}

function hereString(script, variable, file) {
  const m = script.match(new RegExp(`\\$${variable}\\s*=\\s*@'\\n([\\s\\S]*?)\\n'@`));
  if (!m) throw new Error(`${file}: no here-string $${variable} found`);
  return m[1];
}

/** CIPP replaces %token% in the scripts per tenant; a stray one would silently change the script. */
function assertNoTokens(script, file) {
  const m = script.match(/%[A-Za-z0-9_()]+%/);
  if (m) throw new Error(`${file}: contains ${m[0]}, which CIPP would replace per tenant`);
}

function wauTemplate() {
  const install = readScript(WAU_DIR, "Install-WAU.ps1");
  const uninstall = readScript(WAU_DIR, "Uninstall-WAU.ps1");
  const detect = readScript(WAU_DIR, "Detect-WAU.ps1");
  const pkg = readScript(WAU_DIR, "New-WAUPackage.ps1");
  const excluded = readScript(WAU_DIR, "excluded_apps.txt").trim();

  for (const v of ["Version", "Sha256"]) {
    const a = pinned(install, v, "Install-WAU.ps1");
    const b = pinned(pkg, v, "New-WAUPackage.ps1");
    if (a !== b) throw new Error(`$${v} differs: Install-WAU.ps1 '${a}', New-WAUPackage.ps1 '${b}'`);
  }
  const code = pinned(uninstall, "ProductCode", "Uninstall-WAU.ps1");
  if (code !== pinned(pkg, "ProductCode", "New-WAUPackage.ps1")) {
    throw new Error("$ProductCode differs between Uninstall-WAU.ps1 and New-WAUPackage.ps1");
  }
  if (hereString(install, "ExcludedApps", "Install-WAU.ps1").trim() !== excluded) {
    throw new Error("The exclusion list in Install-WAU.ps1 differs from excluded_apps.txt");
  }
  for (const [file, s] of [["Install-WAU.ps1", install], ["Uninstall-WAU.ps1", uninstall], ["Detect-WAU.ps1", detect]]) {
    assertNoTokens(s, file);
  }

  const version = pinned(install, "Version", "Install-WAU.ps1");
  const appName = "CXNM - Standard - WIN - D - Winget-AutoUpdate";
  const config = {
    applicationName: appName,
    description: `Winget-AutoUpdate ${version} (Romanitho, MIT): updates every app winget knows, daily, as SYSTEM and per user. The install script downloads the pinned WAU.msi and checks its SHA-256. Source: IntuneBackup extras/windows/win32-apps/winget-autoupdate.`,
    publisher: "Romanitho",
    installScript: install,
    uninstallScript: uninstall,
    detectionScript: detect,
    InstallAsSystem: true,
    DisableRestart: true,
    runAs32Bit: false,
    enforceSignatureCheck: false,
    InstallationIntent: false,
    AssignTo: "On",
  };

  const displayName = "CXNM - Standard - Winget-AutoUpdate";
  const guid = stableGuid(displayName);
  const json = {
    Displayname: displayName,
    Description: `Winget-AutoUpdate ${version} as a CIPP custom application. Phase 2: deploy to the pilot group first, then all Windows devices.`,
    GUID: guid,
    Apps: [{ appType: "win32ScriptApp", appName, config: JSON.stringify(config) }],
  };
  return {
    file: "Winget-AutoUpdate.json",
    row: { PartitionKey: "AppTemplate", RowKey: guid, GUID: guid, JSON: JSON.stringify(json) },
  };
}

function main() {
  const check = process.argv.includes("--check");
  let stale = 0;
  for (const { file, row } of [wauTemplate()]) {
    const target = path.join(OUT_DIR, file);
    const content = JSON.stringify(row, null, 2) + "\n";
    const current = fs.existsSync(target) ? fs.readFileSync(target, "utf8").replace(/\r\n/g, "\n") : null;
    if (current === content) continue;
    if (check) {
      console.error(`Out of date: AppTemplate/${file}`);
      stale++;
    } else {
      fs.mkdirSync(OUT_DIR, { recursive: true });
      fs.writeFileSync(target, content);
      console.log(`Written: AppTemplate/${file}`);
    }
  }
  if (stale) {
    console.error("Run node scripts/generate-app-templates.js");
    process.exit(1);
  }
}

try {
  main();
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
