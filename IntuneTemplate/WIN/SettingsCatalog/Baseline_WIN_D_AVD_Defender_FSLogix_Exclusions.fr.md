<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_AVD_Defender_FSLogix_Exclusions.md) · [English](Baseline_WIN_D_AVD_Defender_FSLogix_Exclusions.en.md) · **Français**

# [Baseline] - WIN - D - AVD Defender FSLogix Exclusions

Exclut de l'analyse Defender, sur les hôtes de session AVD, les conteneurs FSLogix sur le partage, les fichiers VHD(X) temporaires, les dossiers et pilotes FSLogix et les deux services FSLogix, comme Microsoft le prescrit pour FSLogix.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | Microsoft Learn — Prerequisites for FSLogix, Configure Antivirus file and folder exclusions (consulté le 9 octobre 2026) |
| Fichier | [`Baseline_WIN_D_AVD_Defender_FSLogix_Exclusions.json`](Baseline_WIN_D_AVD_Defender_FSLogix_Exclusions.json) |

> Renseignez le nom UNC du compte de stockage (OPSLAGACCOUNT-INVULLEN), le même que dans [Baseline] - WIN - D - AVD FSLogix Profile Containers. Absents de la liste de Microsoft : les clés de registre HKLM\SOFTWARE\FSLogix et HKLM\SOFTWARE\Policies\FSLogix (Defender n'a pas d'exclusions de registre ; cette ligne vise d'autres logiciels de sécurité et de DLP) et les points de montage des conteneurs (pas de chemin fixe). C:\Users\%username%\AppData\Local\FSLogix figure comme C:\Users\*\AppData\Local\FSLogix, car Defender ne connaît pas les variables utilisateur. Defender résout %TEMP% dans le contexte système ; la ligne figure quand même, comme Microsoft la cite. Comme exclusions de processus, Microsoft ne cite que frxsvc.exe et frxccds.exe ; frxccd.exe et frxrobocopy.exe relèvent de l'exclusion du dossier %ProgramFiles%\FSLogix\Apps. Aucune autre stratégie de la baseline ne définit excludedpaths ni excludedprocesses, il n'y a donc pas de conflit. Si des exclusions pour tous les appareils sont ajoutées plus tard, une deuxième stratégie Settings Catalog définit le même paramètre avec une autre liste : c'est un Conflit. [Baseline] - WIN - D - Defender Additional Configuration masque les exclusions aux administrateurs locaux.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Protection contre les programmes malveillants<br>A.8.9 Gestion de la configuration |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 10.6 Centrally Manage Anti-Malware Software |
| NIST CSF 2.0 | DE.CM-09<br>PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 2

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_defender_excludedpaths` | %TEMP%\*\*.VHD, %TEMP%\*\*.VHDX, %Windir%\TEMP\*\*.VHD, %Windir%\TEMP\*\*.VHDX, %ProgramData%\FSLogix\Cache\*, %ProgramData%\FSLogix\Proxy\*, %ProgramFiles%\FSLogix\Apps, %ProgramData%\FSLogix, C:\Users\*\AppData\Local\FSLogix, %ProgramFiles%\FSLogix\Apps\frxdrv.sys, %ProgramFiles%\FSLogix\Apps\frxdrvvt.sys, %ProgramFiles%\FSLogix\Apps\frxccd.sys, \\OPSLAGACCOUNT-INVULLEN.file.core.windows.net\profiles\*\*.VHD, \\OPSLAGACCOUNT-INVULLEN.file.core.windows.net\profiles\*\*.VHD.lock, \\OPSLAGACCOUNT-INVULLEN.file.core.windows.net\profiles\*\*.VHD.meta, \\OPSLAGACCOUNT-INVULLEN.file.core.windows.net\profiles\*\*.VHD.metadata, \\OPSLAGACCOUNT-INVULLEN.file.core.windows.net\profiles\*\*.VHDX, \\OPSLAGACCOUNT-INVULLEN.file.core.windows.net\profiles\*\*.VHDX.lock, \\OPSLAGACCOUNT-INVULLEN.file.core.windows.net\profiles\*\*.VHDX.meta, \\OPSLAGACCOUNT-INVULLEN.file.core.windows.net\profiles\*\*.VHDX.metadata |
| `device_vendor_msft_policy_config_defender_excludedprocesses` | %ProgramFiles%\FSLogix\Apps\frxsvc.exe, %ProgramFiles%\FSLogix\Apps\frxccds.exe |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
