<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Google_Chrome_Security.md) · [English](Baseline_WIN_D_Google_Chrome_Security.en.md) · **Français**

# CXNM - Standard - WIN - D - Google Chrome Security

Verrouille la sécurité de Google Chrome au niveau d'Edge : Safe Browsing activé et impossible à contourner, téléchargements malveillants bloqués, erreurs de certificat impossibles à ignorer, et aucune donnée d'entreprise vers un compte Google personnel.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | Stratégie Google Chrome dans le catalogue de paramètres (chromeintunev1, chromeintunev141) — valeurs choisies d'après l'équivalent Edge de cette baseline ; ids, options et plages vérifiés par rapport à DCv2/Settings dans pl4nty/intune-change-tracking |
| Fichier | [`Baseline_WIN_D_Google_Chrome_Security.json`](Baseline_WIN_D_Google_Chrome_Security.json) |

> Safe Browsing en mode standard (1) et non amélioré (2) : le mode amélioré envoie chaque URL visitée à Google. Restriction de téléchargement 4 = « bloquer les téléchargements malveillants », la même valeur que dans Edge. Le gestionnaire de mots de passe est désactivé car Edge est le gestionnaire géré ; Chrome n'enregistre plus de nouveaux mots de passe, ceux déjà enregistrés continuent de fonctionner selon Google. Les extensions ont leur propre stratégie (Google Chrome Extensions), comme pour Edge ; BlockExternalExtensions est ici, car il ne concerne que les extensions installées par d'autres logiciels via le registre. ApplicationBoundEncryptionEnabled se trouve dans l'espace de noms chromeintunev141 du catalogue, le reste dans chromeintunev1. Firefox n'a pas de définitions dans le catalogue de paramètres : voir extras/windows/remediations/firefox-policies.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Protection contre les programmes malveillants<br>A.8.12 Prévention de la fuite de données<br>A.8.23 Filtrage web<br>A.8.24 Utilisation de la cryptographie |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités<br>art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process<br>9.6 Block Unnecessary File Types<br>10.5 Enable Anti-Exploitation Features |
| NIST CSF 2.0 | PR.PS-01<br>PR.PS-05<br>PR.DS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 17

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome~safebrowsing_safebrowsingprotectionlevel` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome~safebrowsing_safebrowsingprotectionlevel_safebrowsingprotectionlevel` | 1 |
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_disablesafebrowsingproceedanyway` | 1 |
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_sslerroroverrideallowed` | 0 |
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_downloadrestrictions` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_downloadrestrictions_downloadrestrictions` | 4 |
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_dnsoverhttpsmode` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_dnsoverhttpsmode_dnsoverhttpsmode` | off |
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_quicallowed` | 0 |
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_remotedebuggingallowed` | 0 |
| `device_vendor_msft_policy_config_chromeintunev141~policy~googlechrome_applicationboundencryptionenabled` | 1 |
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_browsersignin` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_browsersignin_browsersignin` | 0 |
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_syncdisabled` | 1 |
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome~passwordmanager_passwordmanagerenabled` | 0 |
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_importsavedpasswords` | 0 |
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome~extensions_blockexternalextensions` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
