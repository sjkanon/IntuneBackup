[Nederlands](README.md) · **English** · [Français](README.fr.md)

# extras/macos/escrow-buddy/

Getting the FileVault recovery key into Intune after all for a Mac that was already encrypted.

Lives outside `IntuneTemplate/` for the same reason as [`shellscripts/macos/`](../../../shellscripts/macos/README.en.md):
a shell script (`deviceShellScripts`) is none of the five CIPP policy types. Not picked up
by `generate-baseline.js`, `export-intunebackup.js`, `check-scope.js` or
`Set-BaselineAssignment.ps1`, and gets no `checkId`. Belongs in
`shellscripts/macos/` when merged.

| File | What it does | Scope |
|---|---|---|
| `escrow-buddy.sh` | installs Escrow Buddy (pinned version, signature checked) and requests a new recovery key once | Device |

## The gap

[`MAC - D - FileVault`](../../../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_FileVault.en.md)
stores the recovery key in Intune, but macOS only escrows a key that is
**created** while the escrow profile (`com.apple.security.FDERecoveryKeyEscrow`) is on the Mac.
Three situations therefore fall through the cracks:

- the user had already turned on FileVault themselves before the Mac was enrolled;
- a Mac was enrolled via Company Portal after it was already encrypted;
- the profile only arrived after Setup Assistant had already encrypted the disk.

Intune then shows no recovery key for the device, and the rotation from the FileVault policy
(`recoverykeyrotationinmonths`) only works on a key that Intune already knows. A forgotten
password in that situation means a lost disk.

## How it works

[Escrow Buddy](https://github.com/macadmins/escrow-buddy) (Apache 2.0, Mac Admins Open Source,
originally Netflix) is an authorization plugin. The package places the mechanism
`Escrow Buddy:Invoke,privileged` in `system.login.console`, just before `loginwindow:done`. If
`GenerateNewKey` in `/Library/Preferences/com.netflix.Escrow-Buddy.plist` is true, the
plugin uses the typed password at the next sign-in of a FileVault user to create
a new personal recovery key. macOS sends it to Intune via the escrow profile.
The user notices nothing; no dialog appears.

The script:

1. stops if FileVault is off (then the FileVault policy handles both encryption and escrow);
2. stops if it has already requested a key before (marker in
   `/Library/Application Support/Baseline/escrow-buddy-requested`);
3. waits if the escrow profile is not there yet — a new key without escrow makes things
   worse, because the old personal key is then gone as well;
4. downloads Escrow Buddy **1.0.0** from the GitHub release and installs only if the package
   is notarised by Apple (`spctl --assess --type install`) and signed with
   *Developer ID Installer* from team **T4SK8ZXCXG** (Mac Admins Open Source — the identity from
   the project's `.github/workflows/build_main.yml`). A different signer: do not
   install, signature in the log;
5. checks that the mechanism is really in the authorization database;
6. sets `GenerateNewKey`.

Log: `/Library/Logs/Baseline/escrow-buddy.log`.

It does no harm if the script also runs on a Mac whose key Intune did already have:
the key is then replaced once and escrowed again, exactly what the rotation in the
FileVault policy does too. That is why there is no attempt to guess from the Mac whether Intune has a
key — the Mac cannot see that.

## Settings in Intune

Devices → macOS → Shell scripts → Add.

| Setting | Value | Why |
|---|---|---|
| Run script as signed-in user | **No** | installing and changing `authorizationdb` requires root |
| Hide script notifications | Yes | |
| Script frequency | **Every 1 day** | the script waits for the escrow profile; after the marker it does nothing more |
| Max number of retries | 3 | |

Assign to the same **device group** as `MAC - D - FileVault`, and only after that policy is on the
Mac. Phase: same as FileVault (pilot first).

## Verifying

- On the Mac, after signing in: `sudo profiles show -type configuration | grep -i escrow` shows the
  profile, and the log ends with "GenerateNewKey set". After the next sign-in,
  `GenerateNewKey` is false again (`defaults read /Library/Preferences/com.netflix.Escrow-Buddy.plist`).
- In Intune: Devices → the device → **Recovery keys** shows a key.

## New version

Update `EB_VERSION`, and before deploying, check on one Mac that
`pkgutil --check-signature` still shows `Developer ID Installer: Mac Admins Open Source (T4SK8ZXCXG)`.
If the signer changes, the script deliberately stops — only change `EB_TEAM_ID` after
checking with the project.

**Open item:** release 1.0.0 dates from June 2023; the signature of that release has not been
verified on a Mac from this workstation. The script fails safe if the team id does not match;
check that in the log on the first pilot Mac.

## Removing

```bash
sudo "/Library/Security/SecurityAgentPlugins/Escrow Buddy.bundle/Contents/Resources/AuthDBTeardown.sh"
sudo rm -rf "/Library/Security/SecurityAgentPlugins/Escrow Buddy.bundle"
sudo pkgutil --forget com.netflix.Escrow-Buddy
```

That is what the project's `scripts/uninstall.sh` does too. Do not leave the plugin on a Mac
that is leaving management: a mechanism in `system.login.console` whose bundle is missing
blocks sign-in.

## Line endings

LF, like all `*.sh` in this repo (`.gitattributes`).
