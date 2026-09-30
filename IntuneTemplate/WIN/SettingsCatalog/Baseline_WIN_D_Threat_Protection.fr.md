<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Threat_Protection.md) · [English](Baseline_WIN_D_Threat_Protection.en.md) · **Français**

# CXNM - Standard - WIN - D - Threat Protection

Supprime les échappatoires locales de la protection anti-malware : les utilisateurs ne peuvent pas passer outre Exploit Protection ni désactiver localement le signalement cloud, et le détournement de DLL devient plus difficile.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | ISO/IEC 27001:2022 A.8.7 et A.8.8, NIS2 art. 21(2)(e) — paramètres issus de CIS v4 Windows 11 L1 |
| Fichier | [`Baseline_WIN_D_Threat_Protection.json`](Baseline_WIN_D_Threat_Protection.json) |

> La protection LSA figurait déjà dans CXNM - Standard - WIN - D - Device Guard and Credential Guard ; ce qui manquait, ce sont les remplacements locaux. La protection contre les logiciels malveillants ne doit pas pouvoir être modifiée par l'utilisateur final, et c'étaient les endroits où c'était possible ; le blocage des paramètres locaux d'exploit protection se trouve depuis OpenIntuneBaseline v4.0 dans CXNM - Standard - WIN - D - Defender Additional Configuration. SafeDllSearchMode est la plus ancienne et toujours la moins coûteuse des défenses contre le détournement de DLL.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Protection contre les programmes malveillants<br>A.8.8 Gestion des vulnérabilités techniques |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 10.5 Enable Anti-Exploitation Features<br>10.6 Centrally Manage Anti-Malware Software |
| NIST CSF 2.0 | PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 2

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_admx_microsoftdefenderantivirus_spynet_localsettingoverridespynetreporting` | 0 |
| `device_vendor_msft_policy_config_admx_mss-legacy_pol_mss_safedllsearchmode` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
