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

> Eén instelling, maar de goedkoopste van de hele set: hij voegt zelf niets toe en zorgt alleen dat wat er al staat ook echt geldt. Draai na uitrol op een testapparaat `auditpol /get /category:*` en vergelijk met de baseline-policy. Daarnaast wordt OneSettings-auditing aangezet: Windows legt vast wanneer het configuratie ophaalt bij de OneSettings-dienst. Zonder dat spoor is een wijziging die daarvandaan komt achteraf niet te zien.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.15 Logging<br>A.8.16 Monitoringactiviteiten |
| NIS2 art. 21(2) | art. 21(2)(b) incidentbehandeling |
| CIS Controls v8.1 | 8.2 Collect Audit Logs<br>8.5 Collect Detailed Audit Logs |
| NIST CSF 2.0 | PR.PS-04 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 2

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_audit_forceauditpolicysubcategorysettingstooverrideauditpolicycategorysettings` | 1 |
| `device_vendor_msft_policy_config_system_enableonesettingsauditing` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
