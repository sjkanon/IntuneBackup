<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](README.md) · [English](README.en.md) · **Français**

# macOS — 37 policies

Toutes les policies s'appellent `CXNM - Standard - MAC - <D|U> - <Item>` ; les tableaux ci-dessous montrent la partie `<Item>`.

| Dossier | Nombre |
|---|---:|
| `SettingsCatalog/` | 30 |
| `DeviceConfigurations/` | 3 |
| `CompliancePolicies/` | 4 |

## Autres éléments

Pas un type de stratégie CIPP, donc absent des tableaux ci-dessous et d'un package CIPP. Le mode de déploiement de chaque élément figure dans son README.

| Dossier | Quoi |
|---|---|
| [`ComplianceScripts/`](ComplianceScripts/README.fr.md) | Conformité personnalisée : Defender for Endpoint |
| [`EndpointSecurity/`](EndpointSecurity/README.fr.md) | Intégration de Defender for Endpoint sur macOS |
| [`Enrollment/ade-profile/`](Enrollment/ade-profile/README.fr.md) | Profils d'inscription ADE macOS |
| [`Enrollment/apple-business/`](Enrollment/apple-business/README.fr.md) | Checklist Apple Business |
| [`Enrollment/enrollment-restriction/`](Enrollment/enrollment-restriction/README.fr.md) | Restriction d'inscription : pas de Mac personnels |
| [`PlatformScripts/`](PlatformScripts/README.fr.md) | Scripts shell macOS |

## Device-scoped (D) — 29

Affecter à des groupes d'appareils.

