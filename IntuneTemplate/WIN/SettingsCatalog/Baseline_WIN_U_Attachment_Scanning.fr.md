<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_U_Attachment_Scanning.md) · [English](Baseline_WIN_U_Attachment_Scanning.en.md) · **Français**

# CXNM - Standard - WIN - U - Attachment Scanning

Fait vérifier chaque pièce jointe par l'antivirus au moment où l'utilisateur l'ouvre, et pas seulement lors de l'enregistrement.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Settings Catalog |
| Affectation | All Users |
| Source | CIS v4 Windows 11 L1 — paramètre repris d'IntuneAdmin, valeur vérifiée par rapport à la définition du settings catalog. |
| Fichier | [`Baseline_WIN_U_Attachment_Scanning.json`](Baseline_WIN_U_Attachment_Scanning.json) |

> Portée utilisateur, donc à affecter aux utilisateurs et non aux appareils. Fonctionne avec Defender et avec tout autre scanner qui s'enregistre comme fournisseur antivirus. En outre, les informations de zone d'un fichier téléchargé sont conservées (Mark of the Web). Cette marque est ce sur quoi s'appuient le Mode protégé d'Office et SmartScreen ; si elle est perdue, un document téléchargé s'ouvre comme s'il provenait du disque local et le principal frein disparaît. Le paramètre est formulé à l'inverse dans le catalogue — *Do not preserve zone information* sur Disabled signifie que les informations sont bel et bien conservées.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Protection contre les programmes malveillants |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 10.1 Deploy and Maintain Anti-Malware Software |
| NIST CSF 2.0 | DE.CM-09 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 2

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `user_vendor_msft_policy_config_attachmentmanager_notifyantivirusprograms` | 1 |
| `user_vendor_msft_policy_config_attachmentmanager_donotpreservezoneinformation` | 0 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
