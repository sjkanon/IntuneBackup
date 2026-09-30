<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Script_File_Associations.md) · [English](Baseline_WIN_D_Script_File_Associations.en.md) · **Français**

# [Baseline] - WIN - D - Script File Associations

Fait ouvrir les fichiers .js, .vbs et .hta dans le Bloc-notes au lieu de l'hôte de script, afin qu'un double-clic sur une telle pièce jointe n'exécute rien.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Device Security - D - Script File Associations |
| Fichier | [`Baseline_WIN_D_Script_File_Associations.json`](Baseline_WIN_D_Script_File_Associations.json) |

> Ouvre les fichiers .js/.vbs/.hta avec le Bloc-notes au lieu de l'hôte de script — double-cliquer sur une pièce jointe n'exécute alors rien.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Protection contre les programmes malveillants |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 9.6 Block Unnecessary File Types |
| NIST CSF 2.0 | PR.PS-05 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 1

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_applicationdefaults_defaultassociationsconfiguration` | PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjxEZWZhdWx0QXNzb2NpYXRpb25zPg0KICA8QXNzb2NpYXRpb24gSWR… |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
