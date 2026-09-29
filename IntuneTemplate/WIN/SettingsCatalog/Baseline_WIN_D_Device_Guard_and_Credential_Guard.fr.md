<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Device_Guard_and_Credential_Guard.md) · [English](Baseline_WIN_D_Device_Guard_and_Credential_Guard.en.md) · **Français**

# [Baseline] - WIN - D - Device Guard and Credential Guard

Active la sécurité basée sur la virtualisation, Credential Guard et l'intégrité de la mémoire, afin que les identifiants soient conservés dans une partie isolée de la mémoire. Nécessite un redémarrage et peut bloquer d'anciens pilotes.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Device Security - U - Device Guard, Credential Guard and HVCI |
| Fichier | [`Baseline_WIN_D_Device_Guard_and_Credential_Guard.json`](Baseline_WIN_D_Device_Guard_and_Credential_Guard.json) |

> OIB l'affecte aux utilisateurs pour éviter un redémarrage en plein Autopilot ; les 8 paramètres sont tous de portée appareil, d'où D ici. Tenez compte du fait que la première application nécessite un redémarrage.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Informations d'authentification<br>A.8.1 Terminaux finaux des utilisateurs<br>A.8.7 Protection contre les programmes malveillants |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités<br>art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 10.5 Enable Anti-Exploitation Features |
| NIST CSF 2.0 | PR.AA-01<br>PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 8

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_deviceguard_configuresystemguardlaunch` | 1 |
| `device_vendor_msft_policy_config_deviceguard_lsacfgflags` | 1 |
| `device_vendor_msft_policy_config_deviceguard_enablevirtualizationbasedsecurity` | 1 |
| `device_vendor_msft_policy_config_deviceguard_machineidentityisolation` | 0 |
| `device_vendor_msft_policy_config_deviceguard_requireplatformsecurityfeatures` | 3 |
| `device_vendor_msft_policy_config_localsecurityauthority_configurelsaprotectedprocess` | 1 |
| `device_vendor_msft_policy_config_virtualizationbasedtechnology_hypervisorenforcedcodeintegrity` | 1 |
| `device_vendor_msft_policy_config_virtualizationbasedtechnology_requireuefimemoryattributestable` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
