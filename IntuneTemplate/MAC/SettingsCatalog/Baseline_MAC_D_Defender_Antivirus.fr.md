<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_D_Defender_Antivirus.md) · [English](Baseline_MAC_D_Defender_Antivirus.en.md) · **Français**

# [Baseline] - MAC - D - Defender Antivirus

Protection en temps réel, protection cloud et comportement d'analyse de Defender sur macOS.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | OpenIntuneBaseline macOS v1.0 — Defender Antivirus - D - Antivirus Configuration |
| Fichier | [`Baseline_MAC_D_Defender_Antivirus.json`](Baseline_MAC_D_Defender_Antivirus.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Protection contre les programmes malveillants |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 10.1 Deploy and Maintain Anti-Malware Software<br>10.2 Configure Automatic Anti-Malware Signature Updates<br>10.6 Centrally Manage Anti-Malware Software |
| NIST CSF 2.0 | DE.CM-09 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 26

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `com.apple.managedclient.preferences_disallowedthreatactions` | allow, restore |
| `com.apple.managedclient.preferences_enforcementlevel_antivirusengine` | 2 |
| `com.apple.managedclient.preferences_exclusionsmergepolicy` | 1 |
| `com.apple.managedclient.preferences_scanafterdefinitionupdate` | true |
| `com.apple.managedclient.preferences_scanarchives` | true |
| `com.apple.managedclient.preferences_threattypesettings` | *(2 items)* |
| &nbsp;&nbsp;&nbsp;&nbsp;*item 1* | |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.managedclient.preferences_threattypesettings_item_value` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.managedclient.preferences_threattypesettings_item_key` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;*item 2* | |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.managedclient.preferences_threattypesettings_item_value` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.managedclient.preferences_threattypesettings_item_key` | 1 |
| `com.apple.managedclient.preferences_threattypesettingsmergepolicy` | 1 |
| `com.apple.managedclient.preferences_automaticdefinitionupdateenabled` | true |
| `com.apple.managedclient.preferences_cloudblocklevel` | 0 |
| `com.apple.managedclient.preferences_diagnosticlevel` | 0 |
| `com.apple.managedclient.preferences_automaticsamplesubmission` | true |
| `com.apple.managedclient.preferences_enabled` | true |
| `com.apple.managedclient.preferences_earlypreview` | false |
| `com.apple.managedclient.preferences_systemextensions` | 0 |
| `com.apple.managedclient.preferences_enforcementlevel` | 2 |
| `com.apple.managedclient.preferences_enforcementlevel_tamperprotection` | 2 |
| `com.apple.managedclient.preferences_exclusions_tamperprotection` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.managedclient.preferences_exclusions_item_path_tamperprotection` | /Library/Intune/Microsoft Intune Agent.app/Contents/MacOS/IntuneMdmDaemon |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.managedclient.preferences_exclusions_item_signingid_tamperprotection` | IntuneMdmDaemon |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.managedclient.preferences_exclusions_item_teamid_tamperprotection` | UBF8T346G9 |
| `com.apple.managedclient.preferences_consumerexperience` | 1 |
| `com.apple.managedclient.preferences_hidestatusmenuicon` | false |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
