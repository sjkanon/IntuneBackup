[Nederlands](README.md) · [English](README.en.md) · **Français**

# Tailles des journaux pour PowerShell, Defender et Code Integrity

| | |
|---|---|
| **Mesures** | ISO A.8.15 Journalisation · NIS2 art. 21(2)(b) gestion des incidents · CIS Controls v8.1 8.3 Ensure Adequate Audit Log Storage · NIST CSF 2.0 PR.PS-04 |
| **Phase** | 2 |

## Pourquoi

`CXNM - Standard - WIN - D - Audit and Event Logging` définit la taille des journaux Application, Security et
System. Les trois canaux opérationnels sur lesquels l'investigation d'incidents s'appuie le plus n'ont pas de CSP
pour leur taille maximale et sont par défaut à 15 Mo ou moins :

| Canal | Alimenté par | Par défaut | Ici |
|---|---|---:|---:|
| `Microsoft-Windows-PowerShell/Operational` | journalisation des blocs de script (Security Hardening), journalisation des modules (Security Log Monitoring) | 15 Mo | 256 Mo |
| `Microsoft-Windows-Windows Defender/Operational` | détections, ASR, Network Protection, alertes de falsification | 16 Mo | 64 Mo |
| `Microsoft-Windows-CodeIntegrity/Operational` | audit App Control 3076/3089 (voir `../app-control/`) | 1 Mo | 64 Mo |

Avec la journalisation des modules activée, le journal PowerShell d'un poste d'administration actif est plein en quelques heures
et les événements de la veille ont disparu au moment où quelqu'un les cherche. Le journal
CodeIntegrity de 1 Mo ne survit pas à une phase d'audit de trente jours.

## Déploiement

Intune admin center → **Devices → Scripts and remediations → Create** :

| Champ | Valeur |
|---|---|
| Nom | `CXNM - Standard - WIN - D - Event Log Sizes` |
| Script de détection | `Detect-EventLogSizes.ps1` |
| Script de remédiation | `Remediate-EventLogSizes.ps1` |
| Exécuter avec les informations d'identification de l'utilisateur connecté | Non (SYSTEM) |
| PowerShell 64 bits | Oui |
| Planification | Quotidienne |
| Affectation | groupe pilote, puis tous les appareils Windows |

Les tailles figurent dans la même table `$Channels` dans les deux scripts ; gardez-les identiques. 256 + 64 + 64 Mo
est négligeable sur un disque de 256 Go ; Storage Sense ne touche pas aux journaux.
