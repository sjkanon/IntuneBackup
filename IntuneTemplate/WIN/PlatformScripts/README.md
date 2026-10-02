**Nederlands** · [English](README.en.md) · [Français](README.fr.md)

# Windows-platformscripts

Intune-platformscripts (`deviceManagementScripts`) zijn, net als de
[macOS-shellscripts](../../MAC/PlatformScripts/README.md), geen van de vijf CIPP-policytypes. Een
platformscript hangt onder `deviceManagement/deviceManagementScripts`, `Set-CIPPIntunePolicy` heeft
er geen `TemplateType` voor, en `Start-IntuneRestoreConfig` zet het niet terug. Een bestand hier
wordt dus **niet** opgepikt door CIPP, `export-intunebackup.js`, `check-scope.js` of
`Set-BaselineAssignment.ps1`.

De map heet `PlatformScripts/` omdat Intune ze op Windows zo noemt (*Scripts and remediations →
Platform scripts*). Op macOS heten ze in de portal *Shell scripts*; ze staan in
[`MAC/PlatformScripts/`](../../MAC/PlatformScripts/README.md), zodat beide platformen dezelfde indeling hebben.

| Bestand | Wat het doet | Scope |
|---|---|---|
| `Mount-AzureFilesDrive.ps1` | Koppelt `\\<account>.file.core.windows.net\<share>\<submap>` als `Z:` met het Entra Kerberos-ticket | Gebruiker |
| `Enable-AutoTimezone.ps1` | Zet locatievoorzieningen en *Tijdzone automatisch instellen* aan — uit OpenIntuneBaseline | Apparaat |
| `Trigger-PostOOBEUpdates.ps1` | Start na Autopilot meteen een update van Defender-definities, Store-apps en Windows Update — uit OpenIntuneBaseline | Gebruiker (draait als SYSTEM) |

## Mount-AzureFilesDrive.ps1

Het Windows-equivalent van [`mount-azure-files.sh`](../../MAC/PlatformScripts/README.md) op de
Mac, en de vervanger van de drive maps uit Group Policy Preferences.

### Waarom een script en geen policy

Er is geen drive-mapping-policy. Alle 18.329 `settingDefinitionId`'s van de settings catalog
zijn nagezocht op iets dat een netwerkschijf koppelt; dat bestaat niet, op geen van beide
platformen. Wat er op lijkt en het niet is:

| Wat je vindt | Wat het echt doet |
|---|---|
| `..._userprofiles_user_home_drive_letter` | de home-drive uit AD, niet een mapping die je zelf kiest |
| `..._terminalserver_ts_user_home_ts_drive_letter` | hetzelfde, maar voor een Terminal Server-sessie |

Group Policy Preferences → Drive Maps is geen ADMX en dus ook niet met ADMX-ingestion in
Intune te krijgen. Een mapping is een handeling en geen instelling, en dus een script.

### Instellingen in Intune

Devices → Scripts and remediations → Platform scripts → Add → Windows 10 and later.

| Instelling | Waarde | Waarom |
|---|---|---|
| Run this script using the logged on credentials | **Yes** | een netwerkschijf hoort bij een gebruikersprofiel; als SYSTEM landt hij nergens |
| Enforce script signature check | No | |
| Run script in 64 bit PowerShell Host | Yes | |

Toewijzen aan een **gebruikersgroep**, niet aan apparaten: wie bij de share mag is een
eigenschap van de gebruiker, en de share-level permissions in Azure staan op dezelfde groep.

### Eén run is genoeg

Een platformscript draait één keer per gebruiker per apparaat, en dat is hier voldoende:
`New-PSDrive -Persist` schrijft de mapping in `HKCU\Network` en Windows herstelt persistente
mappings bij elke aanmelding.

