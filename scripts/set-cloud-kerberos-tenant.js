#!/usr/bin/env node
/**
 * Vult het tenant-id in in Baseline_MAC_D_Azure_Files_Cloud_Kerberos.
 *
 * Dat template wijst de macOS Kerberos-extensie naar de KDC-proxy van Entra:
 *
 *   kkdcp://login.microsoftonline.com/<tenant-id>/kerberos
 *
 * Het tenant-id staat er als `TENANT-ID-INVULLEN` in, omdat deze repo bewust geen tenant-id's
 * bevat. Bij Teams en OneDrive lost `%tenantid%` dat op: die templates dragen het token als
 * platte tekst, en CIPP vervangt het bij uitrol (Get-CIPPTextReplacement in CIPP-API). Een
 * custom macOS-profiel draagt zijn mobileconfig echter als base64 in `payload`, en daar komt
 * geen enkele `-replace` doorheen. Het token zou dus letterlijk in de KDC-URL belanden en er
 * zou stil geen ticket komen — geen foutmelding, alleen een share die om een wachtwoord
 * vraagt. Vandaar dit script: het decodeert de payload, vervangt de placeholder en codeert
 * opnieuw, zodat wat er in het template staat ook echt de waarde is die uitrolt.
 *
 * De uitkomst is een template mét tenant-id. Commit dat niet naar een gedeelde fork.
 *
 * Gebruik:
 *   node scripts/set-cloud-kerberos-tenant.js <tenant-id>
 *   node scripts/set-cloud-kerberos-tenant.js --check   toont wat er nu staat, schrijft niets
 */

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_PATH = path.join(
  REPO_ROOT,
  "IntuneTemplate",
  "MAC",
  "DeviceConfigurations",
  "Baseline_MAC_D_Azure_Files_Cloud_Kerberos.json"
);

const PLACEHOLDER = "TENANT-ID-INVULLEN";
const KDC_RE = /kkdcp:\/\/login\.microsoftonline\.com\/([^/]+)\/kerberos/;
const GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** De drie lagen uitpakken: Table Storage-rij -> .JSON -> .RAWJson -> base64-payload. */
function read() {
  const outer = JSON.parse(fs.readFileSync(TEMPLATE_PATH, "utf8"));
  const inner = JSON.parse(outer.JSON);
  const raw = JSON.parse(inner.RAWJson);
  const plist = Buffer.from(raw.payload, "base64").toString("utf8");
  return { outer, inner, raw, plist };
}

function currentTenant(plist) {
  const m = KDC_RE.exec(plist);
  return m ? m[1] : null;
}

function main() {
  const arg = process.argv[2];

  if (!arg) {
    console.error("Gebruik: node scripts/set-cloud-kerberos-tenant.js <tenant-id> | --check");
    process.exit(2);
  }

  const { outer, inner, raw, plist } = read();
  const huidig = currentTenant(plist);

  if (arg === "--check") {
    if (huidig === null) {
      console.error("Geen kkdcp-URL gevonden in de payload — is het template nog wel dit profiel?");
      process.exit(1);
    }
    if (huidig === PLACEHOLDER) {
      console.log(`Tenant-id staat nog op de placeholder ${PLACEHOLDER} — niet uitrollen.`);
      process.exit(1);
    }
    console.log(`Tenant-id in de KDC-URL: ${huidig}`);
    return;
  }

  if (!GUID_RE.test(arg)) {
    console.error(`"${arg}" is geen tenant-id. Verwacht een GUID; die staat op de Overzicht-pagina van het Entra-beheercentrum.`);
    process.exit(2);
  }

  if (huidig === null) {
    console.error("Geen kkdcp-URL gevonden in de payload — er valt niets te vervangen.");
    process.exit(1);
  }
  if (huidig === arg) {
    console.log(`Tenant-id stond al op ${arg}; niets veranderd.`);
    return;
  }

  const nieuw = plist.replace(KDC_RE, `kkdcp://login.microsoftonline.com/${arg}/kerberos`);
  raw.payload = Buffer.from(nieuw, "utf8").toString("base64");
  inner.RAWJson = JSON.stringify(raw);
  outer.JSON = JSON.stringify(inner);
  fs.writeFileSync(TEMPLATE_PATH, JSON.stringify(outer) + "\n");

  console.log(`Tenant-id: ${huidig} -> ${arg}`);
  console.log("Let op: het template draagt nu een tenant-id. Push dit niet naar een gedeelde fork.");
}

main();
