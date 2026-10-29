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

console.log('⚡ Starting Fast & High-Definition CultureWeave Video Assembly...');

const scenes = [
  {
    id: 'seg1',
    image: path.join(assetsDir, 'scene1_hero.png'),
    audio: path.join(voiceDir, 'scene1_hook.wav'),
    duration: 8.0,
    title: "Hook: Culturally blind AI agents"
  },
  {
    id: 'seg2',
    image: path.join(assetsDir, 'scene2_archetype_selected.png'),
    audio: path.join(voiceDir, 'scene2_problem.wav'),
    duration: 9.5,
    title: "Problem: Generic cultural clichés"
  },
  {
    id: 'seg3',
    image: path.join(assetsDir, 'scene3_agent_stepper.png'),
    audio: path.join(voiceDir, 'scene3_intro.wav'),
    duration: 8.5,
    title: "Introducing CultureWeave AI with Qloo Taste Graph"
  },
  {
    id: 'seg4',
    image: path.join(assetsDir, 'scene5_auditory.png'),
    audio: path.join(voiceDir, 'scene4_demo.wav'),
    duration: 10.0,
    title: "Live Autonomous Agent Execution Pipeline"
  },
  {
    id: 'seg5',
    image: path.join(assetsDir, 'scene6_culinary.png'),
    audio: path.join(voiceDir, 'scene5_output.wav'),
    duration: 10.5,
    title: "Output Blueprint: Auditory, Culinary & Atmosphere"
  },
  {
    id: 'seg6',
    image: path.join(assetsDir, 'scene8_qloo_tester.png'),
    audio: path.join(voiceDir, 'scene6_qloo.wav'),
    duration: 11.5,
    title: "Qloo Integration: Live Cultural Intelligence & Taste Graph"
  },
  {
    id: 'seg7',
    image: path.join(assetsDir, 'scene9_endcard.png'),
    audio: path.join(voiceDir, 'scene7_closing.wav'),
    duration: 7.5,
    title: "Closing: CultureWeave AI • Giving agents a better sense of taste"
  }
];

// Step 1: Render individual segments ultra-fast (1080p, 30fps)
const segmentFiles = [];
for (let i = 0; i < scenes.length; i++) {
  const sc = scenes[i];
  const outSeg = path.join(segsDir, `${sc.id}.mp4`);
  segmentFiles.push(outSeg);

  console.log(`🎥 Encoding [${i + 1}/${scenes.length}]: ${sc.title} (${sc.duration}s)...`);

  // Fast, crisp 1080p rendering with exact audio pad
  const cmd = `"${ffmpeg}" -y -loop 1 -framerate 30 -t ${sc.duration} -i "${sc.image}" -i "${sc.audio}" ` +
    `-filter_complex "[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,format=yuv420p[v];` +
    `[1:a]apad=whole_dur=${sc.duration}[a]" ` +
    `-map "[v]" -map "[a]" -t ${sc.duration} -c:v libx264 -preset veryfast -tune stillimage -c:a aac -b:a 192k "${outSeg}"`;

  execSync(cmd, { stdio: 'inherit' });
}

// Step 2: Create concat list file
const concatListPath = path.join(segsDir, 'concat_list.txt');
const listContent = segmentFiles.map(f => `file '${f.replace(/\\/g, '/')}'`).join('\n');
fs.writeFileSync(concatListPath, listContent, 'utf8');

// Step 3: Concatenate segments
const mergedVoPath = path.join(assetsDir, 'merged_video.mp4');
console.log('🔗 Concatenating segments into unified presentation...');
execSync(`"${ffmpeg}" -y -f concat -safe 0 -i "${concatListPath}" -c copy "${mergedVoPath}"`, { stdio: 'inherit' });

// Step 4: Generate subtle ambient background music bed (-24dB)
const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);
const bgMusicPath = path.join(assetsDir, 'bg_ambient.wav');
console.log(`🎵 Synthesizing ambient lo-fi musical bed for ${totalDuration}s...`);

const synthFilter = `"aevalsrc=0.02*sin(2*PI*220*t+sin(2*PI*0.2*t))+0.018*sin(2*PI*277.18*t)+0.015*sin(2*PI*329.63*t)+0.01*sin(2*PI*415.3*t):s=44100:d=${totalDuration},lowpass=f=900,volume=0.3"`;
execSync(`"${ffmpeg}" -y -f lavfi -i ${synthFilter} "${bgMusicPath}"`, { stdio: 'inherit' });

// Step 5: Master audio mix and output final cultureweave-demo.mp4
const finalVideoPath = path.join(projectRoot, 'cultureweave-demo.mp4');
console.log('🎛️ Mastering final audio mix (Voiceover + Ambient Bed) to cultureweave-demo.mp4...');

const masterCmd = `"${ffmpeg}" -y -i "${mergedVoPath}" -i "${bgMusicPath}" ` +
  `-filter_complex "[0:a]volume=1.0[vo];[1:a]volume=0.22,afade=t=out:st=${totalDuration - 3}:d=3[bg];[vo][bg]amix=inputs=2:duration=first[a]" ` +
  `-map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k "${finalVideoPath}"`;

execSync(masterCmd, { stdio: 'inherit' });

console.log(`\n🎉 SUCCESS! Broadcast-ready hackathon demo video created at:`);
console.log(`👉 ${finalVideoPath}`);
console.log(`⏱️ Duration: ${totalDuration} seconds (1080p Full HD, H.264 / AAC)`);
