[Nederlands](README.md) · **English** · [Français](README.fr.md)

# Apple Business checklist

The settings in Apple Business (Manager) that the macOS baseline relies on. Not a template —
Apple Business has no API with which this could be deployed from a repo — but a checklist,
because a mistake here does not become visible in Intune until a Mac no longer enrols.

Applies to corporate Macs via Automated Device Enrollment (ADE): the profiles in
[`IntuneTemplate/MAC/Enrollment/ade-profile/`](../ade-profile/README.en.md) and the
`MAC - D - Enrollment Profile …` policies assume this is in place.

## 1. Organisation and administrators

| Setting | Advice | Why |
|---|---|---|
| Administrators | at least two accounts with the *Administrator* role, personal (no shared account) | a single administrator who leaves or loses access brings tokens and device management to a halt |
| Emergency account | one *Administrator* that is **not** federated, with a strong password and two-factor authentication, in the vault | if Entra ID or the federation fails, nobody with a federated account can get into Apple Business any more |
| Roles | *Device Manager* for the service desk (assigning devices), *Content Manager* for apps; *Administrator* only for whoever manages tokens and federation | least privilege (A.8.2) |
| Two-factor authentication | on for all non-federated administrators | Apple Business controls who may take over your Macs |

## 2. Managed Apple Accounts and federation with Microsoft Entra ID

| Setting | Advice |
|---|---|
| Domain | verify the organisation's mail domain (DNS TXT) |
| Federated authentication | link with Microsoft Entra ID. Users sign in with their Entra account as a Managed Apple Account; password, MFA and Conditional Access come from Entra |
| Directory sync | on (via Entra), so a disabled Entra account also disables the Managed Apple Account |
| **Domain capture** | on: nobody can create a personal Apple Account with the company domain any more. Existing personal accounts with that domain get a request from Apple to change their email address — tell users in advance |
| iCloud services for Managed Apple Accounts | only what the organisation uses; the baseline already turns off iCloud sync on the Mac (`MAC - D - Restrictions`) |

Why: without federation and domain capture, personal Apple Accounts appear on the
company address that the organisation cannot revoke, and offboarding runs through two systems.

## 3. MDM server and assignment

| Step | Where |
|---|---|
| Add Intune as MDM server: download the public key in Intune (Devices → Enrollment → Apple → **Enrollment program tokens** → Add), create an MDM server in Apple Business with that key, upload the server token (`.p7m`) back into Intune | Apple Business → Preferences → MDM servers |
| **Default MDM server for Mac** set to this Intune server | Apple Business → Preferences → Device management assignment. Without a default, a newly bought Mac does not end up in Intune by itself |
| Link purchases | record the Apple customer number or reseller ID, so Macs from Apple and authorised resellers appear in Apple Business automatically |
| Existing Macs | add with Apple Configurator for iPhone; such a Mac has a 30-day provisional period in which the user can remove it from management |
| Enrollment profile | attach it to the token in Intune and set it as default (`IntuneTemplate/MAC/Enrollment/ade-profile/`), before the first Mac is switched on |

## 4. Tokens and certificates that expire yearly

None of the three warns loudly. Set a recurring calendar appointment **30 days before** the expiry date
and check Tenant administration → Connectors and tokens in Intune.

| What | Valid | On expiry | Renew |
|---|---|---|---|
| Apple MDM Push Certificate (APNs) | 1 year | Intune can no longer reach any Apple device; 30 days past the date all Apple devices have to be enrolled again | with the **same** Apple Account it was created with — use a Managed Apple Account or a functional account on a shared mailbox, never an administrator's personal account |
| ADE server token | 1 year | new Macs no longer enrol via ADE; existing ones keep working | download a new token in Apple Business, upload it to the same token in Intune (do not create a new token — the profile assignments come loose) |
| Apps and Books location token (VPP) | 1 year | no new app licences or updates via Intune | download a new token, upload it to the existing location in Intune |

The Apple Account for APNs is the most vulnerable point of the whole Apple setup: whoever loses that
account loses management of all Apple devices. Record in the ISMS *which* account it
is and who has access to it (A.5.17).

## 5. Apps and Books

- License apps **per device** (device-based assignment in Intune): no Apple
  Account is then needed on the Mac and the licence stays with the device.
- Only link the Apps and Books location that belongs to this tenant to Intune — linking one location
  to two MDMs causes licence conflicts.

## 6. End of life

A Mac leaving the organisation (sale, lease return):

1. wipe or retire it in Intune — that also clears the Recovery Lock (see `MAC - D - Recovery Lock`);
2. **release** it in Apple Business (Release from organization); otherwise the Mac ends up in Intune
   for the new owner when it is switched on;
3. Activation Lock: check that no personal Apple Account is still attached to the Mac.

## Standards

A.5.9 Inventory of information and other associated assets, A.5.11 Return of assets, A.5.16
Identity management, A.5.17 Authentication information, A.5.23 Information security for use
of cloud services, A.8.2 Privileged access rights; NIS2 art. 21(2)(i) and (j); CIS Controls v8.1
1.1, 5.4 Restrict Administrator Privileges to Dedicated Administrator Accounts, 6.7 Centralize
Access Control; NIST CSF 2.0 ID.AM-01, PR.AA-01, PR.AA-05.
