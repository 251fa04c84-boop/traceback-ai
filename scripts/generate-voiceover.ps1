Add-Type -AssemblyName System.Speech

$voiceDir = "c:\Users\bharg\OneDrive\Desktop\hackathon\video_assets\voice"
if (-not (Test-Path $voiceDir)) {
  New-Item -ItemType Directory -Path $voiceDir -Force
}

$scenes = @(
  @{
    id = "scene1_hook"
    text = "AI can generate thousands of ideas. But can it understand what makes a culture truly resonate?"
  },
  @{
    id = "scene2_problem"
    text = "Generic AI often combines popular references without understanding how music, food, fashion, and atmosphere actually connect."
  },
  @{
    id = "scene3_intro"
    text = "Meet CultureWeave AI. A cultural experience architect powered by Qloo's taste graph."
  },
  @{
    id = "scene4_demo"
    text = "Simply choose a cultural direction, define your audience and budget, and let CultureWeave build a complete experience blueprint."
  },
  @{
    id = "scene5_output"
    text = "From music and culinary direction to atmosphere, activations, and production planning, every element is designed to work together."
  },
  @{
    id = "scene6_qloo"
    text = "By grounding recommendations in cultural intelligence, CultureWeave helps creative teams move beyond clichés toward authentic subculture resonance."
  },
  @{
    id = "scene7_closing"
    text = "CultureWeave AI. Giving agents a better sense of taste."
  }
)

$ffmpeg = "C:\Users\bharg\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe"

foreach ($s in $scenes) {
  $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
  $synth.SelectVoice("Microsoft David Desktop")
  $synth.Rate = 0  # Standard human conversational rate
  $synth.Volume = 100

  $wavPath = Join-Path $voiceDir "$($s.id).wav"
  $synth.SetOutputToWaveFile($wavPath)
  $synth.Speak($s.text)
  $synth.Dispose()

  Write-Host "Generated: $wavPath"
}

Write-Host "All voiceover clips generated successfully!"
