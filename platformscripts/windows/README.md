# Windows-platformscripts

Intune-platformscripts (`deviceManagementScripts`) staan **buiten** `IntuneTemplate/`, om
dezelfde reden als de [macOS-shellscripts](../../shellscripts/macos/README.md): de pijplijnen
daar kennen vijf CIPP-policytypes en een platformscript is geen van die vijf. Het hangt onder
`deviceManagement/deviceManagementScripts`, `Set-CIPPIntunePolicy` heeft er geen
`TemplateType` voor, en `Start-IntuneRestoreConfig` zet het niet terug. Een bestand hier wordt
dus **niet** opgepikt door `generate-baseline.js`, `export-intunebackup.js`, `check-scope.js`
of `Set-BaselineAssignment.ps1`, en er hoort geen `checkId` bij.

De map heet `platformscripts/` en niet `shellscripts/` omdat Intune ze zelf zo noemt: op
Windows staan ze onder *Scripts and remediations → Platform scripts*, op macOS onder
*macOS → Shell scripts*. Twee namen voor hetzelfde idee, maar wie in de portal zoekt vindt ze
zo terug.

| Bestand | Wat het doet | Scope |
|---|---|---|
| `Mount-AzureFilesDrive.ps1` | Koppelt `\\acisafiles.file.core.windows.net\data\Public` als `Z:` met het Entra Kerberos-ticket | Gebruiker |

## Mount-AzureFilesDrive.ps1

Het Windows-equivalent van [`mount-azure-files.sh`](../../shellscripts/macos/README.md) op de
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

`\\acisafiles.file.core.windows.net\data\Public` staat in het script als drie velden: `data`
is de **share**, `Public` een **map daarin**. SMB kent maar één sharelaag, en dat onderscheid
is niet cosmetisch — de verbinding en de share-level permissions in Azure hangen aan `data`,
de submap is alleen het punt waar de schijf begint. Wie alleen bij `Public` mag hoort dat via
NTFS-rechten in de map te krijgen, niet door hier een andere waarde in te vullen.

`$ShareSubPath` leeg laten koppelt de hele share.

### Wat er buiten dit script moet staan

| Voorwaarde | Waar |
|---|---|
| `Kerberos/CloudKerberosTicketRetrievalEnabled` = 1 | **staat al in de baseline** — [`Baseline_WIN_D_Windows_Hello_Cloud_Kerberos_Trust`](../../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Cloud_Kerberos_Trust.md), alle apparaten |
| Apparaat is Entra joined of Entra hybrid joined | inschrijving |
| `WinHttpAutoProxySvc` en `iphlpsvc` draaien | **niet uitgezet door de baseline** — de enige diensten die `Security Hardening` uitschakelt zijn de vier Xbox-diensten |
| Entra Kerberos aan op het storage account, admin consent, MFA uitgesloten voor de Entra-app, share-level permissions | Azure-portal, zie [`Baseline_MAC_D_Azure_Files_Cloud_Kerberos`](../../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Azure_Files_Cloud_Kerberos.md) — dezelfde tenantkant geldt voor Windows |

Cloud-only identiteiten vragen bovendien Windows 11 24H2 of hoger met de cumulatieve update
van maart 2026 (KB5079391 / KB5079489); hybride identiteiten werken vanaf Windows 10 2004.

`HostToRealm` is hier **niet** nodig. Die mapping is er alleen voor het geval een apparaat
óók bij storage accounts moet die op on-premises AD DS zijn aangesloten; die zijn er niet.

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

---

Terug naar de [hoofd-README](../../README.md).
