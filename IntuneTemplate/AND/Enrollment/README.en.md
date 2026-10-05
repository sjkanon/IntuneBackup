[Nederlands](README.md) · **English** · [Français](README.fr.md)

# Android enrollment restrictions

An enrollment restriction decides *before* enrollment whether a device is allowed in at all.
The compliance policies in `IntuneTemplate/AND/` then decide whether the device is secure enough.
There are two decisions here.

## 1. Allow Android Enterprise, including personal — `AND-Allow-Android-Enterprise.json`

`platformType: androidForWork` covers all Android Enterprise forms: personal work profile,
corporate-owned work profile, fully managed and dedicated. `personalDeviceEnrollmentBlocked:
false` allows the personal work profile — otherwise an employee with their own phone can
only work via App Protection without enrollment, and then the work profile policies
(Work Profile Restrictions, Compliance Device Health/Password) never apply.

Blocking personal enrollment only affects the personal work profile; corporate
enrollments (QR code, zero-touch, Knox Mobile Enrollment) bypass this restriction.

No minimum OS version in the restriction: that is in the compliance policies, where a user gets a
notification instead of a failed enrollment without explanation.

## 2. Block device administrator — in the portal

Device administrator has been phased out by Google and Intune no longer supports it since 31 December
2024 on devices with Google Mobile Services. Not a single Android policy in the
baseline works on such a device. Shut it off:

**Intune → Devices → Enrollment → Device platform restrictions → Android** → the
default restriction (*All users*) → *Android device administrator*: **Platform: Block**.

There is deliberately **no JSON** for this here. The Graph value for it (`platformType: "android"` on
the same type) could not be verified in this round against a source export or the
pl4nty definitions, and the default restriction already exists in every tenant (you update it with
PATCH, not with a new POST). Devices already enrolled with device administrator
are caught by `[Baseline] - AND - U - Compliance Block Device Administrator`.

## Deploying

```http
POST https://graph.microsoft.com/beta/deviceManagement/deviceEnrollmentConfigurations
Content-Type: application/json

<contents of AND-Allow-Android-Enterprise.json>
```

Then assign it — a custom restriction without an assignment does nothing:

```http
POST https://graph.microsoft.com/beta/deviceManagement/deviceEnrollmentConfigurations/{id}/assign
Content-Type: application/json

{ "enrollmentConfigurationAssignments": [ { "target": {
    "@odata.type": "#microsoft.graph.groupAssignmentTarget",
    "groupId": "GEBRUIKERSGROEP-ID-INVULLEN" } } ] }
```

Or in the portal: the same place as above → *Create restriction* → Android Enterprise.

Note: `priority` is not always carried over on import. After creating it, check that
this restriction is *above* the default restriction (lower number = higher), otherwise the
default wins.

## Order for a first Android enrollment

1. Connect Managed Google Play (Intune → Devices → Android → Android Enterprise) and approve Outlook,
   Edge, Teams, Authenticator and — with a Defender licence — Microsoft Defender.
2. Enrollment restrictions (this folder).
3. [App configuration](../AppConfiguration/README.en.md), once the apps from step 1 are in Intune.
4. Assign the phase 3 policies from [`IntuneTemplate/AND/`](../README.en.md).
