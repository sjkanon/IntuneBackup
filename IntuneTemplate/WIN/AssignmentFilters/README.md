**Nederlands** · [English](README.en.md) · [Français](README.fr.md)

# Toewijzingsfilters voor Windows

Eén `deviceAndAppManagementAssignmentFilter`-body. Een filter verfijnt een toewijzing aan een
groep: *alle apparaten, maar niet de AVD-sessiehosts*. Hier maakt het het onderscheid tussen
fysieke toestellen en de Azure Virtual Desktop-sessiehosts met Windows 11 Enterprise
multi-session.

| Bestand | Regel | Gebruik |
|---|---|---|
| `WIN-AVD-Multi-Session.json` | `device.operatingSystemSKU -eq "ServerRdsh"` | **include** op de vier AVD-policies (`[Baseline] - WIN - D - AVD …`); **exclude** op de policies die niet op AVD horen |

`ServerRdsh` is de SKU van Windows Enterprise multi-session. In de testtenant getest: het filter
matcht precies de AVD-sessiehost en geen enkele fysieke pc. Windows 365 Cloud PC's draaien
Windows Enterprise (single-session) en vallen er dus niet onder.

Welke policy include, exclude of geen van beide krijgt, staat per policy in
[docs/AVD.md](../../../docs/AVD.md). Het filter werkt ook op gebruikersgerichte toewijzingen,
zoals `[Baseline] - WIN - U - Windows Hello for Business`: Intune toetst het filter op het
apparaat waar de gebruiker zich aanmeldt. Een uitsluiting van een apparaatgroep doet daar
niets, want de toewijzing gaat naar gebruikers.

Filters met `platform: windows10AndLater` zijn alleen te kiezen op Windows-policies.

## Uitrollen

```http
POST https://graph.microsoft.com/beta/deviceManagement/assignmentFilters
Content-Type: application/json

<inhoud van het bestand>
```

Of in de portal: Tenantbeheer → Filters → Maken → Beheerde apparaten → Windows 10 en later, en
de regel uit de tabel plakken. Een filter doet niets tot hij bij een toewijzing wordt gekozen.
