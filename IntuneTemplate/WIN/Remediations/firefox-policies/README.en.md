[Nederlands](README.md) · **English** · [Français](README.fr.md)

# Firefox policies

| | |
|---|---|
| **Controls** | ISO A.8.7 Protection against malware, A.8.8 Management of technical vulnerabilities, A.8.12 Data leakage prevention, A.8.19 Installation of software on operational systems · NIS2 art. 21(2)(e) security in network and information systems acquisition, development and maintenance, including vulnerability handling · CIS Controls v8.1 7.4 Perform Automated Application Patch Management, 9.1 Ensure Use of Only Fully Supported Browsers and Email Clients, 9.4 Restrict Unnecessary or Unauthorized Browser and Email Client Extensions · NIST CSF 2.0 PR.PS-02, PR.PS-05 |
| **Phase** | 2 (pilot) · extension block separate, also phase 2 |

The Firefox counterpart of three templates in `IntuneTemplate/WIN/SettingsCatalog/`:
`Google Chrome Security`, `Google Chrome Updates` and `Google Chrome Extensions`.

## Why a script and not a template

Chrome and Edge are in the settings catalog, Firefox is not: `pl4nty/intune-change-tracking` has
no Mozilla definitions at all. What Mozilla documents as "Windows (Intune)" is an OMA-URI with
ADMX ingestion, or an ADMX import per tenant — the latter produces `groupPolicyConfigurations`
with definition ids that differ per tenant, and this baseline avoids that type (`Admin`).
Firefox, however, reads its policies itself from `HKLM\SOFTWARE\Policies\Mozilla\Firefox`,
without ADMX. A remediation that sets those values therefore works in every tenant, and its
detection also reports when someone reverts them.

## What gets set

All values per the [Mozilla policy templates](https://mozilla.github.io/policy-templates/)
(v8.3, September 2026). The choices are those of the Chrome templates.

| Value | What | Chrome counterpart |
|---|---|---|
| `DisableAppUpdate` = 0, `AppAutoUpdate` = 1, `BackgroundAppUpdate` = 1 | Firefox updates itself, also when it is not running | Google Chrome Updates |
| `DisableSecurityBypass\InvalidCertificate` = 1 | No exception for an invalid certificate | `SSLErrorOverrideAllowed` = 0 |
| `DisableSecurityBypass\SafeBrowsing` = 1 | A Safe Browsing warning cannot be clicked through | `DisableSafeBrowsingProceedAnyway` = 1 |
| `DNSOverHTTPS\Enabled` = 0, `Locked` = 1 | DoH off and locked | `DnsOverHttpsMode` = off |
| `Preferences`: `network.http.http3.enable` = false, locked | QUIC/HTTP3 off | `QuicAllowed` = 0 |
| `PasswordManagerEnabled` = 0 | No password manager; Edge is the managed one | `PasswordManagerEnabled` = 0 |
| `DisableFirefoxAccounts` = 1 | No Mozilla account and therefore no sync to a personal account | `BrowserSignin` = 0, `SyncDisabled` = 1 |
| `DisableTelemetry` = 1 | No telemetry to Mozilla | — |
| `ExtensionSettings`: `"*"` = blocked — only with `$BlockExtensions = $true` | All extensions blocked | Google Chrome Extensions |

DoH and QUIC are turned off for the same reason as in Chrome: Defender Network Protection can only
inspect traffic from a third-party browser through DNS and TLS, and Microsoft advises turning both
off (see [`dns-over-https/`](../dns-over-https/README.en.md#interaction-with-defender-network-protection)).

## Before rolling out

- **Passwords.** Unlike in Chrome, `PasswordManagerEnabled` = 0 in Firefox also blocks `about:logins`,
  the overview of passwords already saved. Have users export them or import them
  into Edge first.
- **Extensions.** `"installation_mode": "blocked"` on `"*"` blocks new extensions **and removes
  the extensions already installed**. That is why it sits behind `$BlockExtensions`, off by
  default. Take inventory first (Defender Vulnerability Management → Browser extensions), then
  build an allowlist by adding `"installation_mode": "allowed"` per extension id to the JSON in
  both scripts.
- **Existing `Preferences`.** An organisation that already sets Firefox preferences through
  group policy or `policies.json` must merge that JSON with the one in these scripts: the
  `Preferences` value is overwritten as a whole.
- **Firefox ESR.** The same key applies to ESR. For an organisation that packages ESR updates
  itself, set `DisableAppUpdate` to 1 in both scripts instead.

## Deployment

Intune admin center → **Devices → Scripts and remediations → Create**:

| Field | Value |
|---|---|
| Name | `CXNM - Standard - WIN - D - Mozilla Firefox Policies` |
| Detection script | `Detect-FirefoxPolicies.ps1` |
| Remediation script | `Remediate-FirefoxPolicies.ps1` — `$Policies` and `$BlockExtensions` identical to the detection script |
| Run using logged-on credentials | No (SYSTEM) |
| 64-bit PowerShell | Yes |
| Schedule | Daily |
| Assignment | Pilot group `SEC-Baseline-Pilot`, then all Windows devices. On a device without Firefox it only writes registry values. |

A running Firefox picks up the policies after a restart. Check with `about:policies`.

Rollback: remove `HKLM\SOFTWARE\Policies\Mozilla\Firefox` and restart Firefox.
