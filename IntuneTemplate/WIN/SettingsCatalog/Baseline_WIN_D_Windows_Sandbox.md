<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Windows Sandbox

Beperkt Windows Sandbox, dat anders een wegwerp-Windows opent met toegang tot het netwerk en het klembord van de host.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-089-DWindowsSandbox` |
| Bron | OpenIntuneBaseline Windows v3.8 — SC - Device Security - U - Windows Sandbox |
| Bestand | [`Baseline_WIN_D_Windows_Sandbox.json`](Baseline_WIN_D_Windows_Sandbox.json) |

> Device-scoped instellingen, dus D — zie de opmerking bij Device Guard.

## Instellingen — 6

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_windowssandbox_allowaudioinput` | 0 |
| `device_vendor_msft_policy_config_windowssandbox_allowclipboardredirection` | 1 |
| `device_vendor_msft_policy_config_windowssandbox_allownetworking` | 0 |
| `device_vendor_msft_policy_config_windowssandbox_allowprinterredirection` | 0 |
| `device_vendor_msft_policy_config_windowssandbox_allowvgpu` | 0 |
| `device_vendor_msft_policy_config_windowssandbox_allowvideoinput` | 0 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
