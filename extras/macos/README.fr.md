[Nederlands](README.md) · [English](README.en.md) · **Français**

# extras/macos/

Éléments de la baseline macOS qui ne sont aucun des cinq types de stratégies CIPP (Catalog, Device,
deviceCompliancePolicies, AppProtection, Admin). `check-scope.js` et
`Set-BaselineAssignment.ps1` ne font rien avec ce dossier ; `export-intunebackup.js` copie seulement
`enrollment/` et `shell-scripts/` dans l'export de restauration, comme sidecar.

| Dossier | Quoi | Comment déployer |
|---|---|---|
| [`enrollment/`](enrollment/README.fr.md) | profil d'inscription ADE (`depMacOSEnrollmentProfile`) avec inscription verrouillée et un compte administrateur local géré | `scripts/New-MacOSEnrollmentPolicy.ps1` sous le token ABM ; sidecar dans l'export |
| [`shell-scripts/`](shell-scripts/README.fr.md) | scripts shell : Dock, montage Azure Files, rappel pour l'enregistrement d'écran, et [Escrow Buddy](shell-scripts/README.fr.md#escrow-buddysh) pour la clé de récupération FileVault des Mac déjà chiffrés | Devices → macOS → Shell scripts ; sidecar dans l'export |
| [`compliance-scripts/`](compliance-scripts/README.fr.md) | contrôle de conformité personnalisé : Defender for Endpoint tourne-t-il et est-il en bonne santé | Devices → Compliance → Scripts, puis une stratégie de conformité |
| [`enrollment-restriction/`](enrollment-restriction/README.fr.md) | conseil + corps Graph : ne pas laisser les Mac personnels s'inscrire | Device platform restriction, via le portail ou Graph |
| [`defender-onboarding/`](defender-onboarding/README.fr.md) | pourquoi Defender for Endpoint sur macOS ne peut pas être intégré de façon générique, et la route par tenant | manuellement par tenant (profil personnalisé avec le package d'intégration) |
| [`apple-business/`](apple-business/README.fr.md) | checklist Apple Business : administrateurs, Managed Apple Accounts et fédération, serveur MDM, jetons annuels | manuellement dans Apple Business et Intune |
