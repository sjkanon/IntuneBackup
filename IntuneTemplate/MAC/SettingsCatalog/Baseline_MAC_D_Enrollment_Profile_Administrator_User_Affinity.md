<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - D - Enrollment Profile Administrator User Affinity

Doorloopt Setup Assistant voor een bedrijfs-Mac met user affinity en vergrendelde inschrijving, en maakt het aangemelde account aan als lokale beheerder.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog (enrollmentConfiguration) |
| Toewijzing | — |
| checkId | `INTUNE-BASE-115-MACDEnrollmentProfileAdministratorUserAffinity` |
| Bron | eigen baseline — OpenIntuneBaseline heeft geen inschrijfprofiel |
| Bestand | [`Baseline_MAC_D_Enrollment_Profile_Administrator_User_Affinity.json`](Baseline_MAC_D_Enrollment_Profile_Administrator_User_Affinity.json) |

> Alternatief voor [Baseline] - MAC - D - Enrollment Profile Standard User Affinity, geen aanvulling: de twee profielen verschillen in precies één instelling — wordt het aangemelde account beheerder of standaardgebruiker. Allebei op All Devices zou een conflict opleveren, dus ze staan bewust zonder toewijzing en horen op een eigen groep. Ze overlappen bovendien met enrollment/macos/ITCE-macOS-Corporate-ADE-Baseline.json, dat hetzelfde inschrijfprofiel via depMacOSEnrollmentProfile uitrolt en daar het beheerdersaccount itceadmin gebruikt in plaats van itce-aci-adm — kies één van de twee routes.

## Instellingen — 40

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `ade_macos_useraffinity` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`ade_macos_authenticationmethod` | 2 |
| `ade_macos_awaitconfiguration` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`ade_accountsettings_createlocaladmin` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`ade_accountsettings_adminaccountname` | itce-aci-adm |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`ade_accountsettings_adminaccountfullname` | ITCE Servicedesk |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`ade_accountsettings_hideusersgroups` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`ade_accountsettings_adminaccountpasswordrotation` | 14 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`ade_accountsettings_createlocalprimary` | 2 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`ade_accountsettings_prefillaccountinfo` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`ade_accountsettings_restrictediting` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`ade_accountsettings_primaryaccountfullname` | {{username}} |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`ade_accountsettings_primaryaccountname` | {{username}} |
| `ade_lockedenrollment` | 1 |
| `ade_setupassistant_department` | ITCE Servicedesk |
| `ade_setupassistant_departmentphone` | +32 (0)3 808 32 20 |
| `ade_setupassistant_locationservices` | 1 |
| `ade_setupassistant_restore` | 0 |
| `ade_setupassistant_appleid` | 0 |
| `ade_setupassistant_termsandconditions` | 0 |
| `ade_setupassistant_touchfaceid` | 1 |
| `ade_setupassistant_applepay` | 0 |
| `ade_setupassistant_siri` | 0 |
| `ade_setupassistant_diagnosticsdata` | 0 |
| `ade_setupassistant_filevault` | 1 |
| `ade_setupassistant_iclouddiagnostics` | 0 |
| `ade_setupassistant_icloudstorage` | 0 |
| `ade_setupassistant_appearance` | 1 |
| `ade_setupassistant_screentime` | 0 |
| `ade_setupassistant_privacy` | 0 |
| `ade_setupassistant_accessibility` | 1 |
| `ade_setupassistant_unlockwithwatch` | 0 |
| `ade_setupassistant_enablelockdownmode` | 0 |
| `ade_setupassistant_softwareupdate` | 0 |
| `ade_setupassistant_softwareupdatecompleted` | 0 |
| `ade_setupassistant_termsofaddress` | 0 |
| `ade_setupassistant_intelligence` | 0 |
| `ade_setupassistant_osshowcase` | 0 |
| `ade_setupassistant_appstore` | 1 |
| `ade_setupassistant_liquidglass` | 0 |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
