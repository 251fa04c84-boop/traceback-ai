import { EdgeTTS } from 'node-edge-tts';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testAudioPath = path.resolve(__dirname, '..', 'video_assets', 'test_voice.mp3');

async function testTTS() {
  console.log('🎙️ Testing neural voiceover generation...');
  const tts = new EdgeTTS({
    voice: 'en-US-AndrewMultilingualNeural',
    lang: 'en-US',
    outputFormat: 'audio-24khz-48kbitrate-mono-mp3'
  });

  await tts.ttsPromise('AI can generate thousands of ideas. But can it understand what makes a culture truly resonate?', testAudioPath);
  console.log('✅ Neural voiceover successfully generated at:', testAudioPath);
}

testTTS().catch(console.error);
