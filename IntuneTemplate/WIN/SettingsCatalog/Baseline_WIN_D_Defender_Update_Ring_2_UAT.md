<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Defender Update Ring 2 UAT

Tweede ring voor Defender-updates: loopt achter op de pilot en voor op productie.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog (endpointSecurityAntivirus) |
| Toewijzing | — |
| checkId | `INTUNE-BASE-062-DDefenderUpdateRing2UAT` |
| Bron | OpenIntuneBaseline Windows v4.0 — ES - Defender Antivirus Updates - Ring 2 - UAT |
| Bestand | [`Baseline_WIN_D_Defender_Update_Ring_2_UAT.json`](Baseline_WIN_D_Defender_Update_Ring_2_UAT.json) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Bescherming tegen malware<br>A.8.8 Beheer van technische kwetsbaarheden<br>A.8.32 Wijzigingsbeheer |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 10.2 Configure Automatic Anti-Malware Signature Updates |
| NIST CSF 2.0 | PR.PS-02 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 3

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_defender_configuration_engineupdateschannel` | 4 |
| `device_vendor_msft_defender_configuration_platformupdateschannel` | 4 |
| `device_vendor_msft_defender_configuration_securityintelligenceupdateschannel` | 4 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
