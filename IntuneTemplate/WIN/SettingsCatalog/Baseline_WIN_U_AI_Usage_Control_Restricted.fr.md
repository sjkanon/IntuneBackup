<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_U_AI_Usage_Control_Restricted.md) · [English](Baseline_WIN_U_AI_Usage_Control_Restricted.en.md) · **Français**

# CXNM - Standard - WIN - U - AI Usage Control Restricted

Bloque dans Edge les services d'IA que la politique n'a pas approuvés. Microsoft Copilot reste explicitement accessible.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Settings Catalog |
| Affectation | — |
| Source | ISO/IEC 27001:2022 A.5.10, A.5.19 et A.8.1, NIS2 art. 21(2)(d) — mécanisme issu de la policy Edge existante |
| Fichier | [`Baseline_WIN_U_AI_Usage_Control_Restricted.json`](Baseline_WIN_U_AI_Usage_Control_Restricted.json) |

> Pour une politique d'IA qui interdit tous les outils d'IA sauf Microsoft Copilot, Copilot Pro et GitHub Copilot pour les développeurs ; sans cette policy, rien n'arrête un utilisateur. ATTENTION lors du déploiement : CXNM - Standard - WIN - U - Microsoft Edge User Experience définit la même liste de blocage. Deux policies affectées avec une liste différente provoquent un conflit, après quoi Intune n'en applique aucune. Reprenez donc cette liste dans cette policy, ou retirez-la de celle-ci — n'affectez pas les deux. Les deux règles pour le site web du Store issues d'OpenIntuneBaseline figurent déjà ici, de sorte que cette liste est complète. Une liste de blocage d'URL est en outre une friction, pas une frontière : elle ne fonctionne ni sur un téléphone ni sur un appareil personnel. La variante plus robuste est la catégorie Generative AI de Defender Web Content Filtering ; elle se trouve dans le portail Defender, pas dans ce dépôt. **Alternative à CXNM - Standard - WIN - U - AI Usage Control Permitted**, qui définit la même liste de blocage sans les services d'IA. Affecter les deux provoque un Conflict, et plus rien n'est alors bloqué — pas même les règles du Store.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.10 Utilisation correcte de l'information et des autres actifs associés<br>A.5.19 Sécurité de l'information dans les relations avec les fournisseurs<br>A.8.1 Terminaux finaux des utilisateurs<br>A.8.23 Filtrage web |
| NIS2 art. 21(2) | art. 21(2)(d) sécurité de la chaîne d'approvisionnement |
| NIST CSF 2.0 | PR.DS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 2

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_urlblocklist` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_urlblocklist_urlblocklistdesc` | https://apps.microsoft.com, https://apps.microsoft.com/*, chatgpt.com, chat.openai.com, gemini.google.com, claude.ai, perplexity.ai, chat.deepseek.com, chat.mistral.ai, grok.com, poe.com, character.ai |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
