[Nederlands](README.md) · **English** · [Français](README.fr.md)

# Office op het web

A Win32 app for shared devices without Office: a double-click on a Word, Excel or PowerPoint
file in a synced OneDrive or SharePoint folder opens the file in Office for the web, in Edge.

A Win32 app is not a policy and not one of the five CIPP policy types. CIPP, `check-scope.js`,
`export-intunebackup.js` and `Set-BaselineAssignment.ps1` do nothing with this folder; you package
the app and upload it by hand. The policy that makes it the default is in the baseline:
`[Baseline] - WIN - D - Shared Devices Office Web File Associations`.

## Why this is needed

Windows cannot associate a file type with a web app. Without Word on the device, Windows asks at
every double-click on a `.docx` which app to open it with. What does work is right-clicking the
file in Explorer and choosing *View online*: OneDrive then opens it in Word for the web. This app
does exactly that on a double-click.

The menu item has a different name in every language. The script takes the names from OneDrive
itself: `FileSync.LocalizedResources.dll` has a translation per language (94 languages in
OneDrive 26.x). The list is built once per OneDrive version and kept, so a OneDrive update just
works. Because OneDrive itself opens the file, it also works for shortcuts to other libraries
(*Add shortcut to My files*).

If a file is not in a synced folder (Downloads, a USB stick), the user gets a message in Dutch,
French, German or English: put it in OneDrive first.

The idea comes from [M365-Bridge](https://github.com/Fireant456/M365-Bridge). That looks for the
menu item by its English name and therefore does not work on a Dutch or French Windows.

| File | What it is |
|---|---|
| [`Open-OfficeWeb.ps1`](Open-OfficeWeb.ps1) | runs on the double-click, as the user: finds *View online* in the file's menu and runs it |
| [`Install-OfficeWeb.ps1`](Install-OfficeWeb.ps1) | puts the script in `%ProgramFiles%\OfficeWebOpen`, registers the ProgIds `OfficeWeb.Word`, `OfficeWeb.Excel` and `OfficeWeb.PowerPoint` and builds the name list in advance |
| [`Detect-OfficeWeb.ps1`](Detect-OfficeWeb.ps1) | detection rule: version, script and association present |
| [`Uninstall-OfficeWeb.ps1`](Uninstall-OfficeWeb.ps1) | removes everything again |

File types: `.docx`, `.docm`, `.doc`, `.dotx`, `.xlsx`, `.xlsm`, `.xlsb`, `.xls`, `.pptx`,
`.pptm`, `.ppt`, `.ppsx`. Office for the web opens the older formats read-only or after
converting; the user gets that choice there.

## Packaging and deployment

```powershell
IntuneWinAppUtil.exe -c .\IntuneTemplate\WIN\Apps\office-web-open -s Install-OfficeWeb.ps1 -o .\output
```

In Intune → Apps → Windows → Win32 app:

| Field | Value |
|---|---|
| Install command | `powershell.exe -ExecutionPolicy Bypass -File Install-OfficeWeb.ps1` |
| Uninstall command | `powershell.exe -ExecutionPolicy Bypass -File Uninstall-OfficeWeb.ps1` |
| Install behavior | System |
| Device restart behavior | No specific action |
| Detection rule | Custom script → `Detect-OfficeWeb.ps1` |
| Assignment | Required on `SG-D-UEM-WIN-Shared` |

Also assign `[Baseline] - WIN - D - Shared Devices Office Web File Associations` to the same
group. It makes the app the default at every sign-in: an installer may not do that, Windows
protects the default app per user. If you assign the policy without the app, the associations
point to a ProgId that does not exist and Windows ignores them.

If you change a script, raise `$Version` in `Install-OfficeWeb.ps1` and in `Detect-OfficeWeb.ps1`.
Otherwise Intune sees the old version as installed.

## How to tell it worked

- Double-click a `.docx` in the OneDrive folder in Explorer: a tab with Word for the web opens.
  The first file of a new profile takes a few seconds.
- *Settings → Apps → Default apps* shows *Office op het web* for `.docx`.
- Logs: `C:\Windows\Logs\Baseline\office-web-open.log` (installation) and
  `%LOCALAPPDATA%\OfficeWebOpen\open.log` (per user, every time a file opens).
- Without opening anything: `& "$env:ProgramFiles\OfficeWebOpen\Open-OfficeWeb.ps1" <file> -WhatIf`
  shows which menu item the script would run.

## Limits

- Only works for files in a synced OneDrive or SharePoint folder; OneDrive has to be running.
  `[Baseline] - WIN - D - Shared Devices OneDrive` takes care of that and, for a fixed team folder,
  `[Baseline] - WIN - D - Shared Devices SharePoint Team Sites`.
- The file opens in the default browser; on Windows 11 that is Edge.
- Tested: the name list (140 variants in 94 languages) and opening a synced file on a device with
  OneDrive 26.198. The installer and the association policy have not been tested on a shared
  device yet.
