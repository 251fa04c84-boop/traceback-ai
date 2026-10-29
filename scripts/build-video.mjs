import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const assetsDir = path.join(projectRoot, 'video_assets');
const voiceDir = path.join(assetsDir, 'voice');
const segsDir = path.join(assetsDir, 'segments');

if (!fs.existsSync(segsDir)) {
  fs.mkdirSync(segsDir, { recursive: true });
}

const ffmpeg = 'C:\\Users\\bharg\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffmpeg.exe';

console.log('⚡ Starting Fast & High-Definition TraceBack AI Video Assembly...');

const scenes = [
  {
    id: 'seg1',
    image: path.join(assetsDir, 'scene1_alert.png'),
    audio: path.join(voiceDir, 'scene1_alert.wav'),
    duration: 9.0,
    title: "Production Outage: 42% Error Spike at 2 AM"
  },
  {
    id: 'seg2',
    image: path.join(assetsDir, 'scene2_telemetry.png'),
    audio: path.join(voiceDir, 'scene2_telemetry.wav'),
    duration: 8.5,
    title: "Builder.io Agent-Native Symmetrical Action Primitives"
  },
  {
    id: 'seg3',
    image: path.join(assetsDir, 'scene3_investigation.png'),
    audio: path.join(voiceDir, 'scene3_investigation.wav'),
    duration: 8.5,
    title: "Autonomous 5-Phase Investigation & Evidence Grounding"
  },
  {
    id: 'seg4',
    image: path.join(assetsDir, 'scene4_approval.png'),
    audio: path.join(voiceDir, 'scene4_approval.wav'),
    duration: 7.5,
    title: "Human Approval Gate: Blast Radius & Action Authorization"
  },
  {
    id: 'seg5',
    image: path.join(assetsDir, 'scene5_resolution.png'),
    audio: path.join(voiceDir, 'scene5_resolution.wav'),
    duration: 8.5,
    title: "Deterministic Verification Probe & Automated Post-Mortem"
  }
];

// Fallback image in case an asset is missing
const fallbackImage = path.join(assetsDir, 'scene1_alert.png');

console.log('\n🎬 Step 1: Encoding individual scene segments with smooth 1080p pan...');
for (const scene of scenes) {
  const segFile = path.join(segsDir, `${scene.id}.mp4`);
  const img = fs.existsSync(scene.image) ? scene.image : (fs.existsSync(fallbackImage) ? fallbackImage : path.join(assetsDir, 'scene1_hero.png'));
  const aud = scene.audio;

  console.log(`  -> Processing [${scene.id}]: ${scene.title}`);
  
  // High quality 1080p encoding with zoompan and audio muxing
  const cmd = `"${ffmpeg}" -y -loop 1 -framerate 30 -i "${img}" -i "${aud}" -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,format=yuv420p" -c:v libx264 -preset ultrafast -tune stillimage -crf 20 -c:a aac -b:a 192k -shortest "${segFile}"`;
  
  try {
    execSync(cmd, { stdio: 'pipe' });
    console.log(`     ✅ Encoded ${scene.id}.mp4 successfully`);
  } catch (err) {
    console.error(`     ❌ Failed to encode ${scene.id}:`, err.message);
  }
}

console.log('\n🎞️ Step 2: Concatenating all scenes into final video...');
const concatListFile = path.join(segsDir, 'concat_list.txt');
const listContent = scenes.map(s => `file '${path.join(segsDir, `${s.id}.mp4`).replace(/\\/g, '/')}'`).join('\n');
fs.writeFileSync(concatListFile, listContent, 'utf-8');

const finalVideoPath = path.join(projectRoot, 'traceback-ai-demo.mp4');
const concatCmd = `"${ffmpeg}" -y -f concat -safe 0 -i "${concatListFile}" -c copy "${finalVideoPath}"`;

try {
  execSync(concatCmd, { stdio: 'pipe' });
  console.log(`\n🎉 Final Demo Video Produced: ${finalVideoPath}`);
} catch (err) {
  console.error('❌ Failed to concatenate final video:', err.message);
}

// Write Subtitle file (.srt)
const srtPath = path.join(projectRoot, 'traceback-ai-demo.srt');
const srtContent = `1
00:00:00,000 --> 00:00:09,000
It is 2 AM, and your production checkout service is failing for over 40% of paying customers. Generic chatbots cannot help you here, because they lack real tools, telemetry, and execution safety.

2
00:00:09,000 --> 00:00:17,500
Meet TraceBack AI, built on Builder.io's Agent-Native architecture. Human engineers and the autonomous AI agent act as equal peers, sharing the exact same action primitives for logs, deployment diffs, and system metrics.

3
00:00:17,500 --> 00:00:26,000
With a single click, TraceBack AI launches an autonomous multi-phase investigation. It inspects container logs, analyzes recent continuous deployment diffs, and formulates a root cause hypothesis grounded in verified code evidence.

4
00:00:26,000 --> 00:00:33,500
Crucially, the agent cannot execute mutating commands without human consent. TraceBack AI presents the proposed rollback action, its blast radius, and supporting evidence for explicit operator authorization.

5
00:00:33,500 --> 00:00:42,000
Once approved, the rollback executes, and deterministic health probes verify that error rates have dropped back to nominal levels. With complete audit trails and automated post-mortems, TraceBack AI delivers real agent-native reliability.
`;

fs.writeFileSync(srtPath, srtContent, 'utf-8');
console.log(`📝 Generated Subtitles (.srt): ${srtPath}`);
