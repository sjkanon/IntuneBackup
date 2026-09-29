[Nederlands](README.md) · [English](README.en.md) · **Français**

# Contrôle de l'escrow : clé de récupération BitLocker et mot de passe LAPS dans Entra ID

| | |
|---|---|
| **Mesures** | ISO A.8.13 Sauvegarde des informations, A.8.24 Utilisation de la cryptographie, A.8.2 Droits d'accès privilégiés · NIS2 art. 21(2)(c) continuité des activités et gestion des crises, art. 21(2)(f) évaluation de l'efficacité · CIS Controls v8.1 3.11 Encrypt Sensitive Data at Rest, 5.2 Use Unique Passwords · NIST CSF 2.0 PR.DS-01, PR.AA-05 |
| **Phase** | détection 1 (ne modifie rien) · remédiation BitLocker 2 |

## Pourquoi

`[Baseline] - WIN - D - BitLocker` exige que la clé de récupération soit envoyée vers Entra ID et
`[Baseline] - WIN - D - Windows LAPS` que le mot de passe administrateur y soit stocké. Les deux stratégies
signalent **Réussi** dès que le paramètre est appliqué — et non si la clé ou le mot de passe
est effectivement arrivé. Le contrôle de conformité `Compliance BitLocker` vérifie seulement si le
disque est chiffré. Un appareil chiffré sans clé de récupération utilisable dans Entra
est, dès la première récupération BitLocker, irrémédiablement un appareil perdu. Ces scripts rendent cette
différence visible dans le rapport de remédiation — la partie démontrable de A.8.13 et de l'art. 21(2)(f).

## Fichiers

| Fichier | Détection | Remédiation |
|---|---|---|
| `Detect-BitLockerEscrow.ps1` / `Remediate-BitLockerEscrow.ps1` | Le disque système a-t-il un protecteur de mot de passe de récupération, et le journal contient-il pour *ce* protecteur une sauvegarde Entra réussie (événement 845 de l'API BitLocker) ? | `BackupToAAD-BitLockerKeyProtector` pour chaque protecteur de mot de passe de récupération ; en crée un s'il est absent et que le disque est chiffré |
| `Detect-LapsEscrow.ps1` | Une mise à jour LAPS réussie vers Entra ID a-t-elle été journalisée au cours des `$MaxAgeDays` derniers jours (Microsoft-Windows-LAPS/Operational 10029) ? | aucune — détection seule ; `Invoke-LapsPolicyProcessing` force une nouvelle tentative, mais une erreur persistante se situe dans la stratégie ou dans le paramètre d'appareil Entra *Enable Microsoft Entra Local Administrator Password Solution* et doit être corrigée à cet endroit |

## Déploiement

Intune admin center → **Devices → Scripts and remediations → Create**, pour chaque paire :

| Champ | Valeur |
|---|---|
| Nom | `[Baseline] - WIN - D - BitLocker Escrow Check` / `[Baseline] - WIN - D - LAPS Escrow Check` |
| Exécuter avec les informations d'identification de l'utilisateur connecté | Non (SYSTEM) |
| PowerShell 64 bits | Oui |
| Planification | Quotidienne |
| Affectation | tous les appareils Windows ; le script de remédiation BitLocker seulement après une semaine dans le groupe pilote |

Le rapport (Scripts and remediations → la remédiation → Device status) constitue la preuve :
*Without issues* = clé ou mot de passe présent de manière démontrable dans Entra.

## Remarques

- L'événement 845 ne figure dans le journal que tant qu'il n'a pas été écrasé. Un appareil chiffré
  il y a longtemps peut donc avoir à juste titre une clé dans Entra et apparaître malgré tout comme *issue* ;
  le script de remédiation crée alors une nouvelle sauvegarde, après quoi il passe au vert. C'est
  voulu : mieux vaut une sauvegarde superflue qu'une supposition.
- `Detect-LapsEscrow.ps1` part du principe que `passwordagedays_aad` = 7 dans la stratégie LAPS ; `$MaxAgeDays`
  est donc fixé à 10. Ajustez-le si la stratégie change.
- Les deux détections se contentent de lire les journaux et l'état BitLocker ; elles n'envoient rien.
