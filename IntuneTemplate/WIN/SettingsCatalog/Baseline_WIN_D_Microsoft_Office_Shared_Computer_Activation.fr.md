<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Microsoft_Office_Shared_Computer_Activation.md) · [English](Baseline_WIN_D_Microsoft_Office_Shared_Computer_Activation.en.md) · **Français**

# [Baseline] - WIN - D - Microsoft Office Shared Computer Activation

Permet aux Microsoft 365 Apps sur les appareils partagés de s'activer par utilisateur connecté plutôt qu'une fois par appareil, afin que chacun utilise Office avec sa propre licence et que l'appareil ne compte pas dans la limite d'installations d'un seul utilisateur.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | Baseline propre — ADMX Office, Microsoft Office 2016 (Machine) > Licensing Settings > Use shared computer activation (L_SharedComputerLicensing = 1). Microsoft l'exige pour les Microsoft 365 Apps sur les appareils utilisés par plusieurs personnes. |
| Fichier | [`Baseline_WIN_D_Microsoft_Office_Shared_Computer_Activation.json`](Baseline_WIN_D_Microsoft_Office_Shared_Computer_Activation.json) |

> À affecter à SEC-Shared-Devices, à côté de [Baseline] - WIN - D - Shared PC ou de [Baseline] - WIN - D - Shared PC Domain and Guest. Le jeton de licence est stocké dans le profil utilisateur et disparaît lorsque le PC partagé supprime le profil ; à la connexion suivante, Office récupère un nouveau jeton, donc la première ouverture d'Office nécessite une connexion Internet. Chaque utilisateur a besoin d'une licence qui prend en charge l'activation d'ordinateurs partagés. Un invité du PC partagé n'a pas de compte Entra et donc pas de licence Office. Si Office est déjà activé par appareil, cette activation reste en place : commencez de préférence avec un appareil propre (Autopilot reset), comme pour le PC partagé.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.32 Droits de propriété intellectuelle<br>A.8.19 Installation de logiciels sur des systèmes opérationnels |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| NIST CSF 2.0 | PR.PS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 1

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_office16v2~policy~l_microsoftofficemachine~l_licensingsettings_l_sharedcomputerlicensing` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
