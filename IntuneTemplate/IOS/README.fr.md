<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](README.md) · [English](README.en.md) · **Français**

# iOS/iPadOS — 14 policies

Toutes les policies s'appellent `[Baseline] - IOS - <D|U> - <Item>` ; les tableaux ci-dessous montrent la partie `<Item>`.

| Dossier | Nombre |
|---|---:|
| `SettingsCatalog/` | 8 |
| `DeviceConfigurations/` | 2 |
| `AppProtection/` | 1 |
| `CompliancePolicies/` | 3 |

## Autres éléments

Pas un type de stratégie CIPP, donc absent des tableaux ci-dessous et d'un package CIPP. Le mode de déploiement de chaque élément figure dans son README.

| Dossier | Quoi |
|---|---|
| [`AppConfiguration/`](AppConfiguration/README.fr.md) | Configuration des applications iOS/iPadOS |
| [`Enrollment/`](Enrollment/README.fr.md) | Inscription iOS/iPadOS : profil ADE, groupes et Apple Business |

## Device-scoped (D) — 10

Affecter à des groupes d'appareils.

| Policy | Ce qu'elle fait | Type | Paramètres | Affectation |
|---|---|---|---:|---|
| [**Apple Intelligence Permitted**](SettingsCatalog/Baseline_IOS_D_Apple_Intelligence_Permitted.fr.md) | Autorise explicitement, sur les iPhone et iPad inscrits, les fonctionnalités génératives d'Apple Intelligence et l'intégration avec des services d'IA externes. | Settings Catalog | 12 | — |
| [**Apple Intelligence Restricted**](SettingsCatalog/Baseline_IOS_D_Apple_Intelligence_Restricted.fr.md) | Désactive, sur les iPhone et iPad inscrits, les fonctionnalités génératives d'Apple Intelligence — Writing Tools, Genmoji, Image Playground, Image Wand, écriture manuscrite personnalisée, résumés dans Mail, Notes, Safari et Visual Intelligence — ainsi que l'intégration avec des services d'IA externes comme ChatGPT. | Settings Catalog | 12 | — |
| [**Data Protection**](SettingsCatalog/Baseline_IOS_D_Data_Protection.fr.md) | Sépare les données de l'entreprise des applications personnelles sur chaque appareil inscrit : les documents des applications gérées ne s'ouvrent pas dans des applications non gérées, AirDrop est considéré comme non géré, les applications gérées ne se synchronisent pas avec iCloud, les applications personnelles ne lisent pas les contacts professionnels et les sauvegardes locales sont chiffrées. | Settings Catalog | 6 | — |
| [**Defender for Endpoint Onboarding Supervised**](DeviceConfigurations/Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Supervised.fr.md) | Intègre Microsoft Defender for Endpoint sans action de l'utilisateur sur les appareils d'entreprise supervisés à l'aide d'un profil de filtre de contenu, afin que la protection web fonctionne sans VPN local. | Device config | — | — |
| [**Defender for Endpoint Onboarding Unsupervised**](DeviceConfigurations/Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Unsupervised.fr.md) | Intègre Microsoft Defender for Endpoint sans action de l'utilisateur sur les appareils inscrits non supervisés via le VPN de bouclage local de Defender, qui assure la protection web sans envoyer de trafic hors de l'appareil. | Device config | — | — |
| [**Enterprise SSO**](SettingsCatalog/Baseline_IOS_D_Enterprise_SSO.fr.md) | Active le plug-in Microsoft Enterprise SSO de Microsoft Authenticator, afin que les applications gérées et Safari partagent une seule connexion Entra et que l'appareil puisse s'authentifier auprès de Conditional Access. | Settings Catalog | 19 | — |
| [**Lock Screen**](SettingsCatalog/Baseline_IOS_D_Lock_Screen.fr.md) | Affiche sur l'écran verrouillé d'un iPhone ou iPad d'entreprise un texte destiné à la personne qui le trouve, afin qu'un appareil perdu puisse être rendu à l'organisation. | Settings Catalog | 1 | — |
| [**Passcode**](SettingsCatalog/Baseline_IOS_D_Passcode.fr.md) | Définit sur les iPhone et iPad inscrits le code d'accès que la policy de conformité vérifie : au moins six caractères, pas de code simple, verrouillage immédiat, verrouillage automatique après cinq minutes au plus, et effacement seulement après dix tentatives infructueuses. | Settings Catalog | 6 | — |
| [**Restrictions Corporate**](SettingsCatalog/Baseline_IOS_D_Restrictions_Corporate.fr.md) | Durcissement des iPhone et iPad d'entreprise supervisés : pas de profils ni d'applications de développeur installés manuellement, pas d'applications hors de l'App Store, certificats TLS non fiables automatiquement refusés, pas d'effacement via Réglages, un écran verrouillé sans Control Center, historique des notifications, vue Aujourd'hui et Siri, et Activation Lock uniquement avec un code de contournement conservé par Intune. | Settings Catalog | 18 | — |
| [**Software Updates**](SettingsCatalog/Baseline_IOS_D_Software_Updates.fr.md) | Impose sur les iPhone et iPad inscrits la dernière version d'iOS au plus tard 14 jours après sa publication (installation à 02:00), force l'activation du téléchargement et de l'installation automatiques des mises à jour du système et de sécurité, et empêche l'utilisateur d'annuler les améliorations de sécurité. | Settings Catalog | 10 | — |

## User-scoped (U) — 4

Affecter à des groupes d'utilisateurs.

| Policy | Ce qu'elle fait | Type | Paramètres | Affectation |
|---|---|---|---:|---|
| [**App Protection**](AppProtection/Baseline_IOS_U_App_Protection.fr.md) | Protège les données de l'entreprise dans les applications Microsoft sur un iPhone ou iPad personnel : PIN distinct, chiffrement, pas de copie vers les applications personnelles, et effacement à distance des seules données professionnelles — sans que l'appareil lui-même soit géré. | App Protection | — | All Users |
| [**Compliance Defender for Endpoint**](CompliancePolicies/Baseline_IOS_U_Compliance_Defender_for_Endpoint.fr.md) | Marque un iPhone ou iPad comme non conforme dès que Microsoft Defender for Endpoint évalue le risque de la machine au-dessus de Medium. | Compliance | — | — |
| [**Compliance Device Health**](CompliancePolicies/Baseline_IOS_U_Compliance_Device_Health.fr.md) | Marque comme non conforme un iPhone ou iPad qui a été jailbreaké. | Compliance | — | — |
| [**Compliance Password**](CompliancePolicies/Baseline_IOS_U_Compliance_Password.fr.md) | Vérifie si un iPhone ou iPad exige un code d'accès d'au moins six caractères, sans code simple, et se verrouille après quinze minutes. | Compliance | — | — |

---

**Ce qu'elle fait** provient de `doel` dans [`_manifest.json`](../_manifest.json) (traduit). La même phrase,
en anglais, figure avec la cible d'affectation et l'origine dans le champ `Description` du
template — et donc plus tard dans le tenant, à côté de la policy.
