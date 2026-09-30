[Nederlands](README.md) · [English](README.en.md) · **Français**

# Apple ADE Enrollment Profiles

**Généré** à partir de `extras/macos/enrollment/` — ne pas modifier à la main.

`Start-IntuneRestoreConfig` ignore ce dossier : IntuneBackupAndRestore n'a pas de fonction
de restauration pour les profils d'inscription Apple ADE, et CIPP ne les connaît pas non plus.
Ils voyagent ici parce qu'un tenant reconstruit à partir de cet export en a besoin — un Mac
qui se synchronise depuis Apple Business sans profil d'inscription échoue à l'inscription.

La restauration se fait profil par profil, avec le jeton ABM :

```powershell
.\scripts\New-MacOSEnrollmentPolicy.ps1 -TokenName <TOKEN> -Path '.\Apple ADE Enrollment Profiles\macos\macOS-Corporate-ADE-Baseline.json' -WhatIf
```

Retirez `-WhatIf` quand tout est correct. L'affectation reste un travail manuel dans le portail
(Enrollment program tokens → token → Devices), et c'est voulu : un profil sur les mauvais
numéros de série donne des Mac qu'on ne peut pas rétablir sans effacement.

Voir `extras/macos/enrollment/README.fr.md` dans le dépôt pour le contenu du profil et sa raison d'être.
