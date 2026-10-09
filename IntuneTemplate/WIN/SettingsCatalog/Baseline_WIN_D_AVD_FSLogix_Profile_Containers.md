<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_AVD_FSLogix_Profile_Containers.en.md) · [Français](Baseline_WIN_D_AVD_FSLogix_Profile_Containers.fr.md)

# [Baseline] - WIN - D - AVD FSLogix Profile Containers

Zet FSLogix-profielcontainers aan op de AVD-sessiehosts: het profiel van elke gebruiker staat als dynamische VHDX van maximaal 30 GB op Azure Files, de host haalt daarvoor een Kerberos-ticket bij Entra ID, en een aanmelding zonder container mislukt liever dan dat ze met een tijdelijk profiel doorgaat, en bij afmelden comprimeert FSLogix de container zodat vrijgekomen ruimte terug naar het share gaat.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| Bron | Eigen — de FSLogix-waarden uit configure-fslogix.ps1 van de AVD-testomgeving, met de definities van de FSLogix-ADMX in de Settings Catalog; het Kerberos-ticket zoals in [Baseline] - WIN - D - Windows Hello Cloud Kerberos Trust |
| Bestand | [`Baseline_WIN_D_AVD_FSLogix_Profile_Containers.json`](Baseline_WIN_D_AVD_FSLogix_Profile_Containers.json) |

> Het opslagaccount staat als CIPP-variabele %FSLogixStorageAccount% in het pad: zet die per tenant in CIPP (Settings → Custom Variables) op de naam van het opslagaccount, vóór de eerste run. Zonder variabele blijft %FSLogixStorageAccount% letterlijk in het pad staan, en met PreventLoginWithFailure kan dan niemand meer op de host aanmelden. Wie met IntuneBackupAndRestore uitrolt vult de naam met de hand in (in local/). VHD Compact Disk staat expliciet aan, al is het sinds FSLogix 2210 de standaard: zo hangt het niet af van de versie op de host (nu 3.26), en een eenmaal gezette waarde terug op Niet geconfigureerd heeft volgens de beschrijving geen effect meer. Het comprimeert bij afmelden wat Storage Sense in [Baseline] - WIN - D - AVD Session Host heeft opgeruimd. **Niet met zekerheid geverifieerd, daarom weggelaten:** VolumeType (VHDX is de standaard sinds FSLogix 2210, 2.9.8361) en RoamIdentity (de vereiste waarde 0 is de standaard; Intune ondersteunt geen token-roaming). Controleer de definities in de settings picker voordat je ze toevoegt. **Niet in de Settings Catalog**, en dus in het hostscript configure-fslogix.ps1 van de AVD-repo: LoadCredKeyFromProfile = 1 onder HKLM\SOFTWARE\Policies\Microsoft\AzureADAccount (nodig voor Entra Kerberos met FSLogix) en de lokale beheerder in de lokale groep FSLogix Profile Exclude List, zodat een breakglass-aanmelding altijd werkt. Het script zet dezelfde FSLogix-waarden al bij de deploy, zodat de eerste aanmelding goed gaat voordat Intune de host heeft bereikt; deze policy houdt ze daarna centraal en tegen drift. Beide schrijven naar HKLM\SOFTWARE\FSLogix\Profiles, dus er is niets dat botst. CloudKerberosTicketRetrievalEnabled staat ook in [Baseline] - WIN - D - Windows Hello Cloud Kerberos Trust, met dezelfde waarde; die policy hoort niet op AVD (docs/AVD.md). Sluit de app van het opslagaccount in Conditional Access uit van MFA, anders mislukt het Kerberos-ticket.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.30 ICT-gereedheid voor bedrijfscontinuiteit<br>A.8.5 Veilige authenticatie<br>A.8.9 Configuratiebeheer |
| NIS2 art. 21(2) | art. 21(2)(c) bedrijfscontinuiteit en crisisbeheer<br>art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process |
| NIST CSF 2.0 | PR.PS-01<br>PR.AA-03<br>PR.IR-03 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Instellingen — 12

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_fslogixv1~policy~fslogix~profiles_profilesenabled` | 1 |
| `device_vendor_msft_policy_config_fslogixv1~policy~fslogix~profiles_profilesvhdlocations` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_fslogixv1~policy~fslogix~profiles_profilesvhdlocations_profilesvhdlocations` | \\%FSLogixStorageAccount%.file.core.windows.net\profiles |
| `device_vendor_msft_policy_config_fslogixv1~policy~fslogix~profiles_profilesisdynamicvhd` | 1 |
| `device_vendor_msft_policy_config_fslogixv1~policy~fslogix~profiles_profilessizeinmbs` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_fslogixv1~policy~fslogix~profiles_profilessizeinmbs_profilessizeinmbs` | 30000 |
| `device_vendor_msft_policy_config_fslogixv1~policy~fslogix~profiles~profiles_containeranddirectorynaming_profilesflipflopprofiledirectoryname` | 1 |
| `device_vendor_msft_policy_config_fslogixv1~policy~fslogix~profiles_profilesdeletelocalprofilewhenvhdshouldapply` | 1 |
| `device_vendor_msft_policy_config_fslogixv1~policy~fslogix~profiles_profilespreventloginwithfailure` | 1 |
| `device_vendor_msft_policy_config_fslogixv1~policy~fslogix~profiles_profilespreventloginwithtempprofile` | 1 |
| `device_vendor_msft_policy_config_kerberos_cloudkerberosticketretrievalenabled` | 1 |
| `device_vendor_msft_policy_config_fslogixv1~policy~fslogix_vhdcompactdisk` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
