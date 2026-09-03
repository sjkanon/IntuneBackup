# macOS Shell Scripts

**Gegenereerd** uit `shellscripts/` — niet met de hand bijwerken.

`Start-IntuneRestoreConfig` slaat deze map over: `deviceShellScripts` heeft geen
restore-functie in de module en geen `TemplateType` in CIPP. Deze scripts reizen mee
omdat ze bij een herinrichting anders vergeten worden.

Aanmaken gaat met de hand: **Devices → macOS → Shell scripts → Add**. De instellingen
per script (uitvoeren als aangemelde gebruiker, frequentie, toewijzing) staan in
`shellscripts/macos/README.md` in de repo — die waarden zijn geen detail: een dockscript
dat als root draait schrijft naar de verkeerde Dock en de gebruiker ziet niets.
