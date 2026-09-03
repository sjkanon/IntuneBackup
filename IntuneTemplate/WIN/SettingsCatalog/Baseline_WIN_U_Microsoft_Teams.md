<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - U - Microsoft Teams

Beperkt aanmelden in Teams tot de eigen tenant en voorkomt dat Teams zichzelf na installatie meteen start.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-145-UMicrosoftTeams` |
| Bron | IntuneAdmin/IntuneBaselines — Windows 11 Benchmarks/Microsoft Teams |
| Bestand | [`Baseline_WIN_U_Microsoft_Teams.json`](Baseline_WIN_U_Microsoft_Teams.json) |

> Het tenant-id staat als `%OrganizationId%` in het template. CIPP vervangt dat bij uitrol door de customerId van de tenant (zie Get-CIPPTextReplacement); `%tenantid%` doet hetzelfde. Dezelfde constructie gebruiken de OneDrive-policies al voor hun tenantlijst. Rol je met IntuneBackupAndRestore uit in plaats van met CIPP, dan gebeurt die vervanging niet en moet je het id met de hand invullen. Meerdere tenants scheid je met een komma. De tweede instelling is comfort en geen beveiliging: Teams start niet meteen na installatie.

## Instellingen — 3

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `user_vendor_msft_policy_config_teamsv3~policy~l_teams_string_teams_signinrestriction_policy` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_teamsv3~policy~l_teams_string_teams_signinrestriction_policy_restrictteamssignintoaccountsfromtenantlist` | %OrganizationId% |
| `user_vendor_msft_policy_config_teamsv2~policy~l_teams_teams_preventfirstlaunchafterinstall_policy` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
