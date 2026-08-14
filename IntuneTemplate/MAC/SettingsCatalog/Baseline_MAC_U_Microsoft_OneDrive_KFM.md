<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - U - Microsoft OneDrive KFM

Verplaatst Bureaublad en Documenten van de Mac naar OneDrive, zodat er niets alleen lokaal staat.

| | |
|---|---|
| Platform | macOS |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Settings Catalog |
| Toewijzing | All Users |
| checkId | `INTUNE-BASE-054-MACUMicrosoftOneDriveKFM` |
| Bron | OpenIntuneBaseline macOS v1.0 — Microsoft OneDrive - U - Known Folder Move |
| Bestand | [`Baseline_MAC_U_Microsoft_OneDrive_KFM.json`](Baseline_MAC_U_Microsoft_OneDrive_KFM.json) |

## Instellingen — 15

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.managedclient.preferences_kfmsilentoptin` | %OrganizationId% |
| `com.apple.managedclient.preferences_blockexternalsync` | true |
| `com.apple.managedclient.preferences_disableautoconfig` | 0 |
| `com.apple.managedclient.preferences_disablepersonalsync` | true |
| `com.apple.managedclient.preferences_disabletutorial` | true |
| `com.apple.managedclient.preferences_kfmsilentoptinwithnotification` | false |
| `com.apple.managedclient.preferences_filesondemandenabled` | true |
| `com.apple.managedclient.preferences_enableallocsiclients` | true |
| `com.apple.managedclient.preferences_kfmblockoptout` | true |
| `com.apple.managedclient.preferences_hidedockicon` | true |
| `com.apple.managedclient.preferences_enableodignore` | *.lnk, *.pst, *.pkg, *.dmg |
| `com.apple.managedclient.preferences_kfmsilentoptindesktop` | true |
| `com.apple.managedclient.preferences_kfmsilentoptindocuments` | true |
| `com.apple.managedclient.preferences_openatlogin` | true |
| `com.apple.managedclient.preferences_kfmoptinwithwizard` | %OrganizationId% |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
