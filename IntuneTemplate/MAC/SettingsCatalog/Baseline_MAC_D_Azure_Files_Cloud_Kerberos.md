<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - D - Azure Files Cloud Kerberos

Geeft de Mac een Kerberos-ticket voor het Entra Cloud Kerberos-realm, zodat een SMB-share op Azure Files opent zonder dat de gebruiker opnieuw inlogt.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-154-MACDAzureFilesCloudKerberos` |
| Bron | Microsoft Learn — Enable Microsoft Entra Kerberos authentication for Azure Files on macOS with Platform SSO (preview), en de Entra-handleiding voor Kerberos SSO in Platform SSO; settingDefinitionId's geverifieerd tegen de settings catalog-definities |
| Bestand | [`Baseline_MAC_D_Azure_Files_Cloud_Kerberos.json`](Baseline_MAC_D_Azure_Files_Cloud_Kerberos.json) |

> Hoort bij [Baseline] - MAC - D - Platform SSO en doet zonder die policy niets: het Cloud-TGT wordt door Platform SSO uitgegeven, dit profiel vertelt de Kerberos-extensie van Apple alleen wélk realm erbij hoort en dat hij dat TGT mag gebruiken (`usePlatformSSOTGT`). `performKerberosOnly` houdt de extensie weg van wachtwoordverloop-checks, wachtwoordsynchronisatie en het thuismappad — die horen bij Platform SSO, niet hier.
>
> Een tweede policy naast Platform SSO en geen uitbreiding ervan: de settings catalog kent voor `com.apple.extensiblesso` twee losse vormen, de Platform SSO-vorm (`com.apple.extensiblesso_com.apple.extensiblesso`) en de Kerberos-vorm die deze policy gebruikt (`com.apple.extensiblesso_com.apple.extensiblesso-kerberos_kerberos`). Elke Kerberos-realm is één zo'n vorm, met een eigen `Realm` en eigen `Hosts`. Op de Mac worden die profielen naast elkaar geïnstalleerd en voegt macOS de payloads samen; check-scope.js meldt die overlap bij Apple daarom bewust niet als conflict.
>
> Het tenant-id staat als `%OrganizationId%` in de `preferredKDCs`-URL, dezelfde constructie als in de OneDrive-KFM- en Teams-policies: CIPP vervangt dat token bij uitrol door de customerId van de tenant (zie Get-CIPPTextReplacement in CIPP-API); `%tenantid%` doet hetzelfde. Rol je met IntuneBackupAndRestore uit in plaats van met CIPP, dan gebeurt die vervanging niet en moet je het id met de hand invullen. `generate-baseline.js` laat die ene instelling bewust buiten de check — in de tenant staat de GUID en niet het token, dus een check die het token als verwachte waarde meeneemt is per definitie rood.
>
> Aan de tenantkant moeten er vier dingen staan vóór dit profiel iets oplevert: Entra Kerberos aan op het storage account, admin consent op de service principal die daarbij hoort, MFA uit voor de Entra-app van dat storage account, en share-level permissions op de share zelf. Bestaat de file share al, dan staat de identifier URI van die app-registratie als `CIFS/<account>.file.core.windows.net` — met hoofdletters. macOS mount alleen op `cifs/` in kleine letters; Microsoft levert daar `updateappmanifestazurefiles.ps1` voor in azure-files-samples. Nieuwe shares hebben dat probleem niet.
>
> De on-premises AD-kant zou een tweede policy van deze vorm zijn, met het eigen realm en de eigen domeinnaam in `Hosts`. Die zit hier niet in — er is geen on-premises AD in beeld. Komt die er wel, dan hoort het on-prem-profiel eerst te worden uitgerold en dit daarna, in die volgorde. De TGT-toewijzing zelf is te sturen met `custom_tgt_setting` in de extension data van de Platform SSO-policy (Company Portal 2508+); de standaardwaarde 0 wijst zowel het on-prem- als het cloud-TGT toe, en daarom hoeft die policy voor dit profiel niet te wijzigen.
>
> Microsoft schrijft bij Platform SSO-profielen "toewijzen aan gebruikers, niet aan apparaten". Deze baseline houdt macOS-profielen op apparaatgroepen, gelijk aan de bestaande Platform SSO-policy. Zolang de policy in fase 3 staat is dat geen praktisch verschil: hij wordt aangemaakt en niet toegewezen.
>
> Controleren na uitrol: `app-sso platform -s` in Terminal moet een ticket tonen met `ticketKeyPath` = `tgt_cloud`, en `nc -vz <account>.file.core.windows.net 445` moet open zijn. Dat de menubalk-extra van de Kerberos-extensie "Not signed in" meldt is normaal en betekent niet dat het niet werkt.

## Instellingen — 10

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.extensiblesso_com.apple.extensiblesso-kerberos_kerberos` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensionidentifier_kerberos` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_teamidentifier_kerberos` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_type_kerberos` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_realm_kerberos` | KERBEROS.MICROSOFTONLINE.COM |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensiondata_kerberos` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensiondata_useplatformssotgt_kerberos` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensiondata_performkerberosonly_kerberos` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensiondata_preferredkdcs_kerberos` | kkdcp://login.microsoftonline.com/%OrganizationId%/kerberos |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_hosts_kerberos` | windows.net, .windows.net |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
