<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Security_Log_Monitoring.md) · [English](Baseline_WIN_D_Security_Log_Monitoring.en.md) · **Français**

# CXNM - Standard - WIN - D - Security Log Monitoring

Avertit dans le journal Système dès que le journal Sécurité est plein à 90 % et journalise l'exécution du pipeline de tous les modules PowerShell, afin que lors d'un incident le journal n'ait pas été écrasé à l'insu de tous et que l'activité PowerShell soit entièrement traçable.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | CIS v4 Windows 11 L1 (MSS WarningLevel, profil CISv4 d'IntuneAdmin) et la recommandation Microsoft pour la journalisation PowerShell ('PowerShell ♥ the Blue Team') — valeurs vérifiées par rapport aux définitions du settings catalog |
| Fichier | [`Baseline_WIN_D_Security_Log_Monitoring.json`](Baseline_WIN_D_Security_Log_Monitoring.json) |

> Aucun chevauchement : `turnonpowershellscriptblocklogging` (Security Hardening) et `enabletranscripting` (Logging) sont des ids différents. La taille du journal PowerShell/Operational ne peut pas être définie via le settings catalog — une remediation est prévue pour cela dans extras/windows/remediations/event-log-sizes.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.15 Journalisation<br>A.8.16 Activités de surveillance |
| NIS2 art. 21(2) | art. 21(2)(b) gestion des incidents |
| CIS Controls v8.1 | 8.2 Collect Audit Logs<br>8.3 Ensure Adequate Audit Log Storage<br>8.8 Collect Command-Line Audit Logs |
| NIST CSF 2.0 | PR.PS-04<br>DE.CM-09 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 4

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_admx_mss-legacy_pol_mss_warninglevel` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_mss-legacy_pol_mss_warninglevel_warninglevel` | 90 |
| `device_vendor_msft_policy_config_admx_powershellexecutionpolicy_enablemodulelogging` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_powershellexecutionpolicy_enablemodulelogging_listbox_modulenames` | * |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
