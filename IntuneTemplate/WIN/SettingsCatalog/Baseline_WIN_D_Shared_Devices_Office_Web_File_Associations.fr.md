<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Shared_Devices_Office_Web_File_Associations.md) · [English](Baseline_WIN_D_Shared_Devices_Office_Web_File_Associations.en.md) · **Français**

# [Baseline] - WIN - D - Shared Devices Office Web File Associations

Fait de l'application Office op het web l'application par défaut pour les fichiers Word, Excel et PowerPoint sur les appareils partagés, afin qu'un double-clic sur un fichier dans OneDrive ou SharePoint l'ouvre dans Office pour le web, et ouvre les scripts comme .js, .vbs et .hta avec le Bloc-notes.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | Baseline propre — Policy CSP ApplicationDefaults/DefaultAssociationsConfiguration avec les ProgId de l'application Win32 IntuneTemplate/WIN/Apps/office-web-open, plus les associations de [Baseline] - WIN - D - Script File Associations. |
| Fichier | [`Baseline_WIN_D_Shared_Devices_Office_Web_File_Associations.json`](Baseline_WIN_D_Shared_Devices_Office_Web_File_Associations.json) |

> À affecter à SG-D-UEM-WIN-Shared, avec l'application Win32 Office op het web (IntuneTemplate/WIN/Apps/office-web-open) sur le même groupe. Sans cette application, l'association pointe vers un ProgId qui n'existe pas et Windows l'ignore. Contient aussi les associations de scripts de [Baseline] - WIN - D - Script File Associations : deux stratégies avec Default Associations Configuration sur un même appareil produisent un Conflit. Cette stratégie est en phase 2 sur le pilote, dont les appareils partagés ne font pas partie ; excluez SG-D-UEM-WIN-Shared dès qu'elle passe en phase 1, et reportez ici toute modification de sa liste. Windows applique les associations à la connexion.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.9 Gestion de la configuration<br>A.8.19 Installation de logiciels sur des systèmes opérationnels |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process |
| NIST CSF 2.0 | PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 1

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_applicationdefaults_defaultassociationsconfiguration` | PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPERlZmF1bHRBc3NvY2lhdGlvbnM+CiAgPEFzc29jaWF0aW9uIElkZW5… |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