Haalt de gebruiker de schijf daarna zelf weg, dan komt hij niet terug. Dat is een keuze en
geen tekortkoming — dezelfde lijn als bij `configure-dock.sh`, waar de Dock na de eerste
inrichting van de gebruiker is. Moet de mapping zichzelf wél herstellen, dan is dit script het
verkeerde middel: dat wordt een **remediation** (een detectiescript plus een herstelscript,
met een eigen schema). Die vragen Windows Enterprise E3/E5 of Intune Plan 2.

Is de gekozen letter al bezet door iets anders, dan laat het script hem staan en stopt met
exit 1. Een bestaande schijf onder de gebruiker vandaan trekken is erger dan deze niet
koppelen.

### Share en submap zijn niet hetzelfde

`\\<account>.file.core.windows.net\<share>\<submap>` staat in het script als drie velden:
`$ShareName` is de **share**, `$ShareSubPath` een **map daarin**. SMB kent maar één
sharelaag, en dat onderscheid is niet cosmetisch — de verbinding en de share-level permissions
in Azure hangen aan de share, de submap is alleen het punt waar de schijf begint. Wie alleen bij één submap mag hoort dat via
NTFS-rechten in de map te krijgen, niet door hier een andere waarde in te vullen.

`$ShareSubPath` leeg laten koppelt de hele share.

### Wat er buiten dit script moet staan

