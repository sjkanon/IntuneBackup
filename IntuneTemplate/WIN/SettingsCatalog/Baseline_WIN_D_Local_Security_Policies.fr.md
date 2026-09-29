<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Local_Security_Policies.md) · [English](Baseline_WIN_D_Local_Security_Policies.en.md) · **Français**

# [Baseline] - WIN - D - Local Security Policies

Les options de sécurité locales de Windows : accès anonyme, niveau d'authentification réseau, comportement du Contrôle de compte d'utilisateur et verrouillage après inactivité.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| checkId | `INTUNE-BASE-018-LocalPoliciesSecurityOptions` |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Device Security - D - Local Security Policies |
| Fichier | [`Baseline_WIN_D_Local_Security_Policies.json`](Baseline_WIN_D_Local_Security_Policies.json) |

> Depuis OIB v4.0, il s'agit de l'ancienne variante 24H2+ : la variante de base a été supprimée car Windows 11 23H2 ne reçoit plus de mises à jour à partir du 10 novembre 2026. Sur le fond, cette variante diffère sur un point : le compte Administrator intégré est désactivé (enableadministratoraccountstatus). Cela n'affecte pas LAPS — [Baseline] - WIN - D - Windows LAPS gère son propre compte (automaticaccountmanagementtarget = nouveau compte), pas le compte intégré. machineinactivitylimit_v2 figurait ici comme ajout propre, mais OIB le définit depuis v4.0 dans Power and Device Lock — il se trouve donc désormais dans [Baseline] - WIN - D - Device Lock et plus ici, sinon le même paramètre proviendrait de deux policies. Ajout propre depuis septembre 2026 : networksecurity_restrictntlm_auditincomingntlmtraffic sur « tous les comptes » (CIS L1). Il journalise le NTLM entrant que [Baseline] - WIN - D - Disable NTLM refuserait, sans rien refuser — la préparation de ce pilote. L'équivalent sortant n'y figure volontairement pas : sa valeur d'audit est le même paramètre que 'deny all' dans Disable NTLM, et sur les appareils pilotes cela produit un Conflict après quoi Intune n'applique aucun des deux. Le NTLM sortant est visible sur Windows 11 24H2 même sans policy, dans Microsoft-Windows-NTLM/Operational (4020/4021).

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.2 Droits d'accès privilégiés<br>A.8.5 Authentification sécurisée<br>A.8.9 Gestion de la configuration<br>A.8.20 Sécurité des réseaux |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités<br>art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process<br>4.7 Manage Default Accounts on Enterprise Assets and Software |
| NIST CSF 2.0 | PR.PS-01<br>PR.AA-05 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 24

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_accounts_enableadministratoraccountstatus` | 0 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_accounts_enableguestaccountstatus` | 0 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_accounts_limitlocalaccountuseofblankpasswordstoconsolelogononly` | 1 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_interactivelogon_smartcardremovalbehavior` | 1 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_microsoftnetworkclient_digitallysigncommunicationsalways` | 1 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_microsoftnetworkclient_sendunencryptedpasswordtothirdpartysmbservers` | 0 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_microsoftnetworkserver_digitallysigncommunicationsalways` | 1 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_networkaccess_donotallowanonymousenumerationofsamaccounts` | 1 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_networkaccess_donotallowanonymousenumerationofsamaccountsandshares` | 1 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_networkaccess_restrictanonymousaccesstonamedpipesandshares` | 1 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_networkaccess_restrictclientsallowedtomakeremotecallstosam` | O:BAG:BAD:(A;;RC;;;BA) |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_networksecurity_donotstorelanmanagerhashvalueonnextpasswordchange` | 1 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_networksecurity_lanmanagerauthenticationlevel` | 5 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_networksecurity_minimumsessionsecurityforntlmsspbasedclients` | 537395200 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_networksecurity_minimumsessionsecurityforntlmsspbasedservers` | 537395200 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_useraccountcontrol_behavioroftheelevationpromptforadministrators` | 2 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_useraccountcontrol_behavioroftheelevationpromptforstandardusers` | 1 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_useraccountcontrol_detectapplicationinstallationsandpromptforelevation` | 1 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_useraccountcontrol_onlyelevateuiaccessapplicationsthatareinstalledinsecurelocations` | 1 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_useraccountcontrol_runalladministratorsinadminapprovalmode` | 1 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_useraccountcontrol_switchtothesecuredesktopwhenpromptingforelevation` | 1 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_useraccountcontrol_useadminapprovalmode` | 1 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_useraccountcontrol_virtualizefileandregistrywritefailurestoperuserlocations` | 1 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_networksecurity_restrictntlm_auditincomingntlmtraffic` | 2 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
