<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - D - Microsoft Edge Security

De beveiligingsinstellingen van Edge op macOS: SmartScreen, downloadcontrole en certificaatgedrag.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-042-MACDMicrosoftEdgeSecurity` |
| Bron | OpenIntuneBaseline macOS v1.0 — Microsoft Edge - D - Security |
| Bestand | [`Baseline_MAC_D_Microsoft_Edge_Security.json`](Baseline_MAC_D_Microsoft_Edge_Security.json) |

> Sinds september 2026 zet deze policy twee instellingen die OpenIntuneBaseline macOS v1.0 niet heeft: SSLErrorOverrideAllowed=false (een gebruiker kan niet meer doorklikken op een certificaatfout — de klassieke onderschepping van een verbinding) en MicrosoftEdgeInsiderPromotionEnabled=false. Beide gelijk aan [Baseline] - WIN - D - Microsoft Edge Security en aan OIB macOS v2.0 beta. Ze staan niet in de OIB v1.0-bron en blijven bij een nieuwe import als eigen instelling staan (carry, zie de kop van import-oib.js). Let op bij interne sites met een zelfondertekend certificaat: die zijn in Edge niet meer te openen tot het certificaat klopt. DownloadRestrictions blijft bewust op 1 (Block dangerous downloads). OIB v2.0 beta en de Windows-policy zetten 4 (Block malicious downloads), en dat blokkeert minder: 1 houdt elke download met een SmartScreen-waarschuwing tegen, 4 alleen downloads die SmartScreen als bekende malware aanmerkt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.23 Webfiltering<br>A.8.7 Bescherming tegen malware<br>A.8.20 Netwerkbeveiliging |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie<br>art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 9.3 Maintain and Enforce Network-Based URL Filters<br>10.1 Deploy and Maintain Anti-Malware Software<br>3.10 Encrypt Sensitive Data in Transit |
| NIST CSF 2.0 | PR.PS-01<br>DE.CM-09 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 31

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.managedclient.preferences_adssettingforintrusiveadssites` | 1 |
| `com.apple.managedclient.preferences_downloadrestrictions` | 1 |
| `com.apple.managedclient.preferences_importbrowsersettings` | false |
| `com.apple.managedclient.preferences_importhistory` | false |
| `com.apple.managedclient.preferences_importhomepage` | false |
| `com.apple.managedclient.preferences_importpaymentinfo` | false |
| `com.apple.managedclient.preferences_importsavedpasswords` | false |
| `com.apple.managedclient.preferences_importsearchengine` | false |
| `com.apple.managedclient.preferences_enterprisehardwareplatformapienabled` | false |
| `com.apple.managedclient.preferences_personalizationreportingenabled` | false |
| `com.apple.managedclient.preferences_browsernetworktimequeriesenabled` | true |
| `com.apple.managedclient.preferences_nativemessaginguserlevelhosts` | false |
| `com.apple.managedclient.preferences_autoimportatfirstrun` | 4 |
| `com.apple.managedclient.preferences_trackingprevention` | 2 |
| `com.apple.managedclient.preferences_clearbrowsingdataonexit` | false |
| `com.apple.managedclient.preferences_clearcachedimagesandfilesonexit` | false |
| `com.apple.managedclient.preferences_smartscreenenabled` | true |
| `com.apple.managedclient.preferences_smartscreenpuaenabled` | true |
| `com.apple.managedclient.preferences_experimentationandconfigurationservicecontrol` | 2 |
| `com.apple.managedclient.preferences_dnsinterceptionchecksenabled` | true |
| `com.apple.managedclient.preferences_autofilladdressenabled` | false |
| `com.apple.managedclient.preferences_autofillcreditcardenabled` | false |
| `com.apple.managedclient.preferences_enablemediarouter` | false |
| `com.apple.managedclient.preferences_proactiveauthenabled` | false |
| `com.apple.managedclient.preferences_hidefirstrunexperience` | true |
| `com.apple.managedclient.preferences_sslversionmin` | 2 |
| `com.apple.managedclient.preferences_preventsmartscreenpromptoverride` | true |
| `com.apple.managedclient.preferences_preventsmartscreenpromptoverrideforfiles` | true |
| `com.apple.managedclient.preferences_authschemes` | ntlm,negotiate |
| `com.apple.managedclient.preferences_sslerroroverrideallowed` | false |
| `com.apple.managedclient.preferences_microsoftedgeinsiderpromotionenabled` | false |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
