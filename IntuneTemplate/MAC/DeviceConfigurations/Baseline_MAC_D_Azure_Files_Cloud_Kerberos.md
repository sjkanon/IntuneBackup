<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - D - Azure Files Cloud Kerberos

Geeft de Mac een Kerberos-ticket voor het Entra Cloud Kerberos-realm, zodat een SMB-share op Azure Files opent zonder dat de gebruiker opnieuw inlogt.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Device config |
| Toewijzing | — |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | Microsoft Learn — Enable Microsoft Entra Kerberos authentication for Azure Files on macOS with Platform SSO (preview), en de Entra-handleiding voor Kerberos SSO in Platform SSO |
| Bestand | [`Baseline_MAC_D_Azure_Files_Cloud_Kerberos.json`](Baseline_MAC_D_Azure_Files_Cloud_Kerberos.json) |

> Hoort bij [Baseline] - MAC - D - Platform SSO en doet zonder die policy niets: het Cloud-TGT wordt door Platform SSO uitgegeven, dit profiel vertelt de Kerberos-extensie van Apple alleen wélk realm erbij hoort en dat hij dat TGT mag gebruiken (`usePlatformSSOTGT`). `performKerberosOnly` houdt de extensie weg van wachtwoordverloop-checks en het thuismappad — die horen bij Platform SSO, niet hier. Custom profile en geen settings catalog, omdat de settings catalog voor `com.apple.extensiblesso` één SSO-payload per policy kent en die in de Platform SSO-policy al bezet is; twee Kerberos-realms zijn twee losse profielen, ook bij Apple zelf.
>
> **Het tenant-id staat als `TENANT-ID-INVULLEN` in de `preferredKDCs`-URL en moet vóór uitrol worden ingevuld.** Anders dan bij Teams en OneDrive kan `%tenantid%` hier niet: die policies dragen het token als platte tekst in het template, en CIPP vervangt dat bij uitrol (zie Get-CIPPTextReplacement). Een custom macOS-profiel draagt zijn mobileconfig als base64, en daar komt geen enkele `-replace` doorheen — het token zou letterlijk in de KDC-URL belanden en het ticket zou stil niet komen. Invullen gaat met `node scripts/set-cloud-kerberos-tenant.js <tenant-id>`; dat script decodeert de payload, vervangt de placeholder en codeert opnieuw. Het tenant-id komt daarmee wél in de repo te staan — dat is een bewuste afwijking van de regel dat de export geen tenant-id's bevat, en de reden om die commit niet naar een gedeelde fork te duwen.
>
> Aan de tenantkant moet er vier dingen staan vóór dit profiel iets oplevert: Entra Kerberos aan op het storage account, admin consent op de service principal die daarbij hoort, MFA uit voor de Entra-app van dat storage account, en share-level permissions op de share zelf. Bestaat de file share al, dan staat de identifier URI van die app-registratie als `CIFS/<account>.file.core.windows.net` — met hoofdletters. macOS mount alleen op `cifs/` in kleine letters; Microsoft levert daar `updateappmanifestazurefiles.ps1` voor in azure-files-samples. Nieuwe shares hebben dat probleem niet.
>
> De on-premises AD-kant is een tweede, apart profiel met een eigen realm en eigen `Hosts`. Die zit hier niet in — er is geen on-premises AD in beeld. Komt die er wel, dan hoort het on-prem-profiel eerst te worden uitgerold en dit daarna, in die volgorde. De TGT-toewijzing zelf is te sturen met `custom_tgt_setting` in de extension data van de Platform SSO-policy (Company Portal 2508+); de standaardwaarde 0 wijst zowel het on-prem- als het cloud-TGT toe, en daarom hoeft die policy voor dit profiel niet te wijzigen.
>
> Microsoft schrijft bij Platform SSO-profielen "toewijzen aan gebruikers, niet aan apparaten". Deze baseline houdt macOS-profielen op apparaatgroepen, gelijk aan de bestaande Platform SSO-policy — de payload is `PayloadScope: System` en gaat over het device channel. Zolang de policy in fase 3 staat is dat geen praktisch verschil: hij wordt aangemaakt en niet toegewezen.
>
> Controleren na uitrol: `app-sso platform -s` in Terminal moet een ticket tonen met `ticketKeyPath` = `tgt_cloud`, en `nc -vz <account>.file.core.windows.net 445` moet open zijn. Dat de menubalk-extra van de Kerberos-extensie "Not signed in" meldt is normaal en betekent niet dat het niet werkt.

## Eigenschappen — 4

Een klassieke device configuration heeft geen settingDefinitionId's maar vaste eigenschappen.

| Eigenschap | Waarde |
|---|---|
| `deploymentChannel` | deviceChannel |
| `payloadName` | Azure Files Cloud Kerberos |
| `payloadFileName` | baseline-mac-azure-files-cloud-kerberos.mobileconfig |
| `payload` | PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCFET0NUWVBFIHBsaXN0IFBVQkxJQyAiLS8vQXBwbGUvL0RURCBQTEl… |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
