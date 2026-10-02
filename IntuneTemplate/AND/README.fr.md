<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](README.md) · [English](README.en.md) · **Français**

# Android — 14 policies

Toutes les policies s'appellent `CXNM - Standard - AND - <D|U> - <Item>` ; les tableaux ci-dessous montrent la partie `<Item>`.

| Dossier | Nombre |
|---|---:|
| `CompliancePolicies/` | 8 |
| `DeviceConfigurations/` | 2 |
| `AppProtection/` | 1 |
| `SettingsCatalog/` | 3 |

## Autres éléments

Pas un type de stratégie CIPP, donc absent des tableaux ci-dessous et d'un package CIPP. Le mode de déploiement de chaque élément figure dans son README.

| Dossier | Quoi |
|---|---|
| [`AppConfiguration/`](AppConfiguration/README.fr.md) | Configuration d'applications pour Android (appareils inscrits) |
| [`AssignmentFilters/`](AssignmentFilters/README.fr.md) | Filtres d'affectation pour Android Enterprise |
| [`Enrollment/`](Enrollment/README.fr.md) | Restrictions d'inscription Android |

## Device-scoped (D) — 2

Affecter à des groupes d'appareils.

| Policy | Ce qu'elle fait | Type | Paramètres | Affectation |
|---|---|---|---:|---|
| [**Compliance Dedicated Device Health**](CompliancePolicies/Baseline_AND_D_Compliance_Dedicated_Device_Health.fr.md) | Marque un appareil Android dédié (kiosque ou partagé) comme non conforme lorsqu'il est rooté, que Play Integrity ne réussit pas avec attestation matérielle, que l'application Intune a été manipulée, que le stockage n'est pas chiffré ou que le dernier correctif de sécurité est plus ancien que le seuil minimal. | Compliance | — | — |
| [**System Updates**](DeviceConfigurations/Baseline_AND_D_System_Updates.fr.md) | Installe automatiquement les mises à jour système Android sur les appareils de l'organisation dans une fenêtre de maintenance entre 00:00 et 06:00. | Device config | — | — |

## User-scoped (U) — 12

Affecter à des groupes d'utilisateurs.

| Policy | Ce qu'elle fait | Type | Paramètres | Affectation |
|---|---|---|---:|---|
| [**App Protection**](AppProtection/Baseline_AND_U_App_Protection.fr.md) | Protège les données de l'entreprise dans les applications Microsoft sur un téléphone Android personnel : PIN distinct, chiffrement, pas de copie vers les applications personnelles, et effacement à distance des seules données professionnelles. | App Protection | — | All Users |
| [**Compliance Block Device Administrator**](CompliancePolicies/Baseline_AND_U_Compliance_Block_Device_Administrator.fr.md) | Marque comme non conforme tout appareil Android encore géré avec l'ancien device administrator, afin qu'il doive passer à Android Enterprise. | Compliance | — | — |
| [**Compliance Corporate Defender for Endpoint**](CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Defender_for_Endpoint.fr.md) | Marque un appareil Android fully managed ou corporate-owned comme non conforme lorsque Defender for Endpoint lui attribue un score de risque supérieur à faible. | Compliance | — | — |
| [**Compliance Corporate Device Health**](CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Device_Health.fr.md) | Marque un appareil Android fully managed ou corporate-owned comme non conforme lorsqu'il est rooté, que Play Integrity ne réussit pas avec attestation matérielle, que l'application Intune a été manipulée, qu'il fonctionne sous une version antérieure à Android 16 ou que le dernier correctif de sécurité est plus ancien que le seuil minimal. | Compliance | — | — |
| [**Compliance Corporate Password**](CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Password.fr.md) | Vérifie si un appareil Android fully managed ou corporate-owned dispose d'un code numérique complexe d'au moins six chiffres, se verrouille après quinze minutes, ne réutilise pas les cinq derniers codes et est chiffré. | Compliance | — | — |
| [**Compliance Defender for Endpoint**](CompliancePolicies/Baseline_AND_U_Compliance_Defender_for_Endpoint.fr.md) | Marque un appareil Android avec profil professionnel personnel comme non conforme lorsque Defender for Endpoint lui attribue un score de risque supérieur à faible. | Compliance | — | — |
| [**Compliance Device Health**](CompliancePolicies/Baseline_AND_U_Compliance_Device_Health.fr.md) | Marque un appareil Android avec profil professionnel personnel comme non conforme lorsqu'il est rooté, que le débogage USB est activé, que les applications hors du Play Store sont autorisées, que Play Integrity ne peut pas être confirmé avec attestation matérielle, ou que le dernier correctif de sécurité est plus ancien que le seuil minimal. | Compliance | — | — |
| [**Compliance Password**](CompliancePolicies/Baseline_AND_U_Compliance_Password.fr.md) | Vérifie si un appareil Android avec profil professionnel personnel dispose d'un verrouillage d'écran de complexité moyenne, si le profil professionnel exige en outre son propre code d'au moins six chiffres (numérique complexe, complexité moyenne) qui se verrouille après quinze minutes, et si le stockage est chiffré. | Compliance | — | — |
| [**Corporate AI Restricted**](SettingsCatalog/Baseline_AND_U_Corporate_AI_Restricted.fr.md) | Empêche, sur les appareils Android fully managed et corporate-owned, que le contenu de l'écran soit transmis à une application d'assistant (comme Gemini ou Circle to Search) et que des applications proposent des fonctions à des agents d'IA. | Settings Catalog | 2 | — |
| [**Corporate Data Protection**](SettingsCatalog/Baseline_AND_U_Corporate_Data_Protection.fr.md) | Bloque, sur les appareils Android fully managed et corporate-owned, les captures d'écran, le partage de fichiers via Bluetooth et la réinitialisation aux paramètres d'usine par l'utilisateur. | Settings Catalog | 3 | — |
| [**Corporate Device Security**](SettingsCatalog/Baseline_AND_U_Corporate_Device_Security.fr.md) | Durcit les appareils Android fully managed et corporate-owned : code à six chiffres (numérique complexe) qui efface l'appareil après dix tentatives, saisie du code une fois par jour au lieu de la seule biométrie, écran allumé quinze minutes au plus, Play Protect et mises à jour automatiques des applications activés, pas de transfert de fichiers via USB ni stockage externe, pas de 2G, pas d'heure manuelle, pas de Private Space et pas de partage du professionnel vers le personnel. | Settings Catalog | 14 | — |
| [**Work Profile Restrictions**](DeviceConfigurations/Baseline_AND_U_Work_Profile_Restrictions.fr.md) | Sur un appareil avec profil professionnel personnel, définit un code propre au profil professionnel (six chiffres, complexité moyenne, verrouillage après quinze minutes, effacement du seul profil professionnel après dix tentatives), bloque la copie, le partage et les captures d'écran du professionnel vers le personnel, et active Play Protect. | Device config | — | — |

---

**Ce qu'elle fait** provient de `doel` dans [`_manifest.json`](../_manifest.json) (traduit). La même phrase,
en anglais, figure avec la cible d'affectation et l'origine dans le champ `Description` du
template — et donc plus tard dans le tenant, à côté de la policy.
