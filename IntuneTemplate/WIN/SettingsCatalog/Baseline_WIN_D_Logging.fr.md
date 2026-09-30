<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Logging.md) · [English](Baseline_WIN_D_Logging.en.md) · **Français**

# [Baseline] - WIN - D - Logging

Enregistre une transcription de chaque session PowerShell, afin de pouvoir voir a posteriori ce qu'un administrateur a réellement exécuté.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | ISO/IEC 27001:2022 A.8.15 et A.8.16, NIS2 art. 21(2)(b) — paramètres issus de CIS v4 Windows 11 L2 |
| Fichier | [`Baseline_WIN_D_Logging.json`](Baseline_WIN_D_Logging.json) |

> La journalisation des blocs de script était déjà activée dans [Baseline] - WIN - D - Security Hardening ; elle a été volontairement omise ici pour éviter un conflit. Ce qui manquait, c'est la transcription : la journalisation des blocs de script montre quel code a été chargé, la transcription montre la session elle-même avec les entrées, les sorties et les horodatages. Les politiques de journalisation exigent généralement cette dernière. Une réserve : les transcriptions sont enregistrées par défaut dans le profil de l'utilisateur, où ce même utilisateur peut les supprimer. Si les journaux doivent rester hors de portée de l'utilisateur, renseignez outputdirectory avec un partage central dès qu'il en existe un.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.15 Journalisation<br>A.8.16 Activités de surveillance |
| NIS2 art. 21(2) | art. 21(2)(b) gestion des incidents |
| CIS Controls v8.1 | 8.5 Collect Detailed Audit Logs<br>8.8 Collect Command-Line Audit Logs |
| NIST CSF 2.0 | PR.PS-04 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 3

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_admx_powershellexecutionpolicy_enabletranscripting` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_powershellexecutionpolicy_enabletranscripting_enableinvocationheader` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_powershellexecutionpolicy_enabletranscripting_outputdirectory` | *(vide)* |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
