[Nederlands](README.md) · [English](README.en.md) · **Français**

# extras/android/

Ce qui fait partie d'une baseline Android complète mais ne relève d'aucun des cinq types de stratégies CIPP. Ces
fichiers se trouvent donc **en dehors** de `IntuneTemplate/`, comme `enrollment/macos/` et
`compliance/macos/` : `generate-baseline.js`, `export-intunebackup.js` et
`Set-BaselineAssignment.ps1` ne les prennent pas en compte, et aucun `checkId` n'y est associé.

| Dossier | Quoi | Ressource Graph |
|---|---|---|
| [`enrollment-restrictions/`](enrollment-restrictions/README.fr.md) | Autoriser Android Enterprise, bloquer device administrator | `deviceManagement/deviceEnrollmentConfigurations` |
| [`app-configuration/`](app-configuration/README.fr.md) | Outlook, Edge et Defender sur les appareils inscrits | `deviceAppManagement/mobileAppConfigurations` |
| [`assignment-filters/`](assignment-filters/README.fr.md) | Séparer personnel, corporate et dedicated | `deviceManagement/assignmentFilters` |

Tout le JSON est un corps Graph (beta) sans ids de tenant. Ce qui diffère d'un tenant à l'autre figure sous forme de
placeholder en MAJUSCULES se terminant par `-INVULLEN` ; recherchez-le avant de déployer quoi que ce soit.

L'ordre pour une première inscription Android :

1. Connecter Managed Google Play (Intune → Appareils → Android → Android Enterprise) et approuver Outlook,
   Edge, Teams, Authenticator et — avec une licence Defender — Microsoft Defender.
2. Restrictions d'inscription (ce dossier).
3. Configuration d'applications (ce dossier), une fois que les applications de l'étape 1 sont dans Intune.
4. Affecter les stratégies de phase 3 de `IntuneTemplate/AND/`.
