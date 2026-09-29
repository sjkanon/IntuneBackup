[Nederlands](README.md) · [English](README.en.md) · **Français**

# DNS over HTTPS pour Windows

| | |
|---|---|
| **Mesures** | ISO A.8.20 Sécurité des réseaux, A.8.24 Utilisation de la cryptographie · NIS2 art. 21(2)(h) cryptographie et chiffrement, art. 21(2)(j) authentification multifacteur et communications sécurisées · CIS Controls v8.1 3.10 Encrypt Sensitive Data in Transit, 4.9 Configure Trusted DNS Servers on Enterprise Assets · NIST CSF 2.0 PR.DS-02 |
| **Phase** | *Allow* 2 (pilote) · *Require* 5 (alternative, choix du client) |

## Pourquoi un script et pas un template

Windows dispose de la stratégie de groupe *Configure DNS over HTTPS (DoH) name resolution*
(`HKLM\SOFTWARE\Policies\Microsoft\Windows NT\DNSClient\DoHPolicy`). Ce paramètre n'existe
**pas** dans le settings catalog : sous `device_vendor_msft_policy_config_admx_dnsclient_*`,
`pl4nty/intune-change-tracking` ne connaît que les paramètres classiques du client DNS
(suffixes, enregistrement, `turn_off_multicast` etc.), pas de DoH. Un import ADMX serait possible, mais
cette baseline évite ce type (`Admin`). D'où une remédiation. La variante Edge existe **bien** dans
le catalog et figure comme paire de templates dans `IntuneTemplate/WIN/SettingsCatalog/`
(`Microsoft Edge DNS over HTTPS Automatic` phase 2, `… Secure` phase 5).

| `DoHPolicy` | Signification | Ici |
|---:|---|---|
| 1 | Interdire DoH | — |
| 2 | **Autoriser** DoH : Windows utilise DoH si le serveur DNS configuré figure sur la liste des serveurs DoH connus (`netsh dns show encryption`), sinon le DNS classique | `Remediate-DoHPolicy.ps1 -Mode Allow` — phase 2 |
| 3 | **Exiger** DoH : aucune résolution de noms sans serveur compatible DoH | `Remediate-DoHPolicy.ps1 -Mode Require` — phase 5 |

## Pourquoi *autoriser* est le choix générique

- **Résolveurs internes.** Un contrôleur de domaine ou un serveur DNS interne ne figure pas sur la liste des
  serveurs DoH connus. Avec *autoriser*, il continue de fonctionner via le DNS classique ; avec *exiger*,
  plus aucun nom ne se résout sur un tel réseau — donc la connexion VPN vers ce réseau non plus.
- **Réseaux publics.** Sur le Wi-Fi d'un hôtel ou à domicile avec un résolveur DHCP comme 1.1.1.1, 8.8.8.8 ou
  9.9.9.9, Windows chiffre automatiquement, sans que personne n'ait à choisir un résolveur.
- **Les portails captifs** continuent de fonctionner avec *autoriser*.

*Exiger* convient à une organisation qui fait passer tout son DNS par un résolveur DoH propre ou sous contrat
(service de filtrage DNS), qui gère aussi le split DNS, et qui déploie au préalable le template de serveur par carte réseau ou via
`netsh dns add encryption`. C'est un choix du client.

## Interaction avec Defender Network Protection

Network Protection (activé dans `[Baseline] - WIN - D - Defender Antivirus`) bloque les domaines
malveillants en inspectant le trafic DNS et TLS sur l'appareil. Le DoH de **Windows lui-même** passe
par le client DNS du système d'exploitation et reste visible pour Defender. Le DoH **dans un
navigateur tiers** (Chrome, Firefox) contourne le client DNS ; dans la documentation de
Network Protection, Microsoft recommande de désactiver DoH et QUIC dans ces navigateurs. Edge n'est pas
concerné, car Edge utilise SmartScreen. Vérifiez-le après le déploiement avec un domaine de test de
`smartscreentestratings2.net` dans Chrome.

## Déploiement

Intune admin center → **Devices → Scripts and remediations → Create** :

| Champ | Valeur |
|---|---|
| Nom | `[Baseline] - WIN - D - DNS over HTTPS Allow` (ou `… Require`) |
| Script de détection | `Detect-DoHPolicy.ps1` ; réglez `$Expected` en haut du script sur 2 (Allow) ou 3 (Require) |
| Script de remédiation | `Remediate-DoHPolicy.ps1` avec `$Mode = 'Allow'` ou `'Require'` en haut du script |
| Exécuter avec les informations d'identification de l'utilisateur connecté | Non (SYSTEM) |
| PowerShell 64 bits | Oui |
| Planification | Quotidienne |
| Affectation | *Allow* : groupe pilote, puis tous les appareils Windows · *Require* : jamais en parallèle d'*Allow* |

Retour arrière : supprimez la valeur `DoHPolicy` (ou réglez-la sur 2) et redémarrez le client DNS
(`Restart-Service Dnscache -Force` ou un redémarrage).
