<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Cryptography

Dwingt af dat Microsoft Edge geen verbindingen onder TLS 1.2 opzet, ook niet als een server dat aanbiedt.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-128-DCryptography` |
| Bron | ISO/IEC 27001:2022 A.8.24, NIS2 art. 21(2)(h) — instelling uit CIS v3 Microsoft Edge L1 |
| Bestand | [`Baseline_WIN_D_Cryptography.json`](Baseline_WIN_D_Cryptography.json) |

> ISMP19 eist TLS 1.2 of hoger voor web- en clouddiensten. De WinINet-stack staat al goed (Internet Explorer Legacy), maar Edge zelf accepteerde tot nu toe wat de server aanbood. Let op: interne systemen die alleen TLS 1.0/1.1 spreken worden hierdoor onbereikbaar — dat is precies waarom dit een pilotpolicy is.

## Instellingen — 2

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_sslversionmin` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_sslversionmin_sslversionmin` | tls1.2 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
