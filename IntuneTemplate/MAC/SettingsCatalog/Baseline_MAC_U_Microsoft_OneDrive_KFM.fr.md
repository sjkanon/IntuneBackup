<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_U_Microsoft_OneDrive_KFM.md) · [English](Baseline_MAC_U_Microsoft_OneDrive_KFM.en.md) · **Français**

# [Baseline] - MAC - U - Microsoft OneDrive KFM

Déplace le Bureau et les Documents du Mac vers OneDrive, afin que rien ne soit stocké uniquement en local.

| | |
|---|---|
| Platform | macOS |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Settings Catalog |
| Affectation | All Users |
| checkId | `INTUNE-BASE-054-MACUMicrosoftOneDriveKFM` |
| Source | OpenIntuneBaseline macOS v1.0 — Microsoft OneDrive - U - Known Folder Move |
| Fichier | [`Baseline_MAC_U_Microsoft_OneDrive_KFM.json`](Baseline_MAC_U_Microsoft_OneDrive_KFM.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.12 Prévention de la fuite de données<br>A.8.13 Sauvegarde des informations |
| NIS2 art. 21(2) | art. 21(2)(c) continuité des activités et gestion des crises |
| CIS Controls v8.1 | 11.2 Perform Automated Backups |
| NIST CSF 2.0 | PR.DS-11 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 15

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
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

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
