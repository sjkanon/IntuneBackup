<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](README.en.md) · [Français](README.fr.md)

# macOS — 37 policies

Alle policies heten `CXNM - Standard - MAC - <D|U> - <Item>`; de tabellen hieronder laten het `<Item>`-deel zien.

| Map | Aantal |
|---|---:|
| `SettingsCatalog/` | 30 |
| `DeviceConfigurations/` | 3 |
| `CompliancePolicies/` | 4 |

## Overige onderdelen

Geen CIPP-policytype, dus niet in de tabellen hieronder en niet in een CIPP-pakket. Hoe elk onderdeel uitrolt, staat in zijn README.

| Map | Wat |
|---|---|
| [`ComplianceScripts/`](ComplianceScripts/README.md) | Aangepaste compliance: Defender for Endpoint |
| [`EndpointSecurity/`](EndpointSecurity/README.md) | Defender for Endpoint-onboarding op macOS |
| [`Enrollment/ade-profile/`](Enrollment/ade-profile/README.md) | macOS ADE-enrollmentprofielen |
| [`Enrollment/apple-business/`](Enrollment/apple-business/README.md) | Apple Business-checklist |
| [`Enrollment/enrollment-restriction/`](Enrollment/enrollment-restriction/README.md) | Inschrijvingsrestrictie: geen persoonlijke Macs |
| [`PlatformScripts/`](PlatformScripts/README.md) | macOS shell-scripts |

## Device-scoped (D) — 29

Toewijzen aan apparaatgroepen.

