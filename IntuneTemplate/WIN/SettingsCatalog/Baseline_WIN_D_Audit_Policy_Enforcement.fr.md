<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Audit_Policy_Enforcement.md) · [English](Baseline_WIN_D_Audit_Policy_Enforcement.en.md) · **Français**

# CXNM - Standard - WIN - D - Audit Policy Enforcement

Donne la priorité aux paramètres d'audit avancés sur les anciens paramètres par catégorie, afin que la policy d'audit de la baseline détermine réellement ce qui est journalisé.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | CIS v4 Windows 11 L1 et la Microsoft Security Baseline — paramètre repris du profil NIS2 d'IntuneAdmin, valeur vérifiée par rapport à la définition du settings catalog. |
| Fichier | [`Baseline_WIN_D_Audit_Policy_Enforcement.json`](Baseline_WIN_D_Audit_Policy_Enforcement.json) |

> Un seul paramètre, mais le moins coûteux de tout l'ensemble : il n'ajoute rien lui-même et garantit seulement que ce qui est déjà en place s'applique réellement. Après le déploiement, exécutez `auditpol /get /category:*` sur un appareil de test et comparez avec la policy de la baseline. En outre, l'audit OneSettings est activé : Windows enregistre quand il récupère de la configuration auprès du service OneSettings. Sans cette trace, une modification provenant de là est invisible a posteriori.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.15 Journalisation<br>A.8.16 Activités de surveillance |
| NIS2 art. 21(2) | art. 21(2)(b) gestion des incidents |
| CIS Controls v8.1 | 8.2 Collect Audit Logs<br>8.5 Collect Detailed Audit Logs |
| NIST CSF 2.0 | PR.PS-04 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 2

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_audit_forceauditpolicysubcategorysettingstooverrideauditpolicycategorysettings` | 1 |
| `device_vendor_msft_policy_config_system_enableonesettingsauditing` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
