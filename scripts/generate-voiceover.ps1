Add-Type -AssemblyName System.Speech

$voiceDir = "c:\Users\bharg\OneDrive\Desktop\hackathon\video_assets\voice"
if (-not (Test-Path $voiceDir)) {
  New-Item -ItemType Directory -Path $voiceDir -Force
}

$scenes = @(
  @{
    id = "scene1_alert"
    text = "It is 2 AM, and your production checkout service is failing for over 40% of paying customers. Generic chatbots cannot help you here, because they lack real tools, telemetry, and execution safety. What engineers need is an agent-native incident workspace."
  },
  @{
    id = "scene2_telemetry"
    text = "Meet TraceBack AI, built on Builder.io's Agent-Native architecture. Human engineers and the autonomous AI agent act as equal peers, sharing the exact same action primitives for logs, deployment diffs, and system metrics."
  },
  @{
    id = "scene3_investigation"
    text = "With a single click, TraceBack AI launches an autonomous multi-phase investigation. It inspects container logs, analyzes recent continuous deployment diffs, and formulates a root cause hypothesis grounded in verified code evidence."
  },
  @{
    id = "scene4_approval"
    text = "Crucially, the agent cannot execute mutating commands without human consent. TraceBack AI presents the proposed rollback action, its blast radius, and supporting evidence for explicit operator authorization."
  },
  @{
    id = "scene5_resolution"
    text = "Once approved, the rollback executes, and deterministic health probes verify that error rates have dropped back to nominal levels. With complete audit trails and automated post-mortems, TraceBack AI delivers real agent-native reliability."
  }
)

Write-Host "🎤 Generating offline neural voiceover via System.Speech..."
foreach ($s in $scenes) {
  $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
  $synth.SelectVoice("Microsoft David Desktop")
  $synth.Rate = 0  # Standard human conversational rate
  $synth.Volume = 100

  $wavPath = Join-Path $voiceDir "$($s.id).wav"
  Write-Host "   -> Generating: $($s.id).wav"
  $synth.SetOutputToWaveFile($wavPath)
  $synth.Speak($s.text)
  $synth.Dispose()
}

Write-Host "✅ All 5 voiceover tracks generated successfully in $voiceDir"