| Policy | Ce qu'elle fait | Type | Paramètres | Affectation |
|---|---|---|---:|---|
| [**Accounts and Login**](SettingsCatalog/Baseline_MAC_D_Accounts_and_Login.fr.md) | Détermine ce qui est visible à la connexion et quels comptes un Mac peut avoir. | Settings Catalog | 5 | All Devices |
| [**Apple Intelligence Permitted**](SettingsCatalog/Baseline_MAC_D_Apple_Intelligence_Permitted.fr.md) | Autorise explicitement les mêmes fonctions Apple Intelligence : Writing Tools, résumés dans Mail, Notes et Safari, Genmoji, Image Playground, l'intégration d'IA externe et la dictée via les serveurs d'Apple. | Settings Catalog | 12 | — |
| [**Apple Intelligence Restricted**](SettingsCatalog/Baseline_MAC_D_Apple_Intelligence_Restricted.fr.md) | Désactive les fonctions Apple Intelligence qui font traiter du texte, des e-mails, des notes, des pages web ou des images par un modèle de langage ou les envoient à un service d'IA externe, et maintient la dictée sur l'appareil. | Settings Catalog | 12 | — |
| [**Azure Files Cloud Kerberos**](SettingsCatalog/Baseline_MAC_D_Azure_Files_Cloud_Kerberos.fr.md) | Fournit au Mac un ticket Kerberos pour le realm Entra Cloud Kerberos, afin qu'un partage SMB sur Azure Files s'ouvre sans que l'utilisateur se reconnecte. | Settings Catalog | 8 | — |
| [**Defender Antivirus**](SettingsCatalog/Baseline_MAC_D_Defender_Antivirus.fr.md) | Protection en temps réel, protection cloud et comportement d'analyse de Defender sur macOS. | Settings Catalog | 24 | All Devices |
| [**Defender for Endpoint**](SettingsCatalog/Baseline_MAC_D_Defender_for_Endpoint.fr.md) | Accorde à Defender les autorisations système que macOS exige avant qu'il puisse fonctionner : extension système, filtre réseau et accès complet au disque. Sans cette policy, Defender reste à moitié installé sur un Mac. | Settings Catalog | 50 | All Devices |
| [**Enrollment Profile Administrator User Affinity**](SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Administrator_User_Affinity.fr.md) | Déroule l'Assistant réglages pour un Mac d'entreprise avec affinité utilisateur et inscription verrouillée, et crée le compte connecté en tant qu'administrateur local. | Settings Catalog | 40 | — |
| [**Enrollment Profile Standard User Affinity**](SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Standard_User_Affinity.fr.md) | Déroule l'Assistant réglages pour un Mac d'entreprise avec affinité utilisateur et inscription verrouillée, et crée le compte connecté en tant qu'utilisateur standard ; l'administration passe par le compte service desk masqué. | Settings Catalog | 40 | — |
| [**External Storage Read Only**](SettingsCatalog/Baseline_MAC_D_External_Storage_Read_Only.fr.md) | Ne laisse macOS monter que le stockage externe qui est lui-même en lecture seule. Les clés USB et disques externes ordinaires — en lecture-écriture — ne sont pas montés du tout. | Settings Catalog | 1 | — |
| [**FileVault**](SettingsCatalog/Baseline_MAC_D_FileVault.fr.md) | Chiffre le disque du Mac et stocke la clé de récupération dans Intune. L'équivalent macOS de BitLocker. | Settings Catalog | 7 | — |
| [**Firewall and Gatekeeper**](SettingsCatalog/Baseline_MAC_D_Firewall_and_Gatekeeper.fr.md) | Active le pare-feu macOS et fait en sorte que Gatekeeper n'autorise que les logiciels signés par un développeur identifié. | Settings Catalog | 7 | All Devices |
| [**Login Window**](SettingsCatalog/Baseline_MAC_D_Login_Window.fr.md) | Fait demander le nom de compte et le mot de passe par la fenêtre de connexion au lieu d'afficher une liste de comptes, et affiche un court message indiquant que l'appareil est réservé à un usage autorisé. | Settings Catalog | 2 | — |
| [**Microsoft AutoUpdate**](SettingsCatalog/Baseline_MAC_D_Microsoft_AutoUpdate.fr.md) | Comment et quand Office, Edge et les autres applications Microsoft sur le Mac se mettent à jour. | Settings Catalog | 14 | All Devices |
| [**Microsoft Edge Password Management**](SettingsCatalog/Baseline_MAC_D_Microsoft_Edge_Password_Management.fr.md) | Détermine si Edge sur le Mac peut enregistrer et afficher des mots de passe. | Settings Catalog | 3 | All Devices |
| [**Microsoft Edge Security**](SettingsCatalog/Baseline_MAC_D_Microsoft_Edge_Security.fr.md) | Les paramètres de sécurité d'Edge sur macOS : SmartScreen, contrôle des téléchargements et comportement des certificats. | Settings Catalog | 31 | All Devices |
| [**Microsoft Office**](SettingsCatalog/Baseline_MAC_D_Microsoft_Office.fr.md) | Configuration de base d'Office sur macOS. | Settings Catalog | 5 | All Devices |
| [**Microsoft OneDrive**](SettingsCatalog/Baseline_MAC_D_Microsoft_OneDrive.fr.md) | Connecte automatiquement le client OneDrive sur le Mac avec le compte professionnel et lui accorde les droits d'accès que macOS exige. | Settings Catalog | 13 | All Devices |
| [**Passcode and Screen Lock**](SettingsCatalog/Baseline_MAC_D_Passcode_and_Screen_Lock.fr.md) | Configure sur le Mac le mot de passe et le verrouillage d'écran que la policy de conformité exige déjà : au moins huit caractères, pas de mot de passe simple, verrouillage après quinze minutes. | Settings Catalog | 7 | — |
| [**Platform SSO**](SettingsCatalog/Baseline_MAC_D_Platform_SSO.fr.md) | Lie la connexion sur le Mac à Entra ID via le plug-in SSO Microsoft, afin que le mot de passe du Mac et le compte professionnel ne fassent qu'un. | Settings Catalog | 24 | All Devices |
| [**Privacy Preferences**](SettingsCatalog/Baseline_MAC_D_Privacy_Preferences.fr.md) | Uniquement pour les organisations qui utilisent NinjaOne ou TeamViewer. Fixe les autorisations de confidentialité (PPPC) des outils de gestion : NinjaOne Remote et TeamViewer obtiennent Accessibilité pour que la prise de contrôle à distance fonctionne, et les trois composants NinjaOne obtiennent Accès complet au disque — sans que l'utilisateur doive l'approuver, et sans qu'il puisse le révoquer. | Settings Catalog | 40 | — |
| [**Recovery Lock**](SettingsCatalog/Baseline_MAC_D_Recovery_Lock.fr.md) | Sur les Mac équipés d'Apple silicon, définit un mot de passe aléatoire géré par Intune pour recoveryOS et les options de démarrage, et le remplace tous les six mois. | Settings Catalog | 2 | — |
| [**Restrictions Hardening**](SettingsCatalog/Baseline_MAC_D_Restrictions_Hardening.fr.md) | Complète les restrictions macOS par cinq mesures qu'OpenIntuneBaseline macOS v1.0 ne définit pas : pas de profils de configuration ni de certificats installés manuellement, pas de contournement de Gatekeeper via le Finder, pas de données de diagnostic envoyées à Apple, pas de résultats internet dans Spotlight et pas de mise en cache de contenu. | Settings Catalog | 5 | — |
| [**Restrictions**](SettingsCatalog/Baseline_MAC_D_Restrictions.fr.md) | Restreint les fonctionnalités macOS par lesquelles les données de l'entreprise peuvent quitter l'appareil. | Settings Catalog | 37 | All Devices |
| [**Screen Recording**](DeviceConfigurations/Baseline_MAC_D_Screen_Recording.fr.md) | Uniquement pour les organisations qui utilisent NinjaOne ou TeamViewer. Définit l'enregistrement de l'écran pour NinjaOne Remote et TeamViewer sur AllowStandardUserToSetSystemService : un utilisateur sans droits d'administrateur peut cocher la case lui-même, sans mot de passe administrateur. L'activation reste un clic manuel — macOS ne permet pas à un MDM d'accorder l'enregistrement de l'écran. | Device config | — | — |
| [**Screensaver**](SettingsCatalog/Baseline_MAC_D_Screensaver.fr.md) | Exige le mot de passe au plus tard cinq secondes après le démarrage de l'économiseur d'écran, et démarre l'économiseur d'écran après quinze minutes d'inactivité — y compris dans la fenêtre de connexion. | Settings Catalog | 4 | — |
| [**Software Updates**](SettingsCatalog/Baseline_MAC_D_Software_Updates.fr.md) | Comment et quand macOS télécharge et installe ses propres mises à jour. | Settings Catalog | 16 | — |
| [**Time Server**](SettingsCatalog/Baseline_MAC_D_Time_Server.fr.md) | Fait synchroniser l'horloge du Mac avec time.apple.com, afin que les horodatages des journaux, les tickets Kerberos et les vérifications de certificats soient corrects. | Settings Catalog | 1 | All Devices |
| [**Wifi Corporate**](DeviceConfigurations/Baseline_MAC_D_Wifi_Corporate.fr.md) | Déploie le réseau de l'entreprise sous forme de profil Wi-Fi sur chaque Mac, afin qu'un appareil se connecte automatiquement après l'inscription et qu'un utilisateur n'ait jamais besoin de connaître ou de saisir le mot de passe du réseau. | Device config | — | — |
| [**Wifi Guest**](DeviceConfigurations/Baseline_MAC_D_Wifi_Guest.fr.md) | Déploie le réseau invité comme second profil sur chaque Mac, afin qu'un appareil reste en ligne lorsque le réseau de l'entreprise n'est pas joignable. | Device config | — | — |

