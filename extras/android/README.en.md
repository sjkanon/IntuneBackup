[Nederlands](README.md) · **English** · [Français](README.fr.md)

# extras/android/

What belongs in a complete Android baseline but is none of the five CIPP policy types. These
files are therefore **outside** `IntuneTemplate/`, just like `enrollment/macos/` and
`compliance/macos/`: `generate-baseline.js`, `export-intunebackup.js` and
`Set-BaselineAssignment.ps1` do not pick them up, and there is no `checkId` for them.

| Folder | What | Graph resource |
|---|---|---|
| [`enrollment-restrictions/`](enrollment-restrictions/README.en.md) | Allow Android Enterprise, block device administrator | `deviceManagement/deviceEnrollmentConfigurations` |
| [`app-configuration/`](app-configuration/README.en.md) | Outlook, Edge and Defender on enrolled devices | `deviceAppManagement/mobileAppConfigurations` |
| [`assignment-filters/`](assignment-filters/README.en.md) | Keep personal, corporate and dedicated apart | `deviceManagement/assignmentFilters` |

All JSON is a Graph body (beta) without tenant ids. What differs per tenant is shown as a
placeholder in CAPITALS ending in `-INVULLEN`; search for it before you deploy anything.

The order for a first Android enrollment:

1. Connect Managed Google Play (Intune → Devices → Android → Android Enterprise) and approve Outlook,
   Edge, Teams, Authenticator and — with a Defender licence — Microsoft Defender.
2. Enrollment restrictions (this folder).
3. App configuration (this folder), once the apps from step 1 are in Intune.
4. Assign the phase 3 policies from `IntuneTemplate/AND/`.
