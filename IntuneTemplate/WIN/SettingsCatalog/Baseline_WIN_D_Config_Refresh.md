<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Config Refresh

Zet lokaal gewijzigde instellingen periodiek terug naar wat Intune voorschrijft, zodat handmatig geknoei op een apparaat vanzelf ongedaan wordt gemaakt.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-058-DConfigRefresh` |
| Bron | OpenIntuneBaseline Windows v4.0 — SC - Device Security - D - Config Refresh |
| Bestand | [`Baseline_WIN_D_Config_Refresh.json`](Baseline_WIN_D_Config_Refresh.json) |

> Zet lokaal gewijzigde MDM-instellingen periodiek terug — het tegengif tegen handmatig geknoei op een device.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.9 Configuratiebeheer |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process |
| NIST CSF 2.0 | PR.PS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 3

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_dmclient_provider_{providerid}` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_dmclient_provider_{providerid}_configrefresh_enabled` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_dmclient_provider_{providerid}_configrefresh_cadence` | 30 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
