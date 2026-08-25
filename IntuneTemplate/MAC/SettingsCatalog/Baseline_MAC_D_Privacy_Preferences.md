<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - D - Privacy Preferences

Zet de privacyrechten (PPPC) van de beheertools vast: NinjaOne Remote en TeamViewer krijgen Toegankelijkheid, zodat toetsenbord- en muisbesturing tijdens een sessie werkt zonder dat de gebruiker het zelf hoeft goed te keuren — en zonder dat hij het kan intrekken.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-110-MACDPrivacyPreferences` |
| Bron | eigen baseline — OpenIntuneBaseline heeft geen PPPC-policy |
| Bestand | [`Baseline_MAC_D_Privacy_Preferences.json`](Baseline_MAC_D_Privacy_Preferences.json) |

> Alleen de Toegankelijkheid-service. Volledige schijftoegang en schermopname staan er bewust niet in: de eerste is een apart besluit, de tweede kan macOS sowieso niet via MDM toestaan — een profiel kan schermopname alleen weigeren, toestaan doet de gebruiker zelf.

## Instellingen — 33

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.tcc.configuration-profile-policy_com.apple.tcc.configuration-profile-policy` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility` | *(5 items)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 1* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_allowed` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_authorization` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_coderequirement` | identifier "com.ninjarmm.ncstreamer" and anchor apple generic and certificate 1[field.1.2.840.113635.100.6.… |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_identifier` | com.ninjarmm.ncstreamer |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_identifiertype` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_staticcode` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 2* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_allowed` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_authorization` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_coderequirement` | anchor apple generic and identifier "com.teamviewer.TeamViewer" and (certificate leaf[field.1.2.840.113635.… |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_identifier` | com.teamviewer.TeamViewer |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_identifiertype` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_staticcode` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 3* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_allowed` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_authorization` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_coderequirement` | anchor apple generic and identifier "com.teamviewer.TeamViewerHost" and (certificate leaf[field.1.2.840.113… |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_identifier` | com.teamviewer.TeamViewerHost |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_identifiertype` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_staticcode` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 4* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_allowed` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_authorization` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_coderequirement` | anchor apple generic and identifier "com.teamviewer.Desktop" and (certificate leaf[field.1.2.840.113635.100… |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_identifier` | com.teamviewer.Desktop |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_identifiertype` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_staticcode` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*item 5* | |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_allowed` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_authorization` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_coderequirement` | anchor apple generic and identifier "com.teamviewer.TeamViewerQS" and (certificate leaf[field.1.2.840.11363… |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_identifier` | com.teamviewer.TeamViewerQS |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_identifiertype` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.tcc.configuration-profile-policy_services_accessibility_item_staticcode` | false |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
