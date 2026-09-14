<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Local Security Policies

De lokale beveiligingsopties van Windows: anonieme toegang, het netwerkauthenticatieniveau, het gedrag van gebruikersaccountbeheer en het vergrendelen na inactiviteit.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-018-LocalPoliciesSecurityOptions` |
| Bron | OpenIntuneBaseline Windows v4.0 — SC - Device Security - D - Local Security Policies |
| Bestand | [`Baseline_WIN_D_Local_Security_Policies.json`](Baseline_WIN_D_Local_Security_Policies.json) |

> Sinds OIB v4.0 is dit de voormalige 24H2+-variant: de basisvariant is vervallen omdat Windows 11 23H2 op 10 november 2026 geen updates meer krijgt. Inhoudelijk verschilt die variant op één punt: het ingebouwde Administrator-account gaat uit (enableadministratoraccountstatus). Dat raakt LAPS niet — [Baseline] - WIN - D - Windows LAPS beheert een eigen account (automaticaccountmanagementtarget = nieuw account), niet het ingebouwde. machineinactivitylimit_v2 stond hier als eigen aanvulling, maar OIB zet hem sinds v4.0 in Power and Device Lock — hij staat nu dus in [Baseline] - WIN - D - Device Lock en niet meer hier, anders zou dezelfde instelling uit twee policies komen. Eigen aanvulling sinds september 2026: networksecurity_restrictntlm_auditincomingntlmtraffic op 'alle accounts' (CIS L1). Die logt inkomend NTLM dat [Baseline] - WIN - D - Disable NTLM zou weigeren, zonder iets te weigeren — de voorbereiding op die pilot. De uitgaande tegenhanger staat er bewust niet in: de audit-waarde daarvan is dezelfde instelling als 'deny all' in Disable NTLM, en op de pilotapparaten levert dat een Conflict op waarna Intune géén van beide toepast. Uitgaand NTLM is op Windows 11 24H2 ook zonder policy te zien, in Microsoft-Windows-NTLM/Operational (4020/4021).

## Instellingen — 24

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
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

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
