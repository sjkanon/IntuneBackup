<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Access_Control.md) · [English](Baseline_WIN_D_Access_Control.en.md) · **Français**

# [Baseline] - WIN - D - Access Control

Affiche avant la connexion un avertissement indiquant que le système est réservé aux utilisateurs autorisés, et masque le nom du dernier utilisateur connecté.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | ISO/IEC 27001:2022 A.5.15 et A.8.5, NIS2 art. 21(2)(i) — paramètres issus de CIS v4 Windows 11 L1 |
| Fichier | [`Baseline_WIN_D_Access_Control.json`](Baseline_WIN_D_Access_Control.json) |

> Les politiques de sécurité de l'information exigent souvent les deux premiers littéralement : un avertissement général à la connexion, et aucune identification du système ou de l'utilisateur avant une connexion réussie. La bannière a une portée juridique en cas d'abus ; adaptez le texte au nom de l'organisation avant le déploiement. Masquer le dernier nom d'utilisateur est perceptible pour les utilisateurs — ils devront désormais saisir leur nom complet — communiquez-le donc avant de l'affecter. Les trois autres paramètres ferment les voies de connexion que la politique ne cite pas comme méthode approuvée : le mot de passe image, l'ancien code PIN de commodité (pas le code PIN Windows Hello, qui continue de fonctionner) et les questions de sécurité pour les comptes locaux — ces dernières parce qu'une réinitialisation de mot de passe doit exiger une vérification d'identité, et que les questions de sécurité la contournent justement.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Contrôle d'accès<br>A.5.17 Informations d'authentification<br>A.8.5 Authentification sécurisée |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| NIST CSF 2.0 | PR.AA-03 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 6

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_interactivelogon_messagetitleforusersattemptingtologon` | Toegang uitsluitend voor geautoriseerde gebruikers |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_interactivelogon_messagetextforusersattemptingtologon` | Dit systeem en de gegevens erop zijn eigendom van de organisatie en zijn uitsluitend bestemd voor geautoriseerd gebruik., Gebruik wordt gelogd en gecontroleerd. Onbevoegd gebruik kan leiden tot disciplinaire maatregelen en strafrechtelijke vervolging., Door verder te gaan verklaart u kennis te hebben genomen van het informatiebeveiligingsbeleid. |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_interactivelogon_donotdisplaylastsignedin` | 1 |
| `device_vendor_msft_policy_config_credentialproviders_blockpicturepassword` | 1 |
| `device_vendor_msft_policy_config_credentialproviders_allowpinlogon` | 0 |
| `device_vendor_msft_policy_config_admx_credui_nolocalpasswordresetquestions` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
