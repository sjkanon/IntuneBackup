/**
 * The Windows updates baseline: Windows Update rings, Edge, Microsoft 365 Apps and every other
 * app winget knows (Winget-AutoUpdate). Read by `lib/templates.js`, which gives these policies
 * their own CIPP packages, and by `generate-baseline-template.js`, which writes
 * `BaselineTemplate/Windows-Updates.json`.
 *
 * Why a separate baseline and not stage 1 of `Baseline.json`: patching is the part every tenant
 * needs, also a tenant that does not (yet) get the full Intune baseline. With its own packages
 * the policies are in exactly one baseline — a template carries one `Package`, so being in both
 * would mean two baselines guarding the same policy with their own assignment options.
 *
 * Why Ring 3 is a package of its own: it goes to all devices *except* the two ring groups.
 * Without that exclusion a device in SEC-Update-Ring1 gets two update rings, Intune reports a
 * Conflict, and the disputed settings (deferral, deadline) are applied by neither. A package
 * shares its assignment options with every member, so the exclusion cannot sit on the package
 * that also carries Edge and Office.
 *
 * Winget-AutoUpdate comes in as a CIPP application template (`IntuneAppTemplateDeploy`). That
 * standard only checks whether an app *with that name* exists and takes the assignment from the
 * template itself, so the template it deploys is a separate one assigned to all devices
 * (`AppTemplate/Winget-AutoUpdate-AllDevices.json`, see generate-app-templates.js). It sits in
 * stage 2 so it starts two weeks after the update rings are compliant.
 */

const { PREFIX } = require("./organisation");

const UPDATES_PREFIX = PREFIX + "Updates-";

const RING_GROUPS = ["SEC-Update-Ring1", "SEC-Update-Ring2"];

/**
 * Pakket -> deploy-opties, dezelfde velden als `deployOptionsForPackage` in lib/templates.js.
 * De volgorde hier is ook de volgorde in de baseline en in de docs.
 */
const UPDATE_PACKAGES = {
  [UPDATES_PREFIX + "Ring3"]: { assignTo: "AllDevices", customGroup: "", excludeGroup: RING_GROUPS.join(",") },
  [UPDATES_PREFIX + "SEC-Update-Ring1"]: { assignTo: "customGroup", customGroup: "SEC-Update-Ring1", excludeGroup: "" },
  [UPDATES_PREFIX + "SEC-Update-Ring2"]: { assignTo: "customGroup", customGroup: "SEC-Update-Ring2", excludeGroup: "" },
  [UPDATES_PREFIX + "Devices"]: { assignTo: "AllDevices", customGroup: "", excludeGroup: "" },
};

/** Template (bestandsnaam zonder .json) -> pakket. Wat hier niet staat, blijft in Baseline.json. */
const UPDATE_PACKAGE_BY_TARGET = {
  Baseline_WIN_D_Windows_Update_Ring_3_Production: UPDATES_PREFIX + "Ring3",
  Baseline_WIN_D_Windows_Update_Ring_1_Pilot: UPDATES_PREFIX + "SEC-Update-Ring1",
  Baseline_WIN_D_Windows_Update_Ring_2_UAT: UPDATES_PREFIX + "SEC-Update-Ring2",
  Baseline_WIN_D_Microsoft_Edge_Updates: UPDATES_PREFIX + "Devices",
  Baseline_WIN_D_Microsoft_Office_Updates: UPDATES_PREFIX + "Devices",
};

/** Het app-template dat stage 2 uitrolt; generate-app-templates.js schrijft het. */
const WAU_TEMPLATE_FILE = "Winget-AutoUpdate-AllDevices.json";

const UPDATES_BASELINE = {
  templateName: PREFIX + "Windows Updates",
  description:
    "Patching for Windows devices: Windows Update rings (Ring 3 on all devices except the ring " +
    "groups SEC-Update-Ring1 and SEC-Update-Ring2), Microsoft Edge and Microsoft 365 Apps update " +
    "policies, and Winget-AutoUpdate for every other app winget knows, two weeks after the rings " +
    "are compliant. Package membership follows the repo. Assign the tenants before you run it.",
  stages: [
    { name: "Nu", logic: "and", conditions: [] },
    // Zelfde drempel als de pilotstage in Baseline.json: alles staat aantoonbaar, en al twee weken.
    { name: "Winget-AutoUpdate", logic: "and", conditions: [{ type: "success" }, { type: "time", days: 2, unit: "weeks" }] },
  ],
};

module.exports = { UPDATES_PREFIX, UPDATE_PACKAGES, UPDATE_PACKAGE_BY_TARGET, UPDATES_BASELINE, WAU_TEMPLATE_FILE };
