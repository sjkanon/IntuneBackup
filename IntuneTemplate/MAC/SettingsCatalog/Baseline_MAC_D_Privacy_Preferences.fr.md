<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_D_Privacy_Preferences.md) · [English](Baseline_MAC_D_Privacy_Preferences.en.md) · **Français**

# [Baseline] - MAC - D - Privacy Preferences

Uniquement pour les organisations qui utilisent NinjaOne ou TeamViewer. Fixe les autorisations de confidentialité (PPPC) des outils de gestion : NinjaOne Remote et TeamViewer obtiennent Accessibilité pour que la prise de contrôle à distance fonctionne, et les trois composants NinjaOne obtiennent Accès complet au disque — sans que l'utilisateur doive l'approuver, et sans qu'il puisse le révoquer.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| checkId | `INTUNE-BASE-110-MACDPrivacyPreferences` |
| Source | baseline propre — OpenIntuneBaseline n'a pas de policy PPPC |
| Fichier | [`Baseline_MAC_D_Privacy_Preferences.json`](Baseline_MAC_D_Privacy_Preferences.json) |

> L'enregistrement d'écran ne se trouve pas ici mais dans [Baseline] - MAC - D - Screen Recording : macOS ne permet pas à un MDM de l'accorder, c'est donc un profil personnalisé avec AllowStandardUserToSetSystemService au lieu d'une entrée du settings catalog. L'accès complet au disque pour OneDrive ne se trouve pas ici non plus : [Baseline] - MAC - D - Microsoft OneDrive s'en charge déjà.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.18 Utilisation de programmes utilitaires à privilèges |
| NIST CSF 2.0 | PR.AA-05 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 44

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `com.apple.tcc.configuration-profile-policy_com.apple.tcc.configuration-profile-policy` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility` | *(5 items)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 1* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_authorization` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_coderequirement` | identifier "com.ninjarmm.ncstreamer" and anchor apple generic and certificate 1[field.1.2.840.113635.100.6.… |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_identifier` | com.ninjarmm.ncstreamer |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_identifiertype` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_staticcode` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 2* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_authorization` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_coderequirement` | anchor apple generic and identifier "com.teamviewer.TeamViewer" and (certificate leaf[field.1.2.840.113635.… |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_identifier` | com.teamviewer.TeamViewer |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_identifiertype` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_staticcode` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 3* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_authorization` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_coderequirement` | anchor apple generic and identifier "com.teamviewer.TeamViewerHost" and (certificate leaf[field.1.2.840.113… |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_identifier` | com.teamviewer.TeamViewerHost |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_identifiertype` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_staticcode` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 4* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_authorization` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_coderequirement` | anchor apple generic and identifier "com.teamviewer.Desktop" and (certificate leaf[field.1.2.840.113635.100… |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_identifier` | com.teamviewer.Desktop |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_identifiertype` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_staticcode` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 5* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_authorization` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_coderequirement` | anchor apple generic and identifier "com.teamviewer.TeamViewerQS" and (certificate leaf[field.1.2.840.11363… |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_identifier` | com.teamviewer.TeamViewerQS |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_identifiertype` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_staticcode` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles` | *(3 items)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 1* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_authorization` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_coderequirement` | identifier "ninjarmm-macagent" and anchor apple generic and certificate 1[field.1.2.840.113635.100.6.2.6] /… |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_identifier` | /Applications/NinjaRMMAgent/programfiles/ninjarmm-macagent |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_identifiertype` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_staticcode` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 2* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_authorization` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_coderequirement` | identifier "com.ninjarmm.ncstreamer" and anchor apple generic and certificate 1[field.1.2.840.113635.100.6.… |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_identifier` | com.ninjarmm.ncstreamer |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_identifiertype` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_staticcode` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 3* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_authorization` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_coderequirement` | identifier lockhart and anchor apple generic and certificate 1[field.1.2.840.113635.100.6.2.6] /* exists */… |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_identifier` | /Applications/NinjaRMMAgent/programfiles/lockhart/bin/lockhart |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_identifiertype` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_systempolicyallfiles_item_staticcode` | false |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