| Policy | Wat het doet | Type | Instellingen | Toewijzing |
|---|---|---|---:|---|
| [**Accounts and Login**](SettingsCatalog/Baseline_MAC_D_Accounts_and_Login.md) | Bepaalt wat er bij het aanmelden zichtbaar is en welke accounts een Mac mag hebben. | Settings Catalog | 5 | All Devices |
| [**Apple Intelligence Permitted**](SettingsCatalog/Baseline_MAC_D_Apple_Intelligence_Permitted.md) | Staat dezelfde Apple Intelligence-functies uitdrukkelijk toe: Writing Tools, samenvattingen in Mail, Notities en Safari, Genmoji, Image Playground, de externe AI-integratie en dicteren via Apple's servers. | Settings Catalog | 12 | — |
| [**Apple Intelligence Restricted**](SettingsCatalog/Baseline_MAC_D_Apple_Intelligence_Restricted.md) | Zet Apple Intelligence-functies uit die tekst, e-mail, notities, webpagina's of afbeeldingen door een taalmodel laten verwerken of naar een externe AI-dienst sturen, en houdt dicteren op het apparaat. | Settings Catalog | 12 | — |
| [**Azure Files Cloud Kerberos**](SettingsCatalog/Baseline_MAC_D_Azure_Files_Cloud_Kerberos.md) | Geeft de Mac een Kerberos-ticket voor het Entra Cloud Kerberos-realm, zodat een SMB-share op Azure Files opent zonder dat de gebruiker opnieuw inlogt. | Settings Catalog | 8 | — |
| [**Defender Antivirus**](SettingsCatalog/Baseline_MAC_D_Defender_Antivirus.md) | Realtimebeveiliging, cloudbescherming en scangedrag van Defender op macOS. | Settings Catalog | 24 | All Devices |
| [**Defender for Endpoint**](SettingsCatalog/Baseline_MAC_D_Defender_for_Endpoint.md) | Geeft Defender de systeemrechten die macOS eist voordat het kan werken: systeemextensie, netwerkfilter en volledige schijftoegang. Zonder deze policy blijft Defender op een Mac half geïnstalleerd. | Settings Catalog | 50 | All Devices |
| [**Enrollment Profile Administrator User Affinity**](SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Administrator_User_Affinity.md) | Doorloopt Setup Assistant voor een bedrijfs-Mac met user affinity en vergrendelde inschrijving, en maakt het aangemelde account aan als lokale beheerder. | Settings Catalog | 40 | — |
| [**Enrollment Profile Standard User Affinity**](SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Standard_User_Affinity.md) | Doorloopt Setup Assistant voor een bedrijfs-Mac met user affinity en vergrendelde inschrijving, en maakt het aangemelde account aan als standaardgebruiker; beheer loopt via het verborgen servicedeskaccount. | Settings Catalog | 40 | — |
| [**External Storage Read Only**](SettingsCatalog/Baseline_MAC_D_External_Storage_Read_Only.md) | Laat macOS alleen externe opslag koppelen die zelf alleen-lezen is. Gewone USB-sticks en externe schijven — die lees-schrijf zijn — worden helemaal niet gekoppeld. | Settings Catalog | 1 | — |
| [**FileVault**](SettingsCatalog/Baseline_MAC_D_FileVault.md) | Versleutelt de schijf van de Mac en bewaart de herstelsleutel in Intune. De macOS-tegenhanger van BitLocker. | Settings Catalog | 7 | — |
| [**Firewall and Gatekeeper**](SettingsCatalog/Baseline_MAC_D_Firewall_and_Gatekeeper.md) | Zet de macOS-firewall aan en laat Gatekeeper alleen software toe die door een herkende ontwikkelaar is ondertekend. | Settings Catalog | 7 | All Devices |
| [**Login Window**](SettingsCatalog/Baseline_MAC_D_Login_Window.md) | Laat het inlogvenster om accountnaam én wachtwoord vragen in plaats van een lijst met accounts te tonen, en toont een korte melding dat het apparaat alleen voor geautoriseerd gebruik is. | Settings Catalog | 2 | — |
| [**Microsoft AutoUpdate**](SettingsCatalog/Baseline_MAC_D_Microsoft_AutoUpdate.md) | Hoe en wanneer Office, Edge en andere Microsoft-apps op de Mac zichzelf bijwerken. | Settings Catalog | 14 | All Devices |
| [**Microsoft Edge Password Management**](SettingsCatalog/Baseline_MAC_D_Microsoft_Edge_Password_Management.md) | Bepaalt of Edge op de Mac wachtwoorden mag opslaan en tonen. | Settings Catalog | 3 | All Devices |
| [**Microsoft Edge Security**](SettingsCatalog/Baseline_MAC_D_Microsoft_Edge_Security.md) | De beveiligingsinstellingen van Edge op macOS: SmartScreen, downloadcontrole en certificaatgedrag. | Settings Catalog | 31 | All Devices |
| [**Microsoft Office**](SettingsCatalog/Baseline_MAC_D_Microsoft_Office.md) | Basisconfiguratie van Office op macOS. | Settings Catalog | 5 | All Devices |
| [**Microsoft OneDrive**](SettingsCatalog/Baseline_MAC_D_Microsoft_OneDrive.md) | Meldt de OneDrive-client op de Mac automatisch aan met het werkaccount en geeft 'm de toegangsrechten die macOS eist. | Settings Catalog | 13 | All Devices |
| [**Passcode and Screen Lock**](SettingsCatalog/Baseline_MAC_D_Passcode_and_Screen_Lock.md) | Stelt op de Mac het wachtwoord en de schermvergrendeling in die de compliance-policy al eist: minimaal acht tekens, geen eenvoudig wachtwoord, vergrendelen na vijftien minuten. | Settings Catalog | 7 | — |
| [**Platform SSO**](SettingsCatalog/Baseline_MAC_D_Platform_SSO.md) | Koppelt het aanmelden op de Mac aan Entra ID via de Microsoft-SSO-plug-in, zodat het Mac-wachtwoord en het werkaccount samenvallen. | Settings Catalog | 24 | All Devices |
| [**Privacy Preferences**](SettingsCatalog/Baseline_MAC_D_Privacy_Preferences.md) | Alleen voor organisaties die NinjaOne of TeamViewer gebruiken. Zet de privacyrechten (PPPC) van de beheertools vast: NinjaOne Remote en TeamViewer krijgen Toegankelijkheid zodat besturing op afstand werkt, en de drie NinjaOne-onderdelen krijgen Volledige schijftoegang — zonder dat de gebruiker het hoeft goed te keuren, en zonder dat hij het kan intrekken. | Settings Catalog | 40 | — |
| [**Recovery Lock**](SettingsCatalog/Baseline_MAC_D_Recovery_Lock.md) | Zet op Macs met Apple silicon een willekeurig, door Intune beheerd wachtwoord op recoveryOS en de opstartopties, en vervangt het elke zes maanden. | Settings Catalog | 2 | — |
| [**Restrictions Hardening**](SettingsCatalog/Baseline_MAC_D_Restrictions_Hardening.md) | Vult de macOS-restricties aan met vijf maatregelen die OpenIntuneBaseline macOS v1.0 niet zet: geen handmatig geïnstalleerde configuratieprofielen of certificaten, geen Gatekeeper-omzeiling via de Finder, geen diagnostische gegevens naar Apple, geen internetresultaten in Spotlight en geen contentcaching. | Settings Catalog | 5 | — |
| [**Restrictions**](SettingsCatalog/Baseline_MAC_D_Restrictions.md) | Beperkt de macOS-functies waarmee bedrijfsdata het apparaat kan verlaten. | Settings Catalog | 37 | All Devices |
| [**Screen Recording**](DeviceConfigurations/Baseline_MAC_D_Screen_Recording.md) | Alleen voor organisaties die NinjaOne of TeamViewer gebruiken. Zet schermopname voor NinjaOne Remote en TeamViewer op AllowStandardUserToSetSystemService: een gebruiker zonder beheerdersrechten kan het vinkje zelf aanzetten, zonder beheerderswachtwoord. Aanzetten blijft een handmatige klik — macOS staat een MDM niet toe schermopname te verlenen. | Device config | — | — |
| [**Screensaver**](SettingsCatalog/Baseline_MAC_D_Screensaver.md) | Vraagt het wachtwoord uiterlijk vijf seconden nadat de schermbeveiliging start, en start de schermbeveiliging na vijftien minuten inactiviteit — ook in het inlogvenster. | Settings Catalog | 4 | — |
| [**Software Updates**](SettingsCatalog/Baseline_MAC_D_Software_Updates.md) | Hoe en wanneer macOS zijn eigen updates ophaalt en installeert. | Settings Catalog | 16 | — |
| [**Time Server**](SettingsCatalog/Baseline_MAC_D_Time_Server.md) | Laat de Mac zijn klok gelijkzetten met time.apple.com, zodat tijdstempels in logboeken, Kerberos-tickets en certificaatcontroles kloppen. | Settings Catalog | 1 | All Devices |
| [**Wifi Corporate**](DeviceConfigurations/Baseline_MAC_D_Wifi_Corporate.md) | Rolt het bedrijfsnetwerk als wifi-profiel uit op elke Mac, zodat een apparaat na inschrijving vanzelf verbinding heeft en een gebruiker het netwerkwachtwoord nooit hoeft te kennen of in te typen. | Device config | — | — |
| [**Wifi Guest**](DeviceConfigurations/Baseline_MAC_D_Wifi_Guest.md) | Rolt het gastnetwerk uit als tweede profiel op elke Mac, zodat een apparaat online blijft wanneer het bedrijfsnetwerk niet bereikbaar is. | Device config | — | — |

