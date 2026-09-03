<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Audit Policy Enforcement

Laat de gedetailleerde auditinstellingen voorgaan op de oude categorie-instellingen, zodat de auditpolicy van de baseline daadwerkelijk bepaalt wat er wordt gelogd.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-126-DAuditPolicyEnforcement` |
| Bron | CIS v4 Windows 11 L1 en de Microsoft Security Baseline — instelling overgenomen uit het NIS2-profiel van IntuneAdmin, waarde geverifieerd tegen de settings catalog-definitie. |
| Bestand | [`Baseline_WIN_D_Audit_Policy_Enforcement.json`](Baseline_WIN_D_Audit_Policy_Enforcement.json) |

> Eén instelling, maar de goedkoopste van de hele set: hij voegt zelf niets toe en zorgt alleen dat wat er al staat ook echt geldt. Draai na uitrol op een testapparaat `auditpol /get /category:*` en vergelijk met de baseline-policy.

## Instellingen — 1

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_audit_forceauditpolicysubcategorysettingstooverrideauditpolicycategorysettings` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
