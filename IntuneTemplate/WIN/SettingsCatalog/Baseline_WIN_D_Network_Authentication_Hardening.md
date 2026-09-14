<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Network Authentication Hardening

Maakt netwerkauthenticatie minder vatbaar voor misbruik: het systeemaccount gebruikt de computeridentiteit voor NTLM, PKU2U met online identiteiten gaat dicht, LDAP-verkeer vraagt ondertekening, de Kerberos-client ondersteunt armoring en NetBIOS-namen worden niet meer via broadcast opgelost.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-204-DNetworkAuthenticationHardening` |
| Bron | CIS v4 Windows 11 L1 (IntuneAdmin CISv4-profielen) en de Microsoft Security Baseline voor Windows 11 — waarden geverifieerd tegen de settings catalog-definities; PKU2U wijkt bewust af van de IntuneAdmin-waarde |
| Bestand | [`Baseline_WIN_D_Network_Authentication_Hardening.json`](Baseline_WIN_D_Network_Authentication_Hardening.json) |

> **Bewuste afwijking van de bron:** IntuneAdmin zet PKU2U op `_1` (Allow), terwijl CIS L1 2.3.11.3 'Disabled' eist; hier `_0` (Block). NetBT NodeType en LDAP-ondertekening vragen Windows 11 22H2 met de update van april 2025 (10.0.22621.5126) of hoger; op oudere builds rapporteert Intune 'Niet van toepassing'. Kerberos-armoring **afdwingen** (`requirekerberosarmoring`) is bewust niet opgenomen: dat laat elke aanmelding mislukken bij een domein dat armoring niet ondersteunt. SMB-ondertekening en NTLM-audit staan al in Local Security Policies en Security Hardening; WDigest en LLMNR in Legacy Hardening.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.5 Veilige authenticatie<br>A.8.20 Netwerkbeveiliging |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie<br>art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process<br>4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software |
| NIST CSF 2.0 | PR.AA-03<br>PR.PS-01<br>PR.IR-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 6

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_networksecurity_allowlocalsystemtousecomputeridentityforntlm` | 1 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_networksecurity_allowpku2uauthenticationrequests` | 0 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_networksecurity_ldapclientsigningrequirements` | 1 |
| `device_vendor_msft_policy_config_kerberos_kerberosclientsupportsclaimscompoundarmor` | 1 |
| `device_vendor_msft_policy_config_mssecurityguide_netbtnodetypeconfiguration` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_mssecurityguide_netbtnodetypeconfiguration_pol_secguide_secguide_netbtnodetypecfg` | 2 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
