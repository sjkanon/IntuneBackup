[Nederlands](README.md) · [English](README.en.md) · **Français**

# extras/windows

Composants de la baseline Windows qui ne relèvent d'aucun des cinq types CIPP (`Catalog`, `Device`,
`deviceCompliancePolicies`, `AppProtection`, `Admin`) et ne sont donc pas déployés via `IntuneTemplate/` et le
pipeline. `check-scope.js`, `export-intunebackup.js` et `Set-BaselineAssignment.ps1`
ne font rien avec ce dossier. Chaque dossier a son propre README avec les instructions de déploiement, la phase et les mesures
auxquelles il contribue.

| Dossier | Quoi | Pourquoi pas dans IntuneTemplate/ | Phase |
|---|---|---|---:|
| [`app-control/`](app-control/README.fr.md) | App Control for Business (WDAC) avec les contrôles intégrés — variante audit, variante application, managed installer, KQL | Template Endpoint security ; le `settingInstanceTemplateId` ne peut pas être vérifié par rapport à `pl4nty/intune-change-tracking` et doit être obtenu via Graph pour chaque tenant | 2 (audit) / 4 (application) |
| [`remediations/dns-over-https/`](remediations/dns-over-https/README.fr.md) | DoH pour Windows lui-même : autoriser (phase 2) ou exiger (phase 5), en tant que remédiation | Le paramètre DoH de Windows (`DoHPolicy`) n'existe pas dans le settings catalog ; seule la variante Edge existe — celle-ci figure bien comme template | 2 / 5 |
| [`remediations/escrow-check/`](remediations/escrow-check/README.fr.md) | Vérifie que la clé de récupération BitLocker et le mot de passe LAPS se trouvent réellement dans Entra ID, et répare l'escrow BitLocker | Scripts de remédiation (Intune → Scripts and remediations), pas une stratégie | 1 (détection seule) / 2 |
| [`remediations/event-log-sizes/`](remediations/event-log-sizes/README.fr.md) | Agrandit les journaux PowerShell/Operational, Defender/Operational et CodeIntegrity/Operational | Ces canaux n'ont pas de CSP pour la taille maximale | 2 |
| [`remediations/firefox-policies/`](remediations/firefox-policies/README.fr.md) | Équivalent Firefox des templates Google Chrome : mises à jour, Safe Browsing et erreurs de certificat impossibles à contourner, DoH et QUIC désactivés, ni gestionnaire de mots de passe ni compte Mozilla ; blocage des extensions facultatif | Firefox n'est pas dans le catalogue de paramètres ; un import ADMX est propre à chaque tenant. Firefox lit lui-même `HKLMSOFTWAREPoliciesMozillaFirefox` | 2 |
| [`platform-scripts/`](platform-scripts/README.fr.md) | Connecte un partage Azure Files comme lettre de lecteur avec le ticket Entra Kerberos | Un mappage de lecteur n'est pas une stratégie ; les scripts de plateforme n'ont pas de `TemplateType` CIPP | attend un compte de stockage avec Entra Kerberos |
| [`win32-apps/remove-mcafee/`](win32-apps/remove-mcafee/README.fr.md) | Supprime le McAfee préinstallé, qui met Defender en mode passif | Une application Win32 n'est pas une stratégie | avant les stratégies Defender |
| [`win32-apps/winget-autoupdate/`](win32-apps/winget-autoupdate/README.fr.md) | Met à jour chaque jour toute application connue de winget (7-Zip, Adobe Reader, Zoom …), en tant que SYSTEM et en contexte utilisateur ; navigateurs, Office, Teams et OneDrive exclus | Une application Win32 n'est pas une stratégie ; une stratégie peut configurer winget, pas l'exécuter | 2 |

Tous les scripts sont génériques : pas d'id de tenant, pas de groupes, pas de domaines. Là où un élément dépend de
l'organisation, un placeholder en MAJUSCULES se terminant par `-INVULLEN` est prévu.
