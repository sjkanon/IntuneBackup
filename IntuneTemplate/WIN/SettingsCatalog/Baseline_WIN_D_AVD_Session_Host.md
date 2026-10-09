<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_AVD_Session_Host.en.md) · [Français](Baseline_WIN_D_AVD_Session_Host.fr.md)

# [Baseline] - WIN - D - AVD Session Host

Meldt op de AVD-sessiehosts een verbroken sessie na twee uur af, verbreekt een sessie die twee uur niets doet, en laat Storage Sense opruimen in het gekoppelde profiel (dagelijks via de cadence in de image): OneDrive-bestanden na zeven dagen alleen online, tijdelijke bestanden, de prullenbak na veertien en Downloads na dertig dagen.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| Bron | Eigen — de sessielimieten van Remote Desktop Services en de Storage Sense-instellingen uit de Settings Catalog, met waarden voor FSLogix-profielcontainers |
| Bestand | [`Baseline_WIN_D_AVD_Session_Host.json`](Baseline_WIN_D_AVD_Session_Host.json) |

> **De cadence staat niet in deze policy.** configstoragesenseglobalcadence heeft in zijn Settings Catalog-definitie geen windowsMultiSession in applicability.windowsSkus, dus Intune levert hem niet aan een multi-session-host (de andere vijf Storage Sense-instellingen wel; op de host geverifieerd). Zonder cadence draait Storage Sense alleen bij weinig vrije ruimte op C:, en die loopt op een sessiehost nooit vol — Storage Sense zou dan nooit draaien. De AVD-image zet daarom ConfigStorageSenseGlobalCadence = 1 (dagelijks) onder HKLM\SOFTWARE\Policies\Microsoft\Windows\StorageSense (run-vdot.ps1 in de AVD-repo). Downloads pas na dertig dagen, omdat dat echte verwijdering is; OneDrive-dehydratie na zeven dagen, omdat het bestand online blijft. Geen wekelijkse Invoke-FslShrinkDisk of FSLShrink meer nodig: de ingebouwde compactie bij afmelding (FSLogix 2210 en later) doet hetzelfde bij elke afmelding, zonder aparte VM met rechten op het share en zonder risico dat een script een gekoppelde container raakt; de sessielimieten hierboven zorgen dat er ook echt wordt afgemeld. FSLShrink alleen nog als noodmiddel voor containers die al groot zijn: eenmalig, buiten kantooruren, met de hosts in drain mode. Tijdzone-redirectie (ts_time_zone) staat hier bewust niet in: [Baseline] - WIN - D - Cloud PC Session Security zet hem al op de sessiehosts (groep SEC-Cloud-PC). **Overlap met [Baseline] - WIN - D - Cloud PC External Access:** die zet dezelfde twee sessielimieten op 15 minuten. Op een hostpool voor externen landen beide policies en botsen ze (Conflict: dan geldt geen van beide limieten); in het pakketmodel is deze policy daar niet los uit te sluiten — zie de open punten in docs/AVD.md. De waarden staan in milliseconden: 7200000 is twee uur.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.6.7 Werken op afstand<br>A.8.1 Eindpuntapparatuur van gebruikers<br>A.8.6 Capaciteitsbeheer |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 4.3 Configure Automatic Session Locking on Enterprise Assets<br>13.5 Manage Access Control for Remote Assets |
| NIST CSF 2.0 | PR.AA-05<br>PR.IR-04 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Instellingen — 9

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_admx_terminalserver_ts_sessions_idle_limit_2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_terminalserver_ts_sessions_idle_limit_2_ts_sessions_idlelimittext` | 7200000 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_sessions_disconnected_timeout_2` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_terminalserver_ts_sessions_disconnected_timeout_2_ts_sessions_enddisconnected` | 7200000 |
| `device_vendor_msft_policy_config_storage_allowstoragesenseglobal` | 1 |
| `device_vendor_msft_policy_config_storage_allowstoragesensetemporaryfilescleanup` | 1 |
| `device_vendor_msft_policy_config_storage_configstoragesensecloudcontentdehydrationthreshold` | 7 |
| `device_vendor_msft_policy_config_storage_configstoragesenserecyclebincleanupthreshold` | 14 |
| `device_vendor_msft_policy_config_storage_configstoragesensedownloadscleanupthreshold` | 30 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