## User-scoped (U) — 8

Toewijzen aan gebruikersgroepen.

| Policy | Wat het doet | Type | Instellingen | Toewijzing |
|---|---|---|---:|---|
| [**Compliance Device Health**](CompliancePolicies/Baseline_MAC_U_Compliance_Device_Health.md) | Toetst of System Integrity Protection op de Mac aanstaat. | Compliance | — | All Users |
| [**Compliance Device Security**](CompliancePolicies/Baseline_MAC_U_Compliance_Device_Security.md) | Toetst of de schijf van de Mac versleuteld is, de firewall aanstaat en Gatekeeper alleen ondertekende software toelaat. | Compliance | — | All Users |
| [**Compliance OS Version**](CompliancePolicies/Baseline_MAC_U_Compliance_OS_Version.md) | Toetst of de Mac op macOS 14 of hoger draait — de versie die het declaratieve updatebeleid van de baseline vereist. | Compliance | — | — |
| [**Compliance Password**](CompliancePolicies/Baseline_MAC_U_Compliance_Password.md) | Toetst of de Mac een wachtwoord vereist en hoe sterk die moet zijn. | Compliance | — | All Users |
| [**Microsoft Edge Extensions**](SettingsCatalog/Baseline_MAC_U_Microsoft_Edge_Extensions.md) | Bepaalt welke Edge-extensies gebruikers op de Mac mogen installeren. | Settings Catalog | 4 | All Users |
| [**Microsoft Edge Profiles and Sync**](SettingsCatalog/Baseline_MAC_U_Microsoft_Edge_Profiles_and_Sync.md) | Bepaalt met welk account gebruikers zich in Edge aanmelden en wat er gesynchroniseerd wordt. | Settings Catalog | 4 | All Users |
| [**Microsoft Edge Updates**](SettingsCatalog/Baseline_MAC_U_Microsoft_Edge_Updates.md) | Hoe en wanneer Edge op de Mac zichzelf bijwerkt. | Settings Catalog | 7 | All Users |
| [**Microsoft OneDrive KFM**](SettingsCatalog/Baseline_MAC_U_Microsoft_OneDrive_KFM.md) | Verplaatst Bureaublad en Documenten van de Mac naar OneDrive, zodat er niets alleen lokaal staat. | Settings Catalog | 15 | All Users |

---

**Wat het doet** komt uit `doel` in [`_manifest.json`](../_manifest.json). Diezelfde zin
staat in het Engels, samen met het toewijzingsdoel en de herkomst, in het `Description`-veld
van het template — en dus straks in de tenant naast de policy.
