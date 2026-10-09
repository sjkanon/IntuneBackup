**Nederlands** · [English](README.en.md) · [Français](README.fr.md)

# Toewijzingsfilters voor Windows

Twee `deviceAndAppManagementAssignmentFilter`-bodies, één per apparaatklasse met een filter. Een
filter verfijnt een toewijzing aan alle apparaten, alle gebruikers of een groep: *alle apparaten,
maar alleen de fysieke*. Hier maakt het het onderscheid tussen fysieke toestellen en de Azure
Virtual Desktop-sessiehosts met Windows 11 Enterprise multi-session.

| Bestand | Filter | Regel | Klasse (`doelgroep`) |
|---|---|---|---|
| `WIN-Physical.json` | `WIN - Physical` | `(device.operatingSystemSKU -ne "ServerRdsh") and (device.model -ne "Virtual Machine") and (device.model -notContains "Cloud PC")` | **fysiek** — laptops en workstations |
| `WIN-AVD-Multi-Session.json` | `WIN - AVD Multi-session` | `(device.operatingSystemSKU -eq "ServerRdsh")` | **avd** — multi-session-sessiehosts |

Beide worden alleen als **include** gebruikt. De derde klasse, **alle**, heeft geen filter: die
policies gaan naar elk Windows-apparaat. Welke policy in welke klasse zit staat als `doelgroep` in
[`_manifest.json`](../../_manifest.json) en per policy met de reden in
[docs/AVD.md](../../../docs/AVD.md); het draaiboek staat in [docs/PLAYBOOK.md](../../../docs/PLAYBOOK.md).

In de testtenant gevalideerd (`validateFilter` en *Preview devices*):

- `WIN - Physical` matcht de vier fysieke en QEMU-pc's en niet de AVD-sessiehost;
- `WIN - AVD Multi-session` matcht precies de AVD-sessiehost en geen enkele fysieke pc.

**Wat onder geen van beide valt:** een Windows 365 Cloud PC (model `Cloud PC …`, single-session)
en een persoonlijke AVD-host (model `Virtual Machine`, single-session). Die krijgen alleen de
policies van klasse *alle* — geen BitLocker, Windows Hello of Storage Sense, en ook geen
FSLogix. De Cloud PC-set (`Cloud PC Session Security`, `Cloud PC External Access`) bereikt ze via
zijn eigen groepen. Een Hyper-V- of Azure-VM die als gewone pc wordt gebruikt valt om dezelfde
reden buiten *fysiek*.

`-notStartsWith` bestaat niet in filterregels (de regel is dan ongeldig); daarom
`-notContains "Cloud PC"`.

Het filter werkt ook op gebruikersgerichte toewijzingen, zoals
`[Baseline] - WIN - U - Windows Hello for Business`: Intune toetst het filter op het apparaat waar
de gebruiker zich aanmeldt. Een uitsluiting van een apparaatgroep doet daar niets, want de
toewijzing gaat naar gebruikers.

Filters met `platform: windows10AndLater` zijn alleen te kiezen op Windows-policies.

## Uitrollen

Vóór de eerste CIPP-run van de baseline. CIPP zoekt het filter op naam op en wijst, als het niet
bestaat, toe **zonder** filter — dan landen de alleen-fysieke policies ook op de sessiehosts.

```http
POST https://graph.microsoft.com/beta/deviceManagement/assignmentFilters
Content-Type: application/json

<inhoud van het bestand>
```

Of `scripts/Set-BaselineAssignment.ps1 -CreateFilters` (eerst met `-WhatIf`), of in de portal:
Tenantbeheer → Filters → Maken → Beheerde apparaten → Windows 10 en later, en de regel uit de
tabel plakken. Controleer daarna met *Preview devices*. Een filter doet niets tot hij bij een
toewijzing wordt gekozen. De naam moet letterlijk kloppen: CIPP, `Set-BaselineAssignment.ps1` en
de export zoeken op `displayName`.