## User-scoped (U) — 8

Affecter à des groupes d'utilisateurs.

| Policy | Ce qu'elle fait | Type | Paramètres | Affectation |
|---|---|---|---:|---|
| [**Compliance Device Health**](CompliancePolicies/Baseline_MAC_U_Compliance_Device_Health.fr.md) | Vérifie si System Integrity Protection est activé sur le Mac. | Compliance | — | All Users |
| [**Compliance Device Security**](CompliancePolicies/Baseline_MAC_U_Compliance_Device_Security.fr.md) | Vérifie si le disque du Mac est chiffré, si le pare-feu est activé et si Gatekeeper n'autorise que les logiciels signés. | Compliance | — | All Users |
| [**Compliance OS Version**](CompliancePolicies/Baseline_MAC_U_Compliance_OS_Version.fr.md) | Vérifie si le Mac exécute macOS 14 ou une version ultérieure — la version requise par la policy de mise à jour déclarative de la baseline. | Compliance | — | — |
| [**Compliance Password**](CompliancePolicies/Baseline_MAC_U_Compliance_Password.fr.md) | Vérifie si le Mac exige un mot de passe et quelle doit être sa robustesse. | Compliance | — | All Users |
| [**Microsoft Edge Extensions**](SettingsCatalog/Baseline_MAC_U_Microsoft_Edge_Extensions.fr.md) | Détermine quelles extensions Edge les utilisateurs peuvent installer sur le Mac. | Settings Catalog | 4 | All Users |
| [**Microsoft Edge Profiles and Sync**](SettingsCatalog/Baseline_MAC_U_Microsoft_Edge_Profiles_and_Sync.fr.md) | Détermine avec quel compte les utilisateurs se connectent à Edge et ce qui est synchronisé. | Settings Catalog | 4 | All Users |
| [**Microsoft Edge Updates**](SettingsCatalog/Baseline_MAC_U_Microsoft_Edge_Updates.fr.md) | Comment et quand Edge se met à jour sur le Mac. | Settings Catalog | 7 | All Users |
| [**Microsoft OneDrive KFM**](SettingsCatalog/Baseline_MAC_U_Microsoft_OneDrive_KFM.fr.md) | Déplace le Bureau et les Documents du Mac vers OneDrive, afin que rien ne soit stocké uniquement en local. | Settings Catalog | 15 | All Users |

---

**Ce qu'elle fait** provient de `doel` dans [`_manifest.json`](../_manifest.json) (traduit). La même phrase,
en anglais, figure avec la cible d'affectation et l'origine dans le champ `Description` du
template — et donc plus tard dans le tenant, à côté de la policy.
