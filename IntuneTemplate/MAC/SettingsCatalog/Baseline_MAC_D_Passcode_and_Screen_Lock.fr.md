<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_D_Passcode_and_Screen_Lock.md) · [English](Baseline_MAC_D_Passcode_and_Screen_Lock.en.md) · **Français**

# [Baseline] - MAC - D - Passcode and Screen Lock

Configure sur le Mac le mot de passe et le verrouillage d'écran que la policy de conformité exige déjà : au moins huit caractères, pas de mot de passe simple, verrouillage après quinze minutes.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | Payload Apple Passcode (com.apple.mobiledevice.passwordpolicy) dans le settings catalog macOS — valeurs reprises à l'identique de [Baseline] - MAC - U - Compliance Password et vérifiées par rapport aux définitions du settings catalog (minLength max 16, maxInactivity max 15). |
| Fichier | [`Baseline_MAC_D_Passcode_and_Screen_Lock.json`](Baseline_MAC_D_Passcode_and_Screen_Lock.json) |

> maxInactivity ne peut pas dépasser 15 minutes dans le settings catalog — c'est justement la valeur exacte qu'exige la policy de conformité. maxFailedAttempts est volontairement omis : sur macOS, cela entraîne un délai d'attente croissant puis un blocage qui ne peut être levé qu'avec la clé de récupération FileVault, et c'est un arbitrage distinct. Cette policy ne définit aucun paramètre com.apple.applicationaccess ou com.apple.screensaver et n'entre donc pas en conflit avec MAC - D - Restrictions. Depuis Apple OS 27, Microsoft indique le payload Passcode classique comme déprécié, avec la configuration déclarative de code (passcode_*, macOS 13 et ultérieur) comme successeur. Il n'est pas certain que RequireComplexPasscode y ait le même sens que « pas de code simple », car le catalogue Intune et le schéma d'Apple se contredisent ; l'arbitrage est décrit dans [Baseline] - IOS - D - Passcode. Attention : les utilisateurs ayant un mot de passe plus court ou plus simple doivent le changer à leur prochaine connexion. Depuis septembre 2026, [Baseline] - MAC - D - Screensaver définit les clés com.apple.screensaver : demander le mot de passe 5 secondes après le démarrage de l'économiseur d'écran et démarrer l'économiseur d'écran après 900 secondes, y compris dans la fenêtre de connexion. Ce sont les mêmes 15 minutes que maxInactivity ici, avec des settingDefinitionId différents — pas de conflit, et ce n'est qu'ensemble qu'ils donnent un Mac qui demande vraiment un mot de passe après 15 minutes.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Informations d'authentification<br>A.7.7 Bureau propre et écran vide<br>A.8.1 Terminaux finaux des utilisateurs<br>A.8.5 Authentification sécurisée |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 4.3 Configure Automatic Session Locking on Enterprise Assets |
| NIST CSF 2.0 | PR.AA-03 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 8

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `com.apple.mobiledevice.passwordpolicy_com.apple.mobiledevice.passwordpolicy` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mobiledevice.passwordpolicy_forcepin` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mobiledevice.passwordpolicy_requirealphanumeric` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mobiledevice.passwordpolicy_allowsimple` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mobiledevice.passwordpolicy_minlength` | 8 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mobiledevice.passwordpolicy_mincomplexchars` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mobiledevice.passwordpolicy_pinhistory` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mobiledevice.passwordpolicy_maxinactivity` | 15 |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
