<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Data_Minimisation.md) · [English](Baseline_WIN_D_Data_Minimisation.en.md) · **Français**

# [Baseline] - WIN - D - Data Minimisation

Limite ce qui est inclus dans les données de diagnostic : pas de fichiers journaux supplémentaires ni de vidages mémoire vers Microsoft.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| checkId | `INTUNE-BASE-129-DDataMinimisation` |
| Source | ISO/IEC 27001:2022 A.5.34 et A.8.11, RGPD art. 5(1)(c) minimisation des données — paramètres issus de CIS v4 Windows 11 L1 |
| Fichier | [`Baseline_WIN_D_Data_Minimisation.json`](Baseline_WIN_D_Data_Minimisation.json) |

> La baseline règle volontairement la télémétrie sur Facultatif, car Endpoint Analytics et les rapports Windows Update en dépendent. C'est un choix défendable, mais il est en tension avec la minimisation des données au titre du RGPD. Ces deux paramètres atténuent ce point sans casser les rapports : le niveau est conservé, mais les fichiers journaux de diagnostic supplémentaires et les vidages mémoire — qui peuvent contenir des données d'utilisateurs — ne sont pas transmis. C'est la réponse à la question qu'un DPO ou un auditeur pose ici.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.34 Protection de la vie privée et des DCP |
| NIST CSF 2.0 | PR.DS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 2

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_system_limitdiagnosticlogcollection` | 1 |
| `device_vendor_msft_policy_config_system_limitdumpcollection` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
