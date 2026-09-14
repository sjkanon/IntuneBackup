# DNS over HTTPS voor Windows

| | |
|---|---|
| **Controls** | ISO A.8.20 Netwerkbeveiliging, A.8.24 Gebruik van cryptografie · NIS2 art. 21(2)(h) cryptografie en versleuteling, art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie · CIS Controls v8.1 3.10 Encrypt Sensitive Data in Transit, 4.9 Configure Trusted DNS Servers on Enterprise Assets · NIST CSF 2.0 PR.DS-02 |
| **Fase** | *Allow* 2 (pilot) · *Require* 5 (alternatief, klantkeuze) |

## Waarom een script en geen template

Windows kent het groepsbeleid *Configure DNS over HTTPS (DoH) name resolution*
(`HKLM\SOFTWARE\Policies\Microsoft\Windows NT\DNSClient\DoHPolicy`). Die instelling bestaat
**niet** in de settings catalog: `pl4nty/intune-change-tracking` kent onder
`device_vendor_msft_policy_config_admx_dnsclient_*` alleen de klassieke DNS-clientinstellingen
(achtervoegsels, registratie, `turn_off_multicast` e.d.), geen DoH. ADMX-import zou kunnen, maar
dat type (`Admin`) vermijdt deze baseline. Daarom als remediation. De Edge-variant bestaat wél in
de catalog en staat als template-paar in `IntuneTemplate/WIN/SettingsCatalog/`
(`Microsoft Edge DNS over HTTPS Automatic` fase 2, `… Secure` fase 5).

| `DoHPolicy` | Betekenis | Hier |
|---:|---|---|
| 1 | DoH verbieden | — |
| 2 | DoH **toestaan**: Windows gebruikt DoH als de ingestelde DNS-server op de lijst van bekende DoH-servers staat (`netsh dns show encryption`), anders klassieke DNS | `Remediate-DoHPolicy.ps1 -Mode Allow` — fase 2 |
| 3 | DoH **vereisen**: geen naamresolutie zonder DoH-capabele server | `Remediate-DoHPolicy.ps1 -Mode Require` — fase 5 |

## Waarom *toestaan* de generieke keuze is

- **Interne resolvers.** Een domeincontroller of interne DNS-server staat niet op de lijst van
  bekende DoH-servers. Met *toestaan* blijft die gewoon via klassieke DNS werken; met *vereisen*
  werkt op zo'n netwerk geen enkele naam meer — dus ook de VPN-verbinding naar dat netwerk niet.
- **Openbare netwerken.** Op hotel- of thuiswifi met een DHCP-resolver als 1.1.1.1, 8.8.8.8 of
  9.9.9.9 versleutelt Windows vanzelf, zonder dat iemand een resolver hoeft te kiezen.
- **Captive portals** blijven werken met *toestaan*.

*Vereisen* hoort bij een organisatie die al haar DNS via een eigen of gecontracteerde DoH-resolver
(DNS-filterdienst) laat lopen, die ook split-DNS kan, en die de server-template per adapter of via
`netsh dns add encryption` vooraf uitrolt. Dat is een klantbesluit.

## Samenspel met Defender Network Protection

Network Protection (aan in `[Baseline] - WIN - D - Defender Antivirus`) blokkeert kwaadaardige
domeinen door DNS- en TLS-verkeer op het apparaat te inspecteren. DoH van **Windows zelf** loopt
via de DNS-client van het besturingssysteem en blijft zichtbaar voor Defender. DoH **binnen een
browser van derden** (Chrome, Firefox) omzeilt de DNS-client; Microsoft adviseert in de
Network Protection-documentatie om in die browsers DoH en QUIC uit te zetten. Edge valt daar niet
onder, omdat Edge SmartScreen gebruikt. Controleer het na uitrol met een testdomein van
`smartscreentestratings2.net` in Chrome.

## Uitrol

Intune admin center → **Devices → Scripts and remediations → Create**:

| Veld | Waarde |
|---|---|
| Naam | `[Baseline] - WIN - D - DNS over HTTPS Allow` (of `… Require`) |
| Detectiescript | `Detect-DoHPolicy.ps1`; pas `$Expected` bovenaan aan naar 2 (Allow) of 3 (Require) |
| Herstelscript | `Remediate-DoHPolicy.ps1` met `$Mode = 'Allow'` of `'Require'` bovenaan |
| Uitvoeren met aanmeldingsreferenties | Nee (SYSTEM) |
| 64-bits PowerShell | Ja |
| Schema | Dagelijks |
| Toewijzing | *Allow*: pilotgroep, daarna alle Windows-apparaten · *Require*: nooit naast *Allow* |

Terugdraaien: verwijder de waarde `DoHPolicy` (of zet hem op 2) en herstart de DNS-client
(`Restart-Service Dnscache -Force` of een herstart).
