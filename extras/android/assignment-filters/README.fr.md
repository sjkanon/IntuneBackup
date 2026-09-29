[Nederlands](README.md) · [English](README.en.md) · **Français**

# Filtres d'affectation pour Android Enterprise

Trois corps `deviceAndAppManagementAssignmentFilter`. Un filtre affine une affectation à un
groupe : *tous les utilisateurs, mais uniquement sur les appareils corporate*. Ils ne sont pas obligatoires — le
type Graph de la stratégie fait déjà l'essentiel du travail (une `androidDeviceOwnerCompliancePolicy`
ne touche jamais un profil professionnel personnel) — mais ils sont nécessaires à trois endroits :

| Fichier | Règle | Utilisation |
|---|---|---|
| `AND-Personal-Work-Profile.json` | `device.deviceOwnership -eq "Personal"` | facultatif : stratégies de profil professionnel uniquement sur les appareils personnels |
| `AND-Corporate.json` | `device.deviceOwnership -eq "Corporate"` | affecter `[Baseline] - AND - D - System Updates` à *tous les appareils* avec ce filtre |
| `AND-Dedicated.json` | `device.enrollmentProfileName -eq "DEDICATED-INSCHRIJFPROFIEL-INVULLEN"` | `[Baseline] - AND - D - Compliance Dedicated Device Health`, si vous ne créez pas de groupe d'appareils distinct |

Pour le filtre dedicated : renseignez le nom du profil d'inscription dedicated. S'il y en a plusieurs
(kiosque et partagé), combinez-les avec `-or`, par exemple
`(device.enrollmentProfileName -eq "PROFIEL-1-INVULLEN") -or (device.enrollmentProfileName -eq "PROFIEL-2-INVULLEN")`.

Les filtres avec `platform: androidForWork` s'appliquent à toutes les formes d'Android Enterprise ; ils ne peuvent pas être
sélectionnés sur une stratégie d'une autre plateforme.

## Déploiement

```http
POST https://graph.microsoft.com/beta/deviceManagement/assignmentFilters
Content-Type: application/json

<contenu du fichier>
```

Ou dans le portail : Administration du locataire → Filtres → Créer → Appareils gérés → Android Enterprise, et
collez la règle du tableau. Un filtre ne fait rien tant qu'il n'est pas sélectionné sur une affectation.
