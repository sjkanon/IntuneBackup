<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Kernel DMA Protection

Blokkeert randapparaten die rechtstreeks in het geheugen kunnen lezen en geen DMA-remapping ondersteunen.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-130-DKernelDMAProtection` |
| Bron | Microsoft Security Baseline (Windows 365 / Endpoint Security) via IntuneAdmin — waarde geverifieerd tegen Policy CSP DmaGuard/DeviceEnumerationPolicy. |
| Bestand | [`Baseline_WIN_D_Kernel_DMA_Protection.json`](Baseline_WIN_D_Kernel_DMA_Protection.json) |

> De enige echte impact: een oud dock, een externe grafische kaart of een PCIe-kaart zonder DMA-remapping werkt niet meer. Het apparaat zelf blijft gewoon werken — het randapparaat wordt niet opgestart. Test daarom met de docks die in de vloot zitten vóór je breed toewijst. Vraagt een herstart om actief te worden, en geldt niet voor 1394-, PCMCIA- en ExpressCard-apparaten.

## Instellingen — 1

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_dmaguard_deviceenumerationpolicy` | 0 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
