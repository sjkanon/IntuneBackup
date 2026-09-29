<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_IOS_D_Passcode.md) · [English](Baseline_IOS_D_Passcode.en.md) · **Français**

# [Baseline] - IOS - D - Passcode

Définit sur les iPhone et iPad inscrits le code d'accès que la policy de conformité vérifie : au moins six caractères, pas de code simple, verrouillage immédiat, verrouillage automatique après cinq minutes au plus, et effacement seulement après dix tentatives infructueuses.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| checkId | `INTUNE-BASE-190-IOSDPasscode` |
| Source | Payload Apple Passcode (com.apple.mobiledevice.passwordpolicy) dans le settings catalog iOS, même payload qu'UniFy iOS/iPadOS Baseline v1.2 — SC - Device Security - BYOD/Corporate ; valeurs alignées sur [Baseline] - IOS - U - Compliance Password, inactivité selon CIS Apple iOS/iPadOS 26 Benchmark |
| Fichier | [`Baseline_IOS_D_Passcode.json`](Baseline_IOS_D_Passcode.json) |

> Choix du payload classique et non de la configuration déclarative du code d'accès (passcode_*). Les deux s'appliquent à iOS et aucun ne requiert la supervision, mais deux sources se contredisent au sujet de « pas de code simple ». Le catalogue Intune indique pour RequireComplexPasscode que le code doit aussi contenir un caractère autre que des chiffres et des lettres, ce qui rend impossible un code numérique à six chiffres ; le schéma d'Apple indique seulement que le code ne peut pas contenir de caractères répétés, croissants ou décroissants (comme 123 ou CBA), exactement ce que faisait allowSimple=false, et place l'exigence d'un caractère spécial sous une autre clé : MinimumComplexCharacters. Laquelle des deux décrit le comportement n'a pas été testé ici, donc le payload classique est conservé. C'est toutefois une question ouverte et non un point final, car Microsoft signale le payload Passcode classique comme deprecated depuis Apple OS 27. Le payload est ici le même que dans [Baseline] - MAC - D - Passcode and Screen Lock et dans les deux ensembles UniFy. Cinq minutes d'inactivité est plus strict que les quinze minutes vérifiées par Compliance Password ; un appareil avec cette policy est donc toujours conforme. Volontairement pas de maxpinageindays (NIST SP 800-63B : pas de rotation sans motif) ni de pinhistory. UniFy Corporate définit 1 minute et 5 tentatives ; un effacement après cinq tentatives est contraire à la règle normative de cette baseline.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Informations d'authentification<br>A.8.5 Authentification sécurisée<br>A.8.1 Terminaux finaux des utilisateurs |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 4.3 Configure Automatic Session Locking on Enterprise Assets<br>4.10 Enforce Automatic Device Lockout on Portable End-User Devices |
| NIST CSF 2.0 | PR.AA-03<br>PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 7

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `com.apple.mobiledevice.passwordpolicy_com.apple.mobiledevice.passwordpolicy` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mobiledevice.passwordpolicy_forcepin` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mobiledevice.passwordpolicy_allowsimple` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mobiledevice.passwordpolicy_minlength` | 6 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mobiledevice.passwordpolicy_maxgraceperiod` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mobiledevice.passwordpolicy_maxinactivity` | 5 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.mobiledevice.passwordpolicy_maxfailedattempts` | 10 |

---

Retour à la [vue d'ensemble iOS/iPadOS](../README.fr.md) · [README principal](../../../README.fr.md)
