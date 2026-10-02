<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_D_External_Storage_Read_Only.md) · [English](Baseline_MAC_D_External_Storage_Read_Only.en.md) · **Français**

# CXNM - Standard - MAC - D - External Storage Read Only

Ne laisse macOS monter que le stockage externe qui est lui-même en lecture seule. Les clés USB et disques externes ordinaires — en lecture-écriture — ne sont pas montés du tout.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | Gestion déclarative Apple, com.apple.configuration.diskmanagement.settings (apple/device-management : macOS 15.0, supervisé uniquement) ; settingDefinitionId et options vérifiés par rapport aux définitions du settings catalog |
| Fichier | [`Baseline_MAC_D_External_Storage_Read_Only.json`](Baseline_MAC_D_External_Storage_Read_Only.json) |

> Qui souhaite l'approche Windows — lecture autorisée, écriture non — a besoin sur macOS de Microsoft Defender for Endpoint Device Control (une politique de supports amovibles en lecture seule). Cela demande un agent Defender onboardé (IntuneTemplate/MAC/EndpointSecurity) et une politique JSON distincte, et ne fait pas partie de cette itération. Un disque Time Machine externe n'est plus monté non plus avec cette policy ; dans cette baseline, la sauvegarde doit passer par OneDrive (KFM). Si une organisation choisit ceci, déployez d'abord sur un groupe pilote puis traitez-le comme phase 2. Pas de chevauchement : aucun autre template ne définit diskmanagement_*.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.7.10 Supports de stockage<br>A.8.12 Prévention de la fuite de données |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 3.3 Configure Data Access Control Lists |
| NIST CSF 2.0 | PR.DS-01<br>PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 3

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `diskmanagement_diskmanagement` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`diskmanagement_restrictions` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`diskmanagement_restrictions_externalstorage` | 1 |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