| Voorwaarde | Waar |
|---|---|
| `Kerberos/CloudKerberosTicketRetrievalEnabled` = 1 | **staat al in de baseline** — [`Baseline_WIN_D_Windows_Hello_Cloud_Kerberos_Trust`](../SettingsCatalog/Baseline_WIN_D_Windows_Hello_Cloud_Kerberos_Trust.md), alle apparaten |
| Apparaat is Entra joined of Entra hybrid joined | inschrijving |
| `WinHttpAutoProxySvc` en `iphlpsvc` draaien | **niet uitgezet door de baseline** — de enige diensten die `Security Hardening` uitschakelt zijn de vier Xbox-diensten |
| Entra Kerberos aan op het storage account, admin consent, cloud-only groepsondersteuning, MFA uitgesloten voor de Entra-app, share-level permissions | Azure-portal — de stappen staan één keer uitgeschreven bij de macOS-tegenhanger, onder [De Azure-kant](../../MAC/PlatformScripts/README.md#de-azure-kant-een-tweede-storage-account-met-entra-kerberos). Ze gelden onverkort voor Windows. |

Cloud-only identiteiten vragen bovendien Windows 11 24H2 of hoger met de cumulatieve update
van maart 2026 (KB5079391 / KB5079489); hybride identiteiten werken vanaf Windows 10 2004.

`HostToRealm` is hier **niet** nodig. Die mapping is er alleen voor het geval een apparaat
óók bij storage accounts moet die op on-premises AD DS zijn aangesloten; is dat niet zo, dan blijft hij weg.

### Als er tóch een aanmeldvenster komt

Dan is het ticket het probleem en niet de mapping. In volgorde van waarschijnlijkheid:

1. MFA is niet uitgesloten voor de Entra-app van het storage account. Symptoom is
   `System error 1327` bij `net use`.
2. De gebruiker heeft geen share-level permission op de share.
3. Admin consent op de service principal van het storage account ontbreekt.
4. Het apparaat heeft de policy nog niet: `CloudKerberosTicketRetrievalEnabled` vraagt een
   policy-refresh of een herstart.

`klist cloud_debug` toont of het apparaat een cloud-TGT kan ophalen; `klist` laat zien of er
een ticket voor `KERBEROS.MICROSOFTONLINE.COM` in de cache staat.

### Logging

`%LOCALAPPDATA%\Baseline\mount-azurefiles.log`, dezelfde plek en vorm als de macOS-kant.

## Enable-AutoTimezone.ps1

Uit OpenIntuneBaseline (`WINDOWS/Scripts/Enable-AutoTimezone.ps1`, v1.1), ongewijzigd
overgenomen; licentie GPL-3.0, de auteursregel staat in de kop van het script.

Het hoort bij [`Baseline_WIN_D_Timezone`](../SettingsCatalog/Baseline_WIN_D_Timezone.md).
Die policy zet de klok gelijk via NTP en laat gebruikers de tijdzone wijzigen, maar zet
*Tijdzone automatisch instellen* niet aan: daar heeft de settings catalog geen instelling voor.
Een laptop die van Amsterdam naar Lissabon gaat, blijft dan op Amsterdamse tijd staan tot de
gebruiker het zelf ziet — en zonder beheerrechten lukt dat sinds 24H2 niet altijd (OIB noemt
het bekende probleem in de Windows release health).

Wat het script zet, in `HKLM`:

| Sleutel | Waarde | Effect |
|---|---|---|
| `…\CapabilityAccessManager\ConsentStore\location` `Value` | `Allow` | locatievoorzieningen aan voor het apparaat |
| `SYSTEM\CurrentControlSet\Services\tzautoupdate` `Start` | `3` | de dienst voor automatische tijdzone mag starten |
| `…\Services\lfsvc\Service\Configuration` `Status` | `1` | de geolocatiedienst aan; daarna (her)gestart |
| `…\Sensor\Overrides\{BFA794E4-…}` `SensorPermissionState` | `1` | de locatiesensor aan |

**Botst niet met de baseline.** [`Location and Privacy`](../SettingsCatalog/Baseline_WIN_D_Location_and_Privacy.md)
staat locatie toe en laat per app de keuze aan de gebruiker (`LetAppsAccessLocation` = 0);
dit script zet alleen de schakelaar voor het hele apparaat aan, zodat Windows zelf de tijdzone
kan bepalen. Welke app de locatie krijgt, blijft de gebruiker bepalen.

| Instelling in Intune | Waarde |
|---|---|
| Run this script using the logged on credentials | No |
| Enforce script signature check | No |
| Run script in 64 bit PowerShell Host | Yes |

Toewijzen aan **alle apparaten** — fase 1, net als de Timezone-policy. Een platformscript
draait één keer; zet een gebruiker locatie daarna zelf uit, dan blijft dat zo.

Logboek: `%ProgramData%\Microsoft\IntuneManagementExtension\Logs\OIB-AutoTimezone.log`.

## Trigger-PostOOBEUpdates.ps1

Uit OpenIntuneBaseline (`WINDOWS/Scripts/Trigger-PosstOOBEUpdates.ps1`, v1), ongewijzigd
overgenomen op de bestandsnaam na: de typfout *Posst* is eruit. Licentie GPL-3.0.

Een apparaat dat net uit Autopilot komt, heeft de definities en Store-apps van de dag dat de
image gemaakt is. Windows haalt die vanzelf op, maar op zijn eigen moment — soms pas een dag
later. Dit script start de drie direct, achter elkaar:

1. `Update-MpSignature` — Defender-definities;
2. `UpdateScanMethod` op `MDM_EnterpriseModernAppManagement_AppManagement01` — Store-apps;
3. `USOClient.exe StartInteractiveScan` — een Windows Update-scan, met de instellingen uit de
   update-ring van het apparaat.

| Instelling in Intune | Waarde |
|---|---|
| Run this script using the logged on credentials | **No** — het moet als SYSTEM draaien |
| Enforce script signature check | No |
| Run script in 64 bit PowerShell Host | Yes |

Toewijzen aan een **gebruikersgroep**, zoals OIB voorschrijft. Toegewezen aan apparaten zou
het al tijdens de apparaatfase van de Enrollment Status Page draaien, vóór de apps er staan;
via de gebruiker draait het pas bij de eerste aanmelding, en dan als SYSTEM omdat
*logged on credentials* uit staat. Daarna één keer per gebruiker per apparaat; een tweede
run doet geen kwaad. Het hoort bij de Autopilot-inrichting en volgt die fase.

Logboek: `%ProgramData%\Microsoft\IntuneManagementExtension\Logs\OIB-PostOOBEUpdates.log.log`
— de dubbele extensie zit zo in het origineel.

---

Terug naar de [hoofd-README](../../README.md).
