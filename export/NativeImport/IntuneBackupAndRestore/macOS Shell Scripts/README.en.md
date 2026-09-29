[Nederlands](README.md) · **English** · [Français](README.fr.md)

# macOS Shell Scripts

**Generated** from `shellscripts/` — do not edit by hand.

`Start-IntuneRestoreConfig` skips this folder: `deviceShellScripts` has no restore
function in the module and no `TemplateType` in CIPP. These scripts travel along
because they would otherwise be forgotten in a rebuild.

Creating them is manual: **Devices → macOS → Shell scripts → Add**. The settings
per script (run as signed-in user, frequency, assignment) are in
`shellscripts/macos/README.en.md` in the repo — those values are not a detail: a Dock script
that runs as root writes to the wrong Dock and the user sees nothing.
