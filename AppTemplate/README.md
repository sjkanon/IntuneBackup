**Nederlands** · [English](README.en.md) · [Français](README.fr.md)

# AppTemplate/

CIPP-**applicatietemplates**: Win32-apps die CIPP zelf in een tenant zet, zonder dat iemand een
`.intunewin` hoeft te uploaden.

| Bestand | App | Bron |
|---|---|---|
| [`Winget-AutoUpdate.json`](Winget-AutoUpdate.json) | `[Baseline] - WIN - D - Winget-AutoUpdate` | [`IntuneTemplate/WIN/Apps/winget-autoupdate/`](../IntuneTemplate/WIN/Apps/winget-autoupdate/README.md) |
| [`Winget-AutoUpdate-AllDevices.json`](Winget-AutoUpdate-AllDevices.json) | dezelfde app, toegewezen aan alle apparaten — voor de baseline [`Windows-Updates.json`](../BaselineTemplate/README.md#windows-updatesjson--patchen) | idem |

## Hoe het werkt

CIPP kan geen eigen installatiepakket templaten, wel een *Custom Application* (Win32-script-app):
CIPP uploadt een eigen klein placeholderpakket en draait een PowerShell-script als
installatieprogramma. Het installscript haalt de installer dus zelf op — vastgepind en met
hashcontrole. Het template bevat alleen scripts.

Elk bestand is een CIPP-tabelrij (`PartitionKey: AppTemplate`) en wordt gegenereerd door
[`scripts/generate-app-templates.js`](../scripts/generate-app-templates.js) uit de scripts in
[`IntuneTemplate/WIN/Apps/`](../IntuneTemplate/WIN/Apps/winget-autoupdate/README.md). Wijzigen doe je daar, niet hier.

## Uitrollen

1. CIPP → **Tools → Community Repos** → deze repo → het bestand → **Import**.
2. **Applications → Application Templates** → het template → **Deploy**, met tenants en
   toewijzing. Of in een baseline met de standard *Deploy Intune Application Template*.

De templates wijzen zelf niets toe: de toewijzing kies je bij het uitrollen, omdat een app in
fase 2 eerst naar de pilotgroep gaat.
