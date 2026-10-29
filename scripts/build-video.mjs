import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const assetsDir = path.join(projectRoot, 'video_assets');
const framesDir = path.join(assetsDir, 'traceback_frames');
const voiceDir = path.join(assetsDir, 'voice');
const segsDir = path.join(assetsDir, 'segments');

if (!fs.existsSync(segsDir)) {
  fs.mkdirSync(segsDir, { recursive: true });
}

const ffmpeg = 'C:\\Users\\bharg\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffmpeg.exe';

console.log('⚡ Starting Fast & High-Definition TraceBack AI Video Assembly...');
console.log('Using 100% authentic TraceBack AI UI frames from:', framesDir);

const segments = [
  {
    id: 'seg1',
    type: 'single',
    image: path.join(framesDir, 'scene1_problem.png'),
    audio: path.join(voiceDir, 'scene1_alert.wav'),
    title: "Production Outage: 42.8% Error Spike at 2 AM"
  },
  {
    id: 'seg2',
    type: 'split',
    image1: path.join(framesDir, 'scene2_diff.png'),
    t1: 8.0,
    image2: path.join(framesDir, 'scene3_actions.png'),
    t2: 8.06,
    audio: path.join(voiceDir, 'scene2_telemetry.wav'),
    title: "Builder.io Agent-Native Symmetrical Action Primitives"
  },
  {
    id: 'seg3',
    type: 'single',
    image: path.join(framesDir, 'scene4_investigation.png'),
    audio: path.join(voiceDir, 'scene3_investigation.wav'),
    title: "Autonomous 5-Phase Investigation & Evidence Grounding"
  },
  {
    id: 'seg4',
    type: 'single',
    image: path.join(framesDir, 'scene5_approval.png'),
    audio: path.join(voiceDir, 'scene4_approval.wav'),
    title: "Human Approval Gate: Blast Radius & Action Authorization"
  },
  {
    id: 'seg5',
    type: 'split',
    image1: path.join(framesDir, 'scene6_resolved.png'),
    t1: 8.0,
    image2: path.join(framesDir, 'scene7_postmortem.png'),
    t2: 7.99,
    audio: path.join(voiceDir, 'scene5_resolution.wav'),
    title: "Deterministic Verification Probe & Automated Post-Mortem"
  }
];

console.log('\n🎬 Step 1: Encoding individual scene segments with crisp 1080p video...');
for (const seg of segments) {
  const segFile = path.join(segsDir, `${seg.id}.mp4`);
  console.log(`  -> Processing [${seg.id}]: ${seg.title}`);

  let cmd = '';
  if (seg.type === 'single') {
    cmd = `"${ffmpeg}" -y -loop 1 -framerate 30 -i "${seg.image}" -i "${seg.audio}" -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,format=yuv420p" -c:v libx264 -preset ultrafast -tune stillimage -crf 18 -c:a aac -b:a 192k -shortest "${segFile}"`;
  } else {
    // Split segment with two images sequentially
    cmd = `"${ffmpeg}" -y -loop 1 -t ${seg.t1} -framerate 30 -i "${seg.image1}" -loop 1 -t ${seg.t2} -framerate 30 -i "${seg.image2}" -i "${seg.audio}" -filter_complex "[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,format=yuv420p[v0];[1:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,format=yuv420p[v1];[v0][v1]concat=n=2:v=1:a=0[outv]" -map "[outv]" -map 2:a -c:v libx264 -preset ultrafast -tune stillimage -crf 18 -c:a aac -b:a 192k -shortest "${segFile}"`;
  }

  try {
    execSync(cmd, { stdio: 'pipe' });
    console.log(`     ✅ Encoded ${seg.id}.mp4 successfully`);
  } catch (err) {
    console.error(`     ❌ Failed to encode ${seg.id}:`, err.message);
    process.exit(1);
  }
}

console.log('\n🎞️ Step 2: Concatenating all scenes into final video...');
const concatListFile = path.join(segsDir, 'concat_list.txt');
const listContent = segments.map(s => `file '${path.join(segsDir, `${s.id}.mp4`).replace(/\\/g, '/')}'`).join('\n');
fs.writeFileSync(concatListFile, listContent, 'utf-8');

const finalVideoName = 'TraceBack_AI_Builder_Hackathon_Demo.mp4';
const finalVideoPath = path.join(projectRoot, finalVideoName);
const legacyVideoPath = path.join(projectRoot, 'traceback-ai-demo.mp4');

const concatCmd = `"${ffmpeg}" -y -f concat -safe 0 -i "${concatListFile}" -c copy "${finalVideoPath}"`;

try {
  execSync(concatCmd, { stdio: 'pipe' });
  console.log(`\n🎉 Final Demo Video Produced: ${finalVideoPath}`);
  fs.copyFileSync(finalVideoPath, legacyVideoPath);
  console.log(`   (Also copied to ${legacyVideoPath} for backward-compatibility)`);
} catch (err) {
  console.error('❌ Failed to concatenate final video:', err.message);
  process.exit(1);
}

// Write Subtitle files (.srt)
const srtContent = `1
00:00:00,000 --> 00:00:18,540
It is 2 AM, and your production checkout service is failing for over 40% of paying customers. Generic chatbots cannot help you here, because they lack real tools, telemetry, and execution safety. What engineers need is an agent-native incident workspace.

2
00:00:18,540 --> 00:00:34,600
Meet TraceBack AI, built on Builder.io's Agent-Native architecture. Human engineers and the autonomous AI agent act as equal peers, sharing the exact same action primitives for logs, deployment diffs, and system metrics.

3
00:00:34,600 --> 00:00:50,730
With a single click, TraceBack AI launches an autonomous multi-phase investigation. It inspects container logs, analyzes recent continuous deployment diffs, and formulates a root cause hypothesis grounded in verified code evidence.

4
00:00:50,730 --> 00:01:05,480
Crucially, the agent cannot execute mutating commands without human consent. TraceBack AI presents the proposed rollback action, its blast radius, and supporting evidence for explicit operator authorization.

5
00:01:05,480 --> 00:01:21,470
Once approved, the rollback executes, and deterministic health probes verify that error rates have dropped back to nominal levels. With complete audit trails and automated post-mortems, TraceBack AI delivers real agent-native reliability.
`;

const finalSrtPath = path.join(projectRoot, 'TraceBack_AI_Builder_Hackathon_Demo.srt');
const legacySrtPath = path.join(projectRoot, 'traceback-ai-demo.srt');
fs.writeFileSync(finalSrtPath, srtContent, 'utf-8');
fs.writeFileSync(legacySrtPath, srtContent, 'utf-8');

console.log(`📝 Generated Subtitles (.srt): ${finalSrtPath}`);
console.log(`\n✨ ALL DEMO VIDEO PRODUCTION COMPLETE!`);
