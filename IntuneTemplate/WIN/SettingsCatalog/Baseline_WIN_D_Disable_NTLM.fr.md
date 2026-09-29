<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Disable_NTLM.md) · [English](Baseline_WIN_D_Disable_NTLM.en.md) · **Français**

# [Baseline] - WIN - D - Disable NTLM

Désactive l'authentification NTLM obsolète au profit de Kerberos. Casse les anciennes applications on-prem et les appareils qui ne parlent pas Kerberos — tester d'abord.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| checkId | `INTUNE-BASE-066-DDisableNTLM` |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Network Security - D - Disable NTLM |
| Fichier | [`Baseline_WIN_D_Disable_NTLM.json`](Baseline_WIN_D_Disable_NTLM.json) |

> NTLMv1 et LM ont déjà disparu sur chaque appareil : lanmanagerauthenticationlevel 5 figure aussi dans [Baseline] - WIN - D - Local Security Policies, en phase 1. Cette policy fait le reste — refuser totalement NTLM. Microsoft ne désactive NTLM par défaut qu'à partir de la prochaine version majeure de Windows et les versions existantes continuent de le prendre en charge, il n'y a donc pas d'urgence ; auditez d'abord. Local Security Policies journalise le NTLM entrant que cette policy refuserait (auditincomingntlmtraffic) ; le sortant est visible sur 24H2 sans policy.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.5 Authentification sécurisée |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| NIST CSF 2.0 | PR.AA-03<br>PR.AA-04 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 3

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_networksecurity_lanmanagerauthenticationlevel` | 5 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_networksecurity_restrictntlm_incomingntlmtraffic` | 2 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_networksecurity_restrictntlm_outgoingntlmtraffictoremoteservers` | 2 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
