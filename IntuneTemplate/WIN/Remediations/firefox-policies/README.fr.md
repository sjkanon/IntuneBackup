[Nederlands](README.md) · [English](README.en.md) · **Français**

# Stratégies Firefox

| | |
|---|---|
| **Mesures** | ISO A.8.7 Protection contre les programmes malveillants, A.8.8 Gestion des vulnérabilités techniques, A.8.12 Prévention de la fuite de données, A.8.19 Installation de logiciels sur des systèmes opérationnels · NIS2 art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités · CIS Controls v8.1 7.4 Perform Automated Application Patch Management, 9.1 Ensure Use of Only Fully Supported Browsers and Email Clients, 9.4 Restrict Unnecessary or Unauthorized Browser and Email Client Extensions · NIST CSF 2.0 PR.PS-02, PR.PS-05 |
| **Phase** | 2 (pilote) · blocage des extensions à part, également phase 2 |

L'équivalent Firefox de trois templates de `IntuneTemplate/WIN/SettingsCatalog/` :
`Google Chrome Security`, `Google Chrome Updates` et `Google Chrome Extensions`.

## Pourquoi un script et pas un template

Chrome et Edge figurent dans le catalogue de paramètres, Firefox non : `pl4nty/intune-change-tracking`
ne contient aucune définition Mozilla. Ce que Mozilla documente comme « Windows (Intune) » est un
OMA-URI avec ingestion ADMX, ou un import ADMX par tenant — ce dernier produit des
`groupPolicyConfigurations` dont les identifiants de définition diffèrent d'un tenant à l'autre,
et cette baseline évite ce type (`Admin`). Firefox lit toutefois lui-même ses stratégies dans
`HKLM\SOFTWARE\Policies\Mozilla\Firefox`, sans ADMX. Une remédiation qui écrit ces valeurs
fonctionne donc dans tous les tenants, et sa détection signale aussi quand quelqu'un les annule.

## Ce qui est configuré

Toutes les valeurs selon les [Mozilla policy templates](https://mozilla.github.io/policy-templates/)
(v8.3, septembre 2026). Les choix sont ceux des templates Chrome.

| Valeur | Effet | Équivalent Chrome |
|---|---|---|
| `DisableAppUpdate` = 0, `AppAutoUpdate` = 1, `BackgroundAppUpdate` = 1 | Firefox se met à jour lui-même, y compris lorsqu'il n'est pas lancé | Google Chrome Updates |
| `DisableSecurityBypass\InvalidCertificate` = 1 | Pas d'exception pour un certificat invalide | `SSLErrorOverrideAllowed` = 0 |
| `DisableSecurityBypass\SafeBrowsing` = 1 | Un avertissement Safe Browsing ne peut pas être ignoré | `DisableSafeBrowsingProceedAnyway` = 1 |
| `DNSOverHTTPS\Enabled` = 0, `Locked` = 1 | DoH désactivé et verrouillé | `DnsOverHttpsMode` = off |
| `Preferences` : `network.http.http3.enable` = false, verrouillé | QUIC/HTTP3 désactivé | `QuicAllowed` = 0 |
| `PasswordManagerEnabled` = 0 | Pas de gestionnaire de mots de passe ; Edge est le gestionnaire géré | `PasswordManagerEnabled` = 0 |
| `DisableFirefoxAccounts` = 1 | Pas de compte Mozilla, donc pas de synchronisation vers un compte personnel | `BrowserSignin` = 0, `SyncDisabled` = 1 |
| `DisableTelemetry` = 1 | Pas de télémétrie vers Mozilla | — |
| `ExtensionSettings` : `"*"` = blocked — uniquement avec `$BlockExtensions = $true` | Toutes les extensions bloquées | Google Chrome Extensions |

DoH et QUIC sont désactivés pour la même raison que dans Chrome : Defender Network Protection ne
peut inspecter le trafic d'un navigateur tiers que via DNS et TLS, et Microsoft recommande de
désactiver les deux (voir [`dns-over-https/`](../dns-over-https/README.fr.md#interaction-avec-defender-network-protection)).

## Avant le déploiement

- **Mots de passe.** Contrairement à Chrome, `PasswordManagerEnabled` = 0 dans Firefox bloque aussi
  `about:logins`, la vue d'ensemble des mots de passe déjà enregistrés. Faites-les d'abord
  exporter par les utilisateurs ou importer dans Edge.
- **Extensions.** `"installation_mode": "blocked"` sur `"*"` bloque les nouvelles extensions **et
  supprime celles déjà installées**. C'est pourquoi il dépend de `$BlockExtensions`, désactivé par
  défaut. Faites d'abord l'inventaire (Defender Vulnerability Management → Browser extensions),
  puis constituez une liste d'autorisation en ajoutant `"installation_mode": "allowed"` par
  identifiant d'extension au JSON des deux scripts.
- **`Preferences` existantes.** Une organisation qui définit déjà des préférences Firefox par
  stratégie de groupe ou `policies.json` doit fusionner ce JSON avec celui de ces scripts : la
  valeur `Preferences` est écrasée en entier.
- **Firefox ESR.** La même clé s'applique à ESR. Pour une organisation qui empaquette elle-même
  les mises à jour ESR, mettez plutôt `DisableAppUpdate` à 1 dans les deux scripts.

## Déploiement

Centre d'administration Intune → **Devices → Scripts and remediations → Create** :

| Champ | Valeur |
|---|---|
| Nom | `[Baseline] - WIN - D - Mozilla Firefox Policies` |
| Script de détection | `Detect-FirefoxPolicies.ps1` |
| Script de correction | `Remediate-FirefoxPolicies.ps1` — `$Policies` et `$BlockExtensions` identiques au script de détection |
| Exécuter avec les informations d'identification de l'utilisateur | Non (SYSTEM) |
| PowerShell 64 bits | Oui |
| Planification | Quotidienne |
| Affectation | Groupe pilote `SEC-Baseline-Pilot`, puis tous les appareils Windows. Sur un appareil sans Firefox, il n'écrit que des valeurs de registre. |

Un Firefox en cours d'exécution applique les stratégies après un redémarrage. Vérifiez avec `about:policies`.

Retour arrière : supprimez `HKLM\SOFTWARE\Policies\Mozilla\Firefox` et redémarrez Firefox.
