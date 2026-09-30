<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_D_Microsoft_OneDrive.md) · [English](Baseline_MAC_D_Microsoft_OneDrive.en.md) · **Français**

# [Baseline] - MAC - D - Microsoft OneDrive

Connecte automatiquement le client OneDrive sur le Mac avec le compte professionnel et lui accorde les droits d'accès que macOS exige.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | OpenIntuneBaseline macOS v1.0 — Microsoft OneDrive - D - Service and Access |
| Fichier | [`Baseline_MAC_D_Microsoft_OneDrive.json`](Baseline_MAC_D_Microsoft_OneDrive.json) |

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.9 Gestion de la configuration |
| NIST CSF 2.0 | PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 20

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `com.apple.servicemanagement_com.apple.servicemanagement` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules` | *(2 items)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 1* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_comment` | OneDrive (Standalone) |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_ruletype` | 3 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_rulevalue` | com.microsoft.OneDrive |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 2* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_comment` | OneDrive Launcher |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_ruletype` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.servicemanagement_rules_item_rulevalue` | com.microsoft.OneDriveLauncher |
| `com.apple.tcc.configuration-profile-policy_com.apple.tcc.configuration-profile-policy` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_authorization` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_coderequirement` | identifier "com.microsoft.OneDrive" and anchor apple generic and certificate 1[field.1.2.840.113635.100.6.2… |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_identifier` | com.microsoft.OneDrive |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_identifiertype` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_staticcode` | false |
| `com.apple.system-extension-policy_com.apple.system-extension-policy` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.system-extension-policy_allowedsystemextensions` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.system-extension-policy_allowedsystemextensions_generickey` | com.microsoft.OneDrive.FinderSync |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.system-extension-policy_allowedsystemextensions_generickey_keytobereplaced` | UBF8T346G9 |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
