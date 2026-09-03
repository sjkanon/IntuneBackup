<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Enrollment Hardening

Eist een netwerkverbinding tijdens de eerste installatie, zodat een apparaat niet zonder beheer langs de inschrijving kan komen.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-141-DEnrollmentHardening` |
| Bron | IntuneAdmin/IntuneBaselines — Modern Workplace Expert, Baseline - Require Network In OOBE (TenantLockdown-CSP) |
| Bestand | [`Baseline_WIN_D_Enrollment_Hardening.json`](Baseline_WIN_D_Enrollment_Hardening.json) |

> Werkt via de TenantLockdown-CSP en geldt vanaf de volgende schone installatie. Zorg dat bekabeld of wifi tijdens OOBE beschikbaar is — bij een vloot zonder ethernet en zonder vooraf ingericht wifi-profiel loopt de gebruiker vast.

## Instellingen — 1

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `vendor_msft_tenantlockdown_requirenetworkinoobe` | true |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
