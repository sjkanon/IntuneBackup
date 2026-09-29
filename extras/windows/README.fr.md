[Nederlands](README.md) · [English](README.en.md) · **Français**

# extras/windows

Composants de la baseline Windows qui ne relèvent d'aucun des cinq types CIPP (`Catalog`, `Device`,
`deviceCompliancePolicies`, `AppProtection`, `Admin`) et ne sont donc pas déployés via `IntuneTemplate/` et le
pipeline. Chaque dossier a son propre README avec les instructions de déploiement, la phase et les mesures
auxquelles il contribue.

| Dossier | Quoi | Pourquoi pas dans IntuneTemplate/ | Phase |
|---|---|---|---:|
| [`app-control/`](app-control/README.fr.md) | App Control for Business (WDAC) avec les contrôles intégrés — variante audit, variante application, managed installer, KQL | Template Endpoint security ; le `settingInstanceTemplateId` ne peut pas être vérifié par rapport à `pl4nty/intune-change-tracking` et doit être obtenu via Graph pour chaque tenant | 2 (audit) / 4 (application) |
| [`dns-over-https/`](dns-over-https/README.fr.md) | DoH pour Windows lui-même : autoriser (phase 2) ou exiger (phase 5), en tant que remédiation | Le paramètre DoH de Windows (`DoHPolicy`) n'existe pas dans le settings catalog ; seule la variante Edge existe — celle-ci figure bien comme template | 2 / 5 |
| [`remediations/escrow-check/`](remediations/escrow-check/README.fr.md) | Vérifie que la clé de récupération BitLocker et le mot de passe LAPS se trouvent réellement dans Entra ID, et répare l'escrow BitLocker | Scripts de remédiation (Intune → Scripts and remediations), pas une stratégie | 1 (détection seule) / 2 |
| [`event-log-sizes/`](event-log-sizes/README.fr.md) | Agrandit les journaux PowerShell/Operational, Defender/Operational et CodeIntegrity/Operational | Ces canaux n'ont pas de CSP pour la taille maximale | 2 |

Tous les scripts sont génériques : pas d'id de tenant, pas de groupes, pas de domaines. Là où un élément dépend de
l'organisation, un placeholder en MAJUSCULES se terminant par `-INVULLEN` est prévu.
