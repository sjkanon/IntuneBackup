# Toewijzingsfilters voor Android Enterprise

Drie `deviceAndAppManagementAssignmentFilter`-bodies. Een filter verfijnt een toewijzing aan een
groep: *alle gebruikers, maar alleen op corporate toestellen*. Ze zijn niet verplicht — het
Graph-type van de policy doet het meeste werk al (een `androidDeviceOwnerCompliancePolicy`
raakt nooit een persoonlijk werkprofiel) — maar ze zijn nodig op drie plekken:

| Bestand | Regel | Gebruik |
|---|---|---|
| `AND-Personal-Work-Profile.json` | `device.deviceOwnership -eq "Personal"` | optioneel: werkprofielpolicies alleen op persoonlijke toestellen |
| `AND-Corporate.json` | `device.deviceOwnership -eq "Corporate"` | `[Baseline] - AND - D - System Updates` toewijzen aan *alle apparaten* met dit filter |
| `AND-Dedicated.json` | `device.enrollmentProfileName -eq "DEDICATED-INSCHRIJFPROFIEL-INVULLEN"` | `[Baseline] - AND - D - Compliance Dedicated Device Health`, als je geen aparte apparaatgroep maakt |

Voor het dedicated filter: vul de naam van het dedicated inschrijfprofiel in. Zijn er meerdere
(kiosk en gedeeld), voeg ze samen met `-or`, bijvoorbeeld
`(device.enrollmentProfileName -eq "PROFIEL-1-INVULLEN") -or (device.enrollmentProfileName -eq "PROFIEL-2-INVULLEN")`.

Filters met `platform: androidForWork` gelden voor alle Android Enterprise-vormen; op een
policy van een ander platform zijn ze niet te kiezen.

## Uitrollen

```http
POST https://graph.microsoft.com/beta/deviceManagement/assignmentFilters
Content-Type: application/json

<inhoud van het bestand>
```

Of in de portal: Tenantbeheer → Filters → Maken → Beheerde apparaten → Android Enterprise, en
de regel uit de tabel plakken. Een filter doet niets tot hij bij een toewijzing wordt gekozen.
