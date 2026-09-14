<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - U - Microsoft Edge Management

Staat de Edge Management Service toe op beheerde apparaten en laat het beleid dat daar wordt ingesteld vóór lokaal en MDM-beleid gaan, zodat Intune en die dienst elkaar niet tegenwerken.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-171-UMicrosoftEdgeManagement` |
| Bron | OpenIntuneBaseline Windows v4.0 — SC - Microsoft Edge - U - Management |
| Bestand | [`Baseline_WIN_U_Microsoft_Edge_Management.json`](Baseline_WIN_U_Microsoft_Edge_Management.json) |

> Nieuw in OIB v4.0. Verplicht niemand om de Edge Management Service (admin.cloud.microsoft → Edge) te gebruiken; zolang daar niets is ingesteld verandert er niets. De versie- en extensiemonitoring in die dienst is gratis rapportage en werkt ook zonder verder beleid. Beheer in die portal vraagt de Entra-rol Edge Administrator.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.9 Configuratiebeheer |
| NIST CSF 2.0 | PR.PS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 5

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `user_vendor_msft_policy_config_microsoft_edgev119~policy~microsoft_edge~manageability_edgemanagementuserpolicyoverridescloudmachinepolicy` | 1 |
| `user_vendor_msft_policy_config_microsoft_edgev115~policy~microsoft_edge~manageability_edgemanagementenabled` | 1 |
| `user_vendor_msft_policy_config_microsoft_edgev115~policy~microsoft_edge~manageability_edgemanagementextensionsfeedbackenabled` | 1 |
| `user_vendor_msft_policy_config_microsoft_edgev119~policy~microsoft_edge~manageability_edgemanagementpolicyoverridesplatformpolicy` | 1 |
| `user_vendor_msft_policy_config_microsoft_edgev89~policy~microsoft_edge~manageability_mamenabled` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
