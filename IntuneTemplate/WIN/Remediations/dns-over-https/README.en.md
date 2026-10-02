[Nederlands](README.md) · **English** · [Français](README.fr.md)

# DNS over HTTPS for Windows

| | |
|---|---|
| **Controls** | ISO A.8.20 Networks security, A.8.24 Use of cryptography · NIS2 art. 21(2)(h) cryptography and encryption, art. 21(2)(j) multi-factor authentication and secured communications · CIS Controls v8.1 3.10 Encrypt Sensitive Data in Transit, 4.9 Configure Trusted DNS Servers on Enterprise Assets · NIST CSF 2.0 PR.DS-02 |
| **Phase** | *Allow* 2 (pilot) · *Require* 5 (alternative, organisational decision) |

## Why a script and not a template

Windows has the group policy *Configure DNS over HTTPS (DoH) name resolution*
(`HKLM\SOFTWARE\Policies\Microsoft\Windows NT\DNSClient\DoHPolicy`). That setting does
**not** exist in the settings catalog: under `device_vendor_msft_policy_config_admx_dnsclient_*`
`pl4nty/intune-change-tracking` only has the classic DNS client settings
(suffixes, registration, `turn_off_multicast` etc.), no DoH. ADMX import would be possible, but
this baseline avoids that type (`Admin`). Hence a remediation. The Edge variant *does* exist in
the catalog and is included as a template pair in `IntuneTemplate/WIN/SettingsCatalog/`
(`Microsoft Edge DNS over HTTPS Automatic` phase 2, `… Secure` phase 5).

| `DoHPolicy` | Meaning | Here |
|---:|---|---|
| 1 | Prohibit DoH | — |
| 2 | **Allow** DoH: Windows uses DoH if the configured DNS server is on the list of known DoH servers (`netsh dns show encryption`), otherwise classic DNS | `Remediate-DoHPolicy.ps1 -Mode Allow` — phase 2 |
| 3 | **Require** DoH: no name resolution without a DoH-capable server | `Remediate-DoHPolicy.ps1 -Mode Require` — phase 5 |

## Why *allow* is the generic choice

- **Internal resolvers.** A domain controller or internal DNS server is not on the list of
  known DoH servers. With *allow* it keeps working via classic DNS; with *require*
  no name resolves at all on such a network — so neither does the VPN connection to that network.
- **Public networks.** On hotel or home Wi-Fi with a DHCP resolver such as 1.1.1.1, 8.8.8.8 or
  9.9.9.9, Windows encrypts automatically, without anyone having to choose a resolver.
- **Captive portals** keep working with *allow*.

*Require* suits an organisation that routes all its DNS through its own or a contracted DoH resolver
(DNS filtering service), which also supports split DNS, and that deploys the server template per adapter or via
`netsh dns add encryption` in advance. That is an organisational decision.

## Interaction with Defender Network Protection

Network Protection (enabled in `CXNM - Standard - WIN - D - Defender Antivirus`) blocks malicious
domains by inspecting DNS and TLS traffic on the device. DoH of **Windows itself** goes
through the operating system's DNS client and remains visible to Defender. DoH **inside a
third-party browser** (Chrome, Firefox) bypasses the DNS client; in the
Network Protection documentation Microsoft advises disabling DoH and QUIC in those browsers. Edge does not fall
under this, because Edge uses SmartScreen. In Chrome `CXNM - Standard - WIN - D - Google Chrome Security` turns them off, in Firefox
[`firefox-policies/`](../firefox-policies/README.en.md). Check it after deployment with a test domain from
`smartscreentestratings2.net` in Chrome.

## Deployment

Intune admin center → **Devices → Scripts and remediations → Create**:

| Field | Value |
|---|---|
| Name | `CXNM - Standard - WIN - D - DNS over HTTPS Allow` (or `… Require`) |
| Detection script | `Detect-DoHPolicy.ps1`; set `$Expected` at the top to 2 (Allow) or 3 (Require) |
| Remediation script | `Remediate-DoHPolicy.ps1` with `$Mode = 'Allow'` or `'Require'` at the top |
| Run this script using the logged-on credentials | No (SYSTEM) |
| 64-bit PowerShell | Yes |
| Schedule | Daily |
| Assignment | *Allow*: pilot group, then all Windows devices · *Require*: never alongside *Allow* |

Rolling back: remove the `DoHPolicy` value (or set it to 2) and restart the DNS client
(`Restart-Service Dnscache -Force` or a restart).
