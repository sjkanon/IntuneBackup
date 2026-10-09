<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_AVD_FSLogix_Profile_Containers.md) · [English](Baseline_WIN_D_AVD_FSLogix_Profile_Containers.en.md) · **Français**

# [Baseline] - WIN - D - AVD FSLogix Profile Containers

Active les conteneurs de profil FSLogix sur les hôtes de session AVD : le profil de chaque utilisateur est un VHDX dynamique de 30 Go maximum sur Azure Files, l'hôte obtient pour cela un ticket Kerberos auprès d'Entra ID, et une connexion sans conteneur échoue plutôt que de continuer avec un profil temporaire.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | Propre — les valeurs FSLogix de configure-fslogix.ps1 de l'environnement de test AVD, avec les définitions de l'ADMX FSLogix dans le Settings Catalog ; le ticket Kerberos comme dans [Baseline] - WIN - D - Windows Hello Cloud Kerberos Trust |
| Fichier | [`Baseline_WIN_D_AVD_FSLogix_Profile_Containers.json`](Baseline_WIN_D_AVD_FSLogix_Profile_Containers.json) |

> Renseignez le nom UNC du compte de stockage (OPSLAGACCOUNT-INVULLEN). **Non vérifiés avec certitude, donc omis :** VolumeType (VHDX est la valeur par défaut depuis FSLogix 2210, 2.9.8361) et RoamIdentity (la valeur requise 0 est la valeur par défaut ; Intune ne prend pas en charge l'itinérance des jetons). Vérifiez les définitions dans le sélecteur de paramètres avant de les ajouter. **Absents du Settings Catalog**, et donc dans le script d'hôte configure-fslogix.ps1 du dépôt AVD : LoadCredKeyFromProfile = 1 sous HKLM\SOFTWARE\Policies\Microsoft\AzureADAccount (nécessaire pour Entra Kerberos avec FSLogix) et l'administrateur local dans le groupe local FSLogix Profile Exclude List, afin qu'une connexion break-glass fonctionne toujours. Le script définit déjà les mêmes valeurs FSLogix au déploiement, de sorte que la première connexion fonctionne avant qu'Intune n'ait atteint l'hôte ; cette stratégie les garde ensuite centralisées et protégées contre la dérive. Les deux écrivent dans HKLM\SOFTWARE\FSLogix\Profiles, rien n'entre donc en conflit. CloudKerberosTicketRetrievalEnabled figure aussi dans [Baseline] - WIN - D - Windows Hello Cloud Kerberos Trust, avec la même valeur ; cette stratégie n'a pas sa place sur AVD (docs/AVD.md). Excluez l'application du compte de stockage de la MFA dans l'accès conditionnel, sinon le ticket Kerberos échoue.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.30 Préparation des TIC pour la continuité d'activité<br>A.8.5 Authentification sécurisée<br>A.8.9 Gestion de la configuration |
| NIS2 art. 21(2) | art. 21(2)(c) continuité des activités et gestion des crises<br>art. 21(2)(j) authentification à plusieurs facteurs et communications sécurisées |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process |
| NIST CSF 2.0 | PR.PS-01<br>PR.AA-03<br>PR.IR-03 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 11

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_fslogixv1~policy~fslogix~profiles_profilesenabled` | 1 |
| `device_vendor_msft_policy_config_fslogixv1~policy~fslogix~profiles_profilesvhdlocations` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_fslogixv1~policy~fslogix~profiles_profilesvhdlocations_profilesvhdlocations` | \\OPSLAGACCOUNT-INVULLEN.file.core.windows.net\profiles |
| `device_vendor_msft_policy_config_fslogixv1~policy~fslogix~profiles_profilesisdynamicvhd` | 1 |
| `device_vendor_msft_policy_config_fslogixv1~policy~fslogix~profiles_profilessizeinmbs` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_fslogixv1~policy~fslogix~profiles_profilessizeinmbs_profilessizeinmbs` | 30000 |
| `device_vendor_msft_policy_config_fslogixv1~policy~fslogix~profiles~profiles_containeranddirectorynaming_profilesflipflopprofiledirectoryname` | 1 |
| `device_vendor_msft_policy_config_fslogixv1~policy~fslogix~profiles_profilesdeletelocalprofilewhenvhdshouldapply` | 1 |
| `device_vendor_msft_policy_config_fslogixv1~policy~fslogix~profiles_profilespreventloginwithfailure` | 1 |
| `device_vendor_msft_policy_config_fslogixv1~policy~fslogix~profiles_profilespreventloginwithtempprofile` | 1 |
| `device_vendor_msft_policy_config_kerberos_cloudkerberosticketretrievalenabled` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
