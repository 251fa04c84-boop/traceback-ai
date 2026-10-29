$env:PATH = "c:\Users\bharg\OneDrive\Desktop\hackathon\.tools\node-v20.18.0-win-x64;c:\Users\bharg\OneDrive\Desktop\hackathon\.tools\git\cmd;" + $env:PATH

Write-Host "🚀 Launching TraceBack AI Next.js server for end-to-end verification..."
$serverJob = Start-Job -ScriptBlock {
  $env:PATH = "c:\Users\bharg\OneDrive\Desktop\hackathon\.tools\node-v20.18.0-win-x64;c:\Users\bharg\OneDrive\Desktop\hackathon\.tools\git\cmd;" + $env:PATH
  Set-Location "c:\Users\bharg\OneDrive\Desktop\hackathon"
  & "c:\Users\bharg\OneDrive\Desktop\hackathon\.tools\node-v20.18.0-win-x64\node.exe" "c:\Users\bharg\OneDrive\Desktop\hackathon\node_modules\next\dist\bin\next" dev -p 3000
}

# Wait for server ready (up to 30 seconds)
$ready = $false
for ($i = 0; $i -lt 30; $i++) {
  Start-Sleep -Seconds 1
  try {
    $res = Invoke-WebRequest -Uri "http://localhost:3000/api/incidents" -UseBasicParsing -TimeoutSec 2
    if ($res.StatusCode -eq 200) {
      $ready = $true
      break
    }
  } catch {}
}

if (-not $ready) {
  Write-Error "Server failed to start within 30 seconds."
  Receive-Job -Job $serverJob
  Stop-Job -Job $serverJob
  Remove-Job -Job $serverJob
  exit 1
}

Write-Host "✅ Server is live on http://localhost:3000!`n"

$allPassed = $true

# Test 1: Homepage
Write-Host "🧪 [Test 1] Testing Homepage HTML & UI..."
try {
  $res = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing
  if ($res.Content -match "TraceBack AI") {
    Write-Host "   ✅ Homepage loaded successfully (Brand & UI verified)"
  } else {
    Write-Host "   ❌ Title missing in HTML response"
    $allPassed = $false
  }
} catch {
  Write-Host "   ❌ Failed to load homepage: $_"
  $allPassed = $false
}

# Test 2: GET /api/incidents
Write-Host "`n🧪 [Test 2] Testing /api/incidents endpoint..."
try {
  $res = Invoke-WebRequest -Uri "http://localhost:3000/api/incidents" -UseBasicParsing
  $json = $res.Content | ConvertFrom-Json
  if ($json.incidents.Count -eq 3) {
    Write-Host "   ✅ /api/incidents returned $($json.incidents.Count) production scenarios"
  } else {
    Write-Host "   ❌ Expected 3 incidents, received $($json.incidents.Count)"
    $allPassed = $false
  }
} catch {
  Write-Host "   ❌ Failed /api/incidents: $_"
  $allPassed = $false
}

# Test 3: POST /api/agent (Start Investigation)
Write-Host "`n🧪 [Test 3] Testing Autonomous Agent Investigation Pipeline..."
try {
  $body = @{ action = "start"; incidentId = "inc-8921" } | ConvertTo-Json
  $res = Invoke-RestMethod -Uri "http://localhost:3000/api/agent" -Method Post -Body $body -ContentType "application/json"
  if ($res.session.steps.Count -eq 5 -and $res.session.isAwaitingApproval -eq $true) {
    Write-Host "   ✅ Agent completed 5 investigation steps and halted at Human Approval Gate"
    Write-Host "   ✅ Proposed Action: $($res.session.proposedAction.actionId) (Release: $($res.session.proposedAction.params.releaseId))"
  } else {
    Write-Host "   ❌ Agent investigation pipeline did not halt for approval correctly"
    $allPassed = $false
  }
} catch {
  Write-Host "   ❌ Failed agent investigation: $_"
  $allPassed = $false
}

# Test 4: POST /api/agent (Human Approval & Deterministic Verification)
Write-Host "`n🧪 [Test 4] Testing Human Approval & Deterministic Verification Probe..."
try {
  $body = @{ action = "approve"; incidentId = "inc-8921"; approved = $true; approverName = "Lead SRE" } | ConvertTo-Json
  $res = Invoke-RestMethod -Uri "http://localhost:3000/api/agent" -Method Post -Body $body -ContentType "application/json"
  if ($res.session.verificationVerdict -eq "HEALTHY_CONFIRMED" -and $res.session.postMortemReport) {
    Write-Host "   ✅ Action executed, deterministic probe passed: HEALTHY_CONFIRMED"
    Write-Host "   ✅ Generated Post-Mortem Report with MTTR metrics"
  } else {
    Write-Host "   ❌ Verification verdict failed: $($res.session.verificationVerdict)"
    $allPassed = $false
  }
} catch {
  Write-Host "   ❌ Failed approval execution: $_"
  $allPassed = $false
}

# Test 5: POST /api/actions (Direct defineAction Dispatch)
Write-Host "`n🧪 [Test 5] Testing Direct Agent-Native Action Dispatch..."
try {
  $body = @{ actionId = "checkServiceHealth"; input = @{ incidentId = "inc-8921" } } | ConvertTo-Json
  $res = Invoke-RestMethod -Uri "http://localhost:3000/api/actions" -Method Post -Body $body -ContentType "application/json"
  if ($res.success -and $res.data.isResolved -eq $true) {
    Write-Host "   ✅ Direct checkServiceHealth action executed successfully and verified resolved"
  } else {
    Write-Host "   ❌ Direct action dispatch failed"
    $allPassed = $false
  }
} catch {
  Write-Host "   ❌ Failed action dispatch: $_"
  $allPassed = $false
}

# Teardown server
Stop-Job -Job $serverJob
Remove-Job -Job $serverJob

# Kill any leftover node dev server processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*next*dev*" } | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "`n======================================================"
if ($allPassed) {
  Write-Host "🎉 ALL E2E SERVER & AGENT-NATIVE TESTS PASSED (5/5)!" -ForegroundColor Green
  exit 0
} else {
  Write-Host "❌ SOME E2E TESTS FAILED" -ForegroundColor Red
  exit 1
}
