[Nederlands](README.md) · [English](README.en.md) · **Français**

# extras/

Ce qui fait partie d'une baseline complète mais ne relève d'aucun des cinq types de stratégies CIPP (`Catalog`,
`Admin`, `Device`, `deviceCompliancePolicies`, `AppProtection`). Rien ici n'est pris en compte par
`check-scope.js`, `export-intunebackup.js` ou `Set-BaselineAssignment.ps1`. Chaque dossier a son propre README avec la voie de déploiement, les prérequis
et les normes que le composant couvre.

Même logique que [`enrollment/macos/`](../enrollment/macos/README.fr.md),
[`compliance/macos/`](../compliance/macos/README.fr.md), [`shellscripts/macos/`](../shellscripts/macos/README.fr.md)
et [`platformscripts/windows/`](../platformscripts/windows/README.fr.md), qui se trouvaient déjà en dehors
de `IntuneTemplate/`.

| Dossier | Contenu |
|---|---|
| [`android/`](android/README.fr.md) | restriction d'inscription (Android Enterprise, profil professionnel personnel), configuration d'applications pour Outlook, Edge et l'onboarding low-touch de Defender, filtres d'affectation pour personnel, corporate et dedicated |
| [`ios/`](ios/README.fr.md) | paramètres Apple Business et groupes dynamiques, profil d'inscription ADE (`depIOSEnrollmentProfile`), configuration d'applications pour Outlook, Edge et Defender |
| [`macos/`](macos/README.fr.md) | checklist Apple Business, onboarding Defender for Endpoint par tenant, restriction d'inscription pour les Mac personnels, Escrow Buddy pour l'escrow FileVault des Mac déjà chiffrés |
| [`windows/`](windows/README.fr.md) | App Control for Business (audit et application, avec un script pour les ids de template du tenant et des requêtes de hunting), DNS over HTTPS pour Windows lui-même, tailles des journaux, remédiations qui vérifient l'escrow BitLocker et LAPS |

**Placeholders.** Tout ce qui diffère d'une organisation à l'autre figure sous la forme `…-INVULLEN` (ids d'application, jeton VPP,
résolveur, numéro du service desk). Renseignez-les dans une copie hors de git — voir `local/` dans `.gitignore` —
et jamais dans ce dépôt.

**CIPP.** CIPP récupère chaque fichier `.json` du dépôt. Les corps Graph ici n'ont pas de
`Displayname` et deviennent donc une ligne de template sans nom, comme les autres fichiers qui ne sont pas des stratégies
(voir le README principal) ; elle ne fait rien et peut être supprimée dans CIPP.
