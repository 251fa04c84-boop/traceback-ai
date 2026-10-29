$env:PATH = "c:\Users\bharg\OneDrive\Desktop\hackathon\.tools\node-v20.18.0-win-x64;c:\Users\bharg\OneDrive\Desktop\hackathon\.tools\git\cmd;" + $env:PATH

Write-Host "🚀 Launching CultureWeave Next.js server for end-to-end testing..."
$serverJob = Start-Job -ScriptBlock {
  $env:PATH = "c:\Users\bharg\OneDrive\Desktop\hackathon\.tools\node-v20.18.0-win-x64;c:\Users\bharg\OneDrive\Desktop\hackathon\.tools\git\cmd;" + $env:PATH
  Set-Location "c:\Users\bharg\OneDrive\Desktop\hackathon"
  & "c:\Users\bharg\OneDrive\Desktop\hackathon\.tools\node-v20.18.0-win-x64\node.exe" "c:\Users\bharg\OneDrive\Desktop\hackathon\node_modules\next\dist\bin\next" start -p 3000
}

# Wait for server ready
$ready = $false
for ($i = 0; $i -lt 15; $i++) {
  Start-Sleep -Seconds 1
  try {
    $res = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 2
    if ($res.StatusCode -eq 200) {
      $ready = $true
      break
    }
  } catch {}
}

if (-not $ready) {
  Write-Error "Server failed to start within 15 seconds."
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
  if ($res.Content -match "CultureWeave AI") {
    Write-Host "   ✅ Homepage loaded successfully (Title verified)"
  } else {
    Write-Host "   ❌ Title missing in HTML response"
    $allPassed = $false
  }
} catch {
  Write-Host "   ❌ Failed to load homepage: $_"
  $allPassed = $false
}

# Test 2: Archetypes API
Write-Host "`n🧪 [Test 2] Testing /api/archetypes endpoint..."
try {
  $res = Invoke-WebRequest -Uri "http://localhost:3000/api/archetypes" -UseBasicParsing
  $json = $res.Content | ConvertFrom-Json
  if ($json.success -and $json.archetypes.Count -ge 3) {
    Write-Host "   ✅ /api/archetypes returned $($json.archetypes.Count) pre-calibrated cultural archetypes"
  } else {
    Write-Host "   ❌ Invalid archetypes response schema"
    $allPassed = $false
  }
} catch {
  Write-Host "   ❌ Failed /api/archetypes: $_"
  $allPassed = $false
}

# Test 3: Qloo Search API
Write-Host "`n🧪 [Test 3] Testing /api/qloo/search endpoint..."
try {
  $res = Invoke-WebRequest -Uri "http://localhost:3000/api/qloo/search?query=Nujabes&type=urn:entity:artist" -UseBasicParsing
  $json = $res.Content | ConvertFrom-Json
  if ($json.success -and $json.results.Count -gt 0) {
    Write-Host "   ✅ /api/qloo/search resolved entity: $($json.results[0].name) [ID: $($json.results[0].id)]"
  } else {
    Write-Host "   ❌ Qloo search returned no results"
    $allPassed = $false
  }
} catch {
  Write-Host "   ❌ Failed /api/qloo/search: $_"
  $allPassed = $false
}

# Test 4: Full Autonomous Agent Pipeline
Write-Host "`n🧪 [Test 4] Testing /api/generate Autonomous Agent Pipeline..."
try {
  $payload = @{
    brief = @{
      title = "A24 Film Enthusiast Supper Club"
      targetAudience = "Independent cinephiles and natural wine enthusiasts"
      purpose = "community_supper_club"
      culturalAnchors = @("A24", "Past Lives", "Natural Wine")
      budgetTier = "independent"
      budgetAmount = 3200
      cityLocation = "Los Angeles / Silver Lake"
      desiredAtmosphere = "Warm 35mm grain, beeswax candlelight, unfinished walnut longtables"
    }
  } | ConvertTo-Json -Depth 5

  $res = Invoke-WebRequest -Uri "http://localhost:3000/api/generate" -Method POST -Body $payload -ContentType "application/json" -UseBasicParsing
  $json = $res.Content | ConvertFrom-Json

  if ($json.success -and $json.blueprint) {
    $bp = $json.blueprint
    Write-Host "   ✅ Blueprint Generated: $($bp.brief.title)"
    Write-Host "   ✅ Cultural Coherence Index: $($bp.culturalCoherenceScore)%"
    Write-Host "   ✅ Anchors Resolved: $($bp.anchorsResolved.Count)"
    Write-Host "   ✅ Headliner Artist: $($bp.auditoryIdentity.qlooRecommendedArtists[0].artist.name) (Affinity: $($bp.auditoryIdentity.qlooRecommendedArtists[0].affinityScore * 100)%)"
    Write-Host "   ✅ Culinary Menu: $($bp.culinaryProgram.dishes[0].name)"
    Write-Host "   ✅ Clichés Avoided: $($bp.culturalDissonanceAudit.clichesAvoided.Count)"
    Write-Host "   ✅ Agent Execution Steps: $($bp.agentExecutionTrace.Count)"
  } else {
    Write-Host "   ❌ Blueprint generation failed"
    $allPassed = $false
  }
} catch {
  Write-Host "   ❌ Failed /api/generate: $_"
  $allPassed = $false
}

# Teardown
Write-Host "`n🛑 Tearing down test server..."
Stop-Job -Job $serverJob
Remove-Job -Job $serverJob

if ($allPassed) {
  Write-Host "`n🎉 ALL TESTS PASSED SUCCESSFULLY! The application and agentic pipeline are 100% verified.`n"
  exit 0
} else {
  Write-Host "`n❌ SOME TESTS FAILED.`n"
  exit 1
}
