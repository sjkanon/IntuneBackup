[Nederlands](README.md) · [English](README.en.md) · **Français**

# extras/macos/

Éléments de la baseline macOS qui ne sont aucun des cinq types de stratégies CIPP (Catalog, Device,
deviceCompliancePolicies, AppProtection, Admin). Les pipelines (`generate-baseline.js`,
`export-intunebackup.js`, `check-scope.js`, `Set-BaselineAssignment.ps1`) ne prennent pas ce dossier en compte
et aucun `checkId` n'y est associé — tout comme `enrollment/macos/`, `shellscripts/macos/` et
`compliance/macos/`.

| Dossier | Quoi | Comment déployer |
|---|---|---|
| [`escrow-buddy/`](escrow-buddy/README.fr.md) | script shell : faire tout de même arriver la clé de récupération FileVault dans Intune pour les Mac déjà chiffrés | Devices → macOS → Shell scripts ; à intégrer dans `shellscripts/macos/` lors de la fusion |
| [`enrollment-restriction/`](enrollment-restriction/README.fr.md) | conseil + corps Graph : ne pas laisser les Mac personnels s'inscrire | Device platform restriction, via le portail ou Graph |
| [`defender-onboarding/`](defender-onboarding/README.fr.md) | pourquoi Defender for Endpoint sur macOS ne peut pas être intégré de façon générique, et la route par tenant | manuellement par tenant (profil personnalisé avec le package d'intégration) |
| [`apple-business/`](apple-business/README.fr.md) | checklist Apple Business : administrateurs, Managed Apple Accounts et fédération, serveur MDM, jetons annuels | manuellement dans Apple Business et Intune |
