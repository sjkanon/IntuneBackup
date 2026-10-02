#Requires -Modules ExchangeOnlineManagement, Microsoft.Graph.Authentication
<#
.SYNOPSIS
Does the two tenant steps of the Defender for Office 365 baseline that CIPP has no standard for:
turns off the Standard/Strict preset security policies and, only when asked, fills the VIP list
for impersonation.

.DESCRIPTION
BaselineTemplate/Defender-Office365.json creates custom policies through CIPP standards. Two
things around it cannot be done by a CIPP standard, so this script does them:

1. Preset security policies off. A Standard or Strict preset that is assigned takes precedence
   over every custom policy, so the CIPP policies silently stop applying while CIPP still reports
   them as compliant. This disables the preset rules (EOP and Defender for Office 365 parts); the
   presets themselves stay, so you can turn them back on in the Defender portal.
2. VIPs in the anti-phishing policy — only with -VipGroupName; by default a tenant has no VIPs and
   this step is skipped. The members of that Entra group become
   TargetedUsersToProtect on the CIPP anti-phishing policy: mail that impersonates them goes to
   quarantine. CIPP does not compare that list, so its remediation does not wipe it. The list is
   replaced by the group membership, so the group is the source; Microsoft allows at most 350.

Connects to Exchange Online and Microsoft Graph itself when there is no connection yet. Run it
first with -WhatIf.

.PARAMETER VipGroupName
Display name of the Entra group with the VIPs. Without it the VIP list is left alone. Stops with
an error when the group does not exist.

.PARAMETER PolicyName
Name of the anti-phishing policy from the baseline. When it is not found, the names CIPP adopts
instead are tried: 'CIPP Default Anti-Phishing Policy' and 'Default Anti-Phishing Policy'.

.PARAMETER SkipPresets
Leaves the preset security policies alone.

.EXAMPLE
./Set-DefenderOfficeTenant.ps1 -WhatIf

.EXAMPLE
./Set-DefenderOfficeTenant.ps1 -VipGroupName 'SEC-Directie'
#>
[CmdletBinding(SupportsShouldProcess, ConfirmImpact = 'Medium')]
param(
    [string]$VipGroupName,
    [string]$PolicyName = 'CXNM - Standard - Anti-Phishing',
    [switch]$SkipPresets
)

$ErrorActionPreference = 'Stop'
$MaxVips = 350

if (-not (Get-ConnectionInformation | Where-Object { $_.State -eq 'Connected' })) {
    Connect-ExchangeOnline -ShowBanner:$false
}

if (-not $SkipPresets) {
    # Each preset is two rules: the EOP part (anti-spam, anti-malware, anti-phish) and the
    # Defender for Office 365 part (Safe Links, Safe Attachments, impersonation).
    $presets = @('Standard Preset Security Policy', 'Strict Preset Security Policy')
    foreach ($name in $presets) {
        foreach ($kind in 'EOP', 'ATP') {
            $rule = & "Get-$($kind)ProtectionPolicyRule" -Identity $name -ErrorAction SilentlyContinue
            if (-not $rule) {
                Write-Host "$name ($kind): not present" -ForegroundColor DarkGray
                continue
            }
            if ($rule.State -ne 'Enabled') {
                Write-Host "$name ($kind): already off" -ForegroundColor DarkGray
                continue
            }
            if ($PSCmdlet.ShouldProcess("$name ($kind)", 'Disable preset rule')) {
                & "Disable-$($kind)ProtectionPolicyRule" -Identity $name -Confirm:$false
                Write-Host "$name ($kind): turned off" -ForegroundColor Green
            }
        }
    }
}

if ($VipGroupName) {
    $candidates = @($PolicyName, 'CIPP Default Anti-Phishing Policy', 'Default Anti-Phishing Policy') | Select-Object -Unique
    $policy = $null
    foreach ($candidate in $candidates) {
        $policy = Get-AntiPhishPolicy -Identity $candidate -ErrorAction SilentlyContinue
        if ($policy) { break }
    }
    if (-not $policy) {
        throw "No anti-phishing policy found ($($candidates -join ', ')). Has the CIPP baseline run in this tenant?"
    }

    if (-not (Get-MgContext)) {
        Connect-MgGraph -Scopes 'GroupMember.Read.All' -NoWelcome
    }
    $filter = [uri]::EscapeDataString("displayName eq '$($VipGroupName -replace "'", "''")'")
    $groups = @((Invoke-MgGraphRequest -Method GET -Uri "https://graph.microsoft.com/v1.0/groups?`$filter=$filter&`$select=id,displayName").value)
    if ($groups.Count -eq 0) {
        throw "Group '$VipGroupName' does not exist."
    } elseif ($groups.Count -gt 1) {
        throw "Group name '$VipGroupName' is not unique ($($groups.Count) groups)."
    } else {
        $uri = "https://graph.microsoft.com/v1.0/groups/$($groups[0].id)/transitiveMembers/microsoft.graph.user?`$select=displayName,mail&`$top=999"
        $members = [System.Collections.Generic.List[object]]::new()
        while ($uri) {
            $page = Invoke-MgGraphRequest -Method GET -Uri $uri
            $page.value | ForEach-Object { $members.Add($_) }
            $uri = $page.'@odata.nextLink'
        }
        $noMail = @($members | Where-Object { -not $_.mail })
        if ($noMail.Count -gt 0) {
            Write-Warning "$($noMail.Count) member(s) without a mail address skipped: $(($noMail.displayName) -join ', ')"
        }
        # TargetedUsersToProtect takes "Display name;address". A ';' in the name would break that.
        $vips = @($members | Where-Object { $_.mail } | Sort-Object mail -Unique | ForEach-Object { "$($_.displayName -replace ';', ' ');$($_.mail)" })
        if ($vips.Count -gt $MaxVips) {
            throw "'$VipGroupName' has $($vips.Count) members with mail; impersonation protection allows at most $MaxVips."
        }

        $current = @($policy.TargetedUsersToProtect | Sort-Object)
        $wanted = @($vips | Sort-Object)
        if (-not (Compare-Object $current $wanted) -and $policy.EnableTargetedUserProtection) {
            Write-Host "$($policy.Name): VIP list already matches '$VipGroupName' ($($wanted.Count))" -ForegroundColor DarkGray
        } elseif ($PSCmdlet.ShouldProcess($policy.Name, "Set $($wanted.Count) VIP(s) from '$VipGroupName'")) {
            $params = @{ Identity = $policy.Name; TargetedUsersToProtect = $wanted; EnableTargetedUserProtection = $true }
            if ($wanted.Count -eq 0) { $params.TargetedUsersToProtect = $null }
            Set-AntiPhishPolicy @params
            Write-Host "$($policy.Name): $($wanted.Count) VIP(s) from '$VipGroupName'" -ForegroundColor Green
        }
    }
}
