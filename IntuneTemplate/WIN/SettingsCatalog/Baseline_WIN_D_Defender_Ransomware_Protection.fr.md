<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Defender_Ransomware_Protection.md) · [English](Baseline_WIN_D_Defender_Ransomware_Protection.en.md) · **Français**

# CXNM - Standard - WIN - D - Defender Ransomware Protection

Empêche un appareil infecté de chiffrer des fichiers sur d'autres machines via le réseau.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | IntuneAdmin/IntuneBaselines — Microsoft Endpoint Security, Remote Encryption Protection ; valeurs vérifiées par rapport aux définitions du settings catalog. IntuneAdmin règle sur Audit ; ici c'est Block. |
| Fichier | [`Baseline_WIN_D_Defender_Ransomware_Protection.json`](Baseline_WIN_D_Defender_Ransomware_Protection.json) |

> L'agressivité est réglée sur Low : ne bloquer que lorsque Defender est certain à 100 pour cent. C'est la valeur avec le moins de risque de faux positif, et un faux positif coûte cher ici — on bloque alors un processus légitime qui met à jour des fichiers sur un partage, par exemple une sauvegarde ou un outil de synchronisation. Medium et High bloquent respectivement à partir de 99 et 90 pour cent de certitude ; ne les envisagez que lorsque les rapports montrent que rien de légitime n'est touché. IntuneAdmin fournit ce paramètre sur Audit ; ici il est sur Block, car détecter sans bloquer n'arrête pas le chiffrement.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.29 Sécurité de l'information durant une perturbation<br>A.8.7 Protection contre les programmes malveillants<br>A.8.20 Sécurité des réseaux |
| NIS2 art. 21(2) | art. 21(2)(c) continuité des activités et gestion des crises<br>art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 10.7 Use Behavior-Based Anti-Malware Software |
| NIST CSF 2.0 | DE.CM-09<br>RS.MI-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 2

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_defender_configuration_behavioralnetworkblocks_remoteencryptionprotection_remoteencryptionprotectionconfiguredstate` | 1 |
| `device_vendor_msft_defender_configuration_behavioralnetworkblocks_remoteencryptionprotection_remoteencryptionprotectionaggressiveness` | 0 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
