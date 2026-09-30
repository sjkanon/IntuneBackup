[Nederlands](README.md) · [English](README.en.md) · **Français**

# extras/

Ce qui fait partie d'une baseline complète mais ne relève d'aucun des cinq types de stratégies CIPP (`Catalog`,
`Admin`, `Device`, `deviceCompliancePolicies`, `AppProtection`), dans un dossier par plateforme.
Chaque sous-dossier a un README avec la voie de déploiement, les prérequis et les normes que le
composant couvre.

**Pipeline.** `check-scope.js` et `Set-BaselineAssignment.ps1` ne font rien avec `extras/`. Deux
dossiers entrent bien dans l'export de restauration, comme sidecar : `export-intunebackup.js` copie les
profils ADE macOS de [`macos/enrollment/`](macos/enrollment/README.fr.md) et les
scripts shell macOS de [`macos/shell-scripts/`](macos/shell-scripts/README.fr.md) vers
`export/NativeImport/`, car une reconstruction à partir de cet export les oublierait sinon. Le module
IntuneBackupAndRestore ne les restaure pas ; le README à côté de la copie explique comment faire.

| Plateforme | Sous-dossier | Contenu |
|---|---|---|
| [`android/`](android/README.fr.md) | [`enrollment-restriction/`](android/enrollment-restriction/README.fr.md) | restriction d'inscription : autoriser Android Enterprise, bloquer device administrator |
| | [`app-configuration/`](android/app-configuration/README.fr.md) | configuration d'applications pour Outlook, Edge et l'onboarding low-touch de Defender |
| | [`assignment-filters/`](android/assignment-filters/README.fr.md) | filtres d'affectation pour personnel, corporate et dedicated |
| [`ios/`](ios/README.fr.md) | [`enrollment/`](ios/enrollment/README.fr.md) | profil d'inscription ADE (`depIOSEnrollmentProfile`) ; les paramètres Apple Business et les groupes dynamiques figurent dans le README de la plateforme |
| | [`app-configuration/`](ios/app-configuration/README.fr.md) | configuration d'applications pour Outlook, Edge et Defender |
| [`macos/`](macos/README.fr.md) | [`enrollment/`](macos/enrollment/README.fr.md) | profil d'inscription ADE (`depMacOSEnrollmentProfile`) — sidecar dans l'export |
| | [`enrollment-restriction/`](macos/enrollment-restriction/README.fr.md) | restriction d'inscription pour les Mac personnels |
| | [`shell-scripts/`](macos/shell-scripts/README.fr.md) | Dock, montage Azure Files, rappel pour l'enregistrement d'écran, Escrow Buddy pour l'escrow FileVault des Mac déjà chiffrés — sidecar dans l'export |
| | [`compliance-scripts/`](macos/compliance-scripts/README.fr.md) | contrôle de conformité personnalisé pour Defender for Endpoint |
| | [`defender-onboarding/`](macos/defender-onboarding/README.fr.md) | onboarding Defender for Endpoint par tenant |
| | [`apple-business/`](macos/apple-business/README.fr.md) | checklist Apple Business |
| [`windows/`](windows/README.fr.md) | [`app-control/`](windows/app-control/README.fr.md) | App Control for Business (audit et application, avec un script pour les ids de template du tenant et des requêtes de hunting) |
| | [`remediations/`](windows/README.fr.md) | DNS over HTTPS pour Windows lui-même, tailles des journaux, contrôle de l'escrow BitLocker et LAPS |
| | [`platform-scripts/`](windows/platform-scripts/README.fr.md) | connexion d'un lecteur Azure Files |
| | [`win32-apps/`](windows/win32-apps/remove-mcafee/README.fr.md) | application Win32 qui supprime le McAfee préinstallé |

**Placeholders.** Tout ce qui diffère d'une organisation à l'autre figure sous la forme `…-INVULLEN` (ids d'application, jeton VPP,
résolveur, numéro du service desk). Renseignez-les dans une copie hors de git — voir `local/` dans `.gitignore` —
et jamais dans ce dépôt.

**CIPP.** CIPP récupère chaque fichier `.json` du dépôt. Les corps Graph ici n'ont pas de
`Displayname` et deviennent donc une ligne de template sans nom, comme les autres fichiers qui ne sont pas des stratégies
(voir le [README principal](../README.fr.md#restaurer-dans-un-tenant)) ; elle ne fait rien et peut être supprimée dans CIPP.
