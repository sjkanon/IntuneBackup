<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_AI_Tooling.md) · [English](Baseline_WIN_D_AI_Tooling.en.md) · **Français**

# CXNM - Standard - WIN - D - AI Tooling

Bloque GitHub Copilot sur les comptes personnels dans Visual Studio ; la licence professionnelle continue de fonctionner.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | ISO/IEC 27001:2022 A.5.10 et A.8.1 — paramètre issu du benchmark Visual Studio d'IntuneAdmin |
| Fichier | [`Baseline_WIN_D_AI_Tooling.json`](Baseline_WIN_D_AI_Tooling.json) |

> Prévu pour une politique IA qui n'autorise GitHub Copilot que pour le développement logiciel et uniquement via la licence de l'organisation. Sans ce paramètre, un développeur peut associer son compte personnel, et le code de l'entreprise quitte alors la voie approuvée sans que personne ne s'en aperçoive.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.10 Utilisation correcte de l'information et des autres actifs associés<br>A.8.1 Terminaux finaux des utilisateurs<br>A.8.12 Prévention de la fuite de données |
| NIS2 art. 21(2) | art. 21(2)(d) sécurité de la chaîne d'approvisionnement |
| NIST CSF 2.0 | PR.DS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 1

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_visualstudiov4~policy~visualstudio~copilotsettings_disablecopilotforindividuals` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
