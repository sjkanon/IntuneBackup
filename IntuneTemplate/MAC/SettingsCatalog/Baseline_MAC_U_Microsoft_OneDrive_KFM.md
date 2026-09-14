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

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.12 Voorkomen van datalekken<br>A.8.13 Back-up van informatie |
| NIS2 art. 21(2) | art. 21(2)(c) bedrijfscontinuiteit en crisisbeheer |
| CIS Controls v8.1 | 11.2 Perform Automated Backups |
| NIST CSF 2.0 | PR.DS-11 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

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
