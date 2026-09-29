<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Windows_Event_Forwarding.md) · [English](Baseline_WIN_D_Windows_Event_Forwarding.en.md) · **Français**

# [Baseline] - WIN - D - Windows Event Forwarding

Transfère les événements Windows vers un Windows Event Collector central, afin que les journaux soient conservés hors de portée d'un attaquant présent sur l'appareil.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| checkId | `INTUNE-BASE-207-DWindowsEventForwarding` |
| Source | Microsoft Learn — 'Use Windows Event Forwarding to help with intrusion detection' et Policy CSP ADMX_EventForwarding/SubscriptionManager ; valeurs vérifiées par rapport aux définitions du settings catalog |
| Fichier | [`Baseline_WIN_D_Windows_Event_Forwarding.json`](Baseline_WIN_D_Windows_Event_Forwarding.json) |

> Remplacez `WEC-SERVER-FQDN-INVULLEN` par le FQDN du collecteur (HTTPS : ajoutez le port 5986 et `IssuerCA=<thumbprint>`). Pour transférer le journal **Security**, NETWORK SERVICE doit disposer d'un droit de lecture sur ce canal — cela ne peut pas être défini via le settings catalog ; ajoutez le compte au groupe Event Log Readers (construction analogue à Local Administrators via Account Protection) ou définissez le SDDL ChannelAccess par script. Il n'est pas nécessaire d'activer un écouteur WinRM : Remote Access Hardening désactive `allowremoteservermanagement`, et le transfert initié par la source utilise le client WinRM sortant.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.15 Journalisation<br>A.8.16 Activités de surveillance |
| NIS2 art. 21(2) | art. 21(2)(b) gestion des incidents |
| CIS Controls v8.1 | 8.9 Centralize Audit Logs |
| NIST CSF 2.0 | PR.PS-04<br>DE.CM-09 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 2

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_admx_eventforwarding_subscriptionmanager` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_admx_eventforwarding_subscriptionmanager_subscriptionmanager_listbox` | Server=http://WEC-SERVER-FQDN-INVULLEN:5985/wsman/SubscriptionManager/WEC,Refresh=60 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
