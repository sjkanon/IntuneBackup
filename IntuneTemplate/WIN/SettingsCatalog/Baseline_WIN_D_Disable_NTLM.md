<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Disable NTLM

Zet de verouderde NTLM-authenticatie uit ten gunste van Kerberos. Breekt oude on-prem toepassingen en apparaten die geen Kerberos spreken — eerst testen.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-066-DDisableNTLM` |
| Bron | OpenIntuneBaseline Windows v3.8 — SC - Network Security - D - Disable NTLM |
| Bestand | [`Baseline_WIN_D_Disable_NTLM.json`](Baseline_WIN_D_Disable_NTLM.json) |

> Test dit eerst: NTLM uitzetten breekt oude on-prem toepassingen en apparaten die geen Kerberos spreken.

## Instellingen — 3

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_networksecurity_lanmanagerauthenticationlevel` | 5 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_networksecurity_restrictntlm_incomingntlmtraffic` | 2 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_networksecurity_restrictntlm_outgoingntlmtraffictoremoteservers` | 2 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
