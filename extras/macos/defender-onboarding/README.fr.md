[Nederlands](README.md) · [English](README.en.md) · **Français**

# extras/macos/defender-onboarding/

Comment un Mac est intégré (onboarding) à Microsoft Defender for Endpoint — et pourquoi il n'existe pas
de modèle générique pour cela dans `IntuneTemplate/`.

## La lacune

La baseline prépare bien Defender sur macOS —
[`MAC - D - Defender for Endpoint`](../../../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Defender_for_Endpoint.fr.md)
(extensions système, filtre réseau, accès complet au disque, notifications) et
[`MAC - D - Defender Antivirus`](../../../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Defender_Antivirus.fr.md)
(protection en temps réel, tamper protection) — mais **n'intègre le Mac nulle part**. Sans intégration,
l'agent fonctionne sans licence : `mdatp health` indique `licensed: false`, aucun
signal EDR n'arrive dans le portail Defender et le contrôle de conformité de
[`extras/macos/compliance-scripts/`](../compliance-scripts/README.fr.md) reste rouge.

## Est-ce faisable de façon générique, comme sur Windows ? Non.

Sur Windows, `CXNM - Standard - WIN - D - Defender for Endpoint EDR` définit le paramètre
`device_vendor_msft_windowsadvancedthreatprotection_onboarding_fromconnector` : Intune récupère lui-même le
package d'intégration via le connecteur Defender, donc le modèle ne contient rien de propre au tenant.

Pour macOS, cette route n'existe pas (vérifié en septembre 2026) :

| Recherché | Résultat |
|---|---|
| settings catalog (`pl4nty/intune-change-tracking`, 18 329 définitions) sur `onboard`, `wdav.atp`, `orgid` | uniquement les deux id Windows et un paramètre Office ; pas d'intégration macOS |
| Modèle Endpoint security *Endpoint detection and response* pour macOS (`a6ff37f6-c841-4264-9249-1ecf793d94ef_1`, technologies `mdm,microsoftSense`) | contient uniquement des balises d'appareil (`com.apple.managedclient.preferences_tags`) et des id de groupe (`…_groupids`) — pas de package d'intégration, pas d'option de connecteur |
| Microsoft Learn — *Deploy Microsoft Defender for Endpoint on macOS with Intune* (mis à jour le 9 septembre 2026), étapes 13–14 | télécharger le package d'intégration `WindowsDefenderATPOnboarding.xml` depuis le portail Defender et le charger en tant que **custom configuration profile** |

Ce fichier XML contient l'id d'organisation et les données d'intégration du tenant. Un modèle CIPP
(`macOSCustomConfiguration`, Type `Device`) serait techniquement possible, mais il y aurait alors, par tenant,
un fichier différent dans la payload — le contraire d'une baseline générique, et un secret dans le
dépôt. Un placeholder ne fonctionne pas : la payload est le base64 d'une plist que macOS doit pouvoir lire.

## La route (par tenant, une seule fois)

Prérequis : une licence Defender for Endpoint Plan 1/2 ou Microsoft 365 E3/E5/Business Premium,
et le **connecteur Microsoft Defender for Endpoint** activé dans Intune (Endpoint security →
Microsoft Defender for Endpoint → *Connect macOS devices … to Microsoft Defender for Endpoint* : On).

1. **La configuration d'abord.** Affectez `MAC - D - Defender for Endpoint` et `MAC - D - Defender Antivirus`
   avant l'application et le package d'intégration (Microsoft : « Deploy the required configuration profiles
   before you deploy the Defender for Endpoint app and onboarding package »).
2. **Application.** Apps → macOS → Add → *Microsoft Defender for Endpoint (macOS)*, valeurs par défaut,
   affecter au même groupe d'appareils. (Une affectation d'application n'est pas un type de stratégie CIPP ; c'est
   pourquoi elle figure aussi ici et non dans `IntuneTemplate/`.)
3. **Télécharger le package d'intégration.** Portail Defender → Settings → Endpoints → Onboarding →
   macOS, Connectivity type *Streamlined*, Deployment method *Mobile Device Management / Microsoft
   Intune* → Download. Dans le zip : `intune/WindowsDefenderATPOnboarding.xml`.
4. **Profil.** Devices → macOS → Configuration → Create → Templates → **Custom**. Nom
   `CXNM - Standard - MAC - D - Defender for Endpoint Onboarding`, deployment channel *Device channel*,
   fichier `WindowsDefenderATPOnboarding.xml`. Affecter au même groupe.
5. **Vérifier.** Sur le Mac : `mdatp health --field licensed` → `true`, et
   `mdatp health --field org_id` affiche le tenant. L'appareil apparaît dans le portail en
   une heure environ. Test EDR : Microsoft Learn *EDR detection test*.
6. **Conformité.** Seulement ensuite, affectez la conformité personnalisée de `extras/macos/compliance-scripts/`, et — si
   l'organisation veut piloter selon le niveau de risque — `deviceThreatProtectionEnabled` dans la
   conformité macOS.

Ne conservez **pas** le fichier XML dans ce dépôt. Le package n'expire pas, mais quiconque le détient peut
inscrire des appareils auprès du tenant.

## Ce qui manque encore à la stratégie existante (pour la prochaine importation OIB)

La liste des profils requis par Microsoft comparée à `MAC - D - Defender for Endpoint`
(OpenIntuneBaseline macOS v1.0) :

| Microsoft Learn | Actuellement | OIB macOS v2.0 beta |
|---|---|---|
| Background services pour `com.microsoft.wdav` | uniquement des règles pour `com.microsoft.fresno` et `com.microsoft.dlp` | ajoute `com.microsoft.wdav`, avec team id |
| Allowed System Extension **Types** `Network` et `EndpointSecurity` | non défini (uniquement les extensions elles-mêmes) | non défini |
| Notifications pour `com.microsoft.autoupdate2` | uniquement `com.microsoft.wdav.tray` | oui |

Ces points relèvent de l'importation d'OIB macOS v2.0 dès sa sortie de beta ; ils n'ont pas été ajoutés
séparément ici parce que la stratégie provient d'OIB et qu'un second profil `com.apple.servicemanagement` à côté
des règles existantes rendrait la gestion confuse. Le modèle EDR d'Endpoint security (balises)
est facultatif et propre à l'organisation ; non inclus.

## Normes

C'est l'intégration qui met réellement en œuvre A.8.7 (protection contre les logiciels malveillants), A.8.16 (activités de surveillance), NIS2
art. 21(2)(b) (gestion des incidents) et CIS Controls v8.1 10.1 / 13.7 (host-based intrusion
prevention) sur un Mac ; les stratégies de configuration seules ne le font pas.
