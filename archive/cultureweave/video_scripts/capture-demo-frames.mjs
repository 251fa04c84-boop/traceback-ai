import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, '..', 'video_assets');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function capture() {
  console.log('🚀 Launching headless Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  console.log('🌐 Navigating to https://cultureweave-ai.vercel.app...');
  await page.goto('https://cultureweave-ai.vercel.app', { waitUntil: 'networkidle2', timeout: 30000 });

  // 1. Scene 1 & 2: Homepage Hero & Brief
  console.log('📸 Capturing Scene 1: Hook & Hero...');
  await page.screenshot({ path: path.join(outputDir, 'scene1_hero.png'), fullPage: false });

  // 2. Click Afro-Futurist Archetype to show brief change
  console.log('📸 Selecting Curated Archetype...');
  const buttons = await page.$$('button');
  // Click on the 2nd archetype (A24 Cinephile Supper Club)
  if (buttons.length > 2) {
    await buttons[2].click();
    await new Promise(r => setTimeout(r, 600));
  }
  await page.screenshot({ path: path.join(outputDir, 'scene2_archetype_selected.png'), fullPage: false });

  // 3. Click "Synthesize Cultural Blueprint" to show agent working
  console.log('📸 Triggering Agent Synthesis...');
  const synthBtn = await page.$('button.bg-gradient-to-r');
  if (synthBtn) {
    await synthBtn.click();
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(outputDir, 'scene3_agent_stepper.png'), fullPage: false });
    // Wait for synthesis to complete
    await new Promise(r => setTimeout(r, 3000));
  }

  // 4. Scene 4: Generated Blueprint Overview
  console.log('📸 Capturing Blueprint Overview...');
  // Scroll to blueprint
  await page.evaluate(() => window.scrollBy(0, 350));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(outputDir, 'scene4_overview.png'), fullPage: false });

  // 5. Scene 5: Auditory Identity Tab
  console.log('📸 Switching to Auditory Tab...');
  const tabButtons = await page.$$('button');
  for (const btn of tabButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Auditory')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(outputDir, 'scene5_auditory.png'), fullPage: false });

  // 6. Scene 6: Culinary Program Tab
  console.log('📸 Switching to Culinary Tab...');
  for (const btn of tabButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Culinary')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(outputDir, 'scene6_culinary.png'), fullPage: false });

  // 7. Scene 7: Cultural Dissonance Tab
  console.log('📸 Switching to Dissonance Tab...');
  for (const btn of tabButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Dissonance')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(outputDir, 'scene7_dissonance.png'), fullPage: false });

  // 8. Scene 8: Qloo API Tester Modal
  console.log('📸 Opening Qloo API Tester...');
  for (const btn of tabButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Qloo API Tester')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));
  // Click Dispatch Live Search
  const dispatchBtn = await page.$('button.bg-amber-500');
  if (dispatchBtn) {
    await dispatchBtn.click();
    await new Promise(r => setTimeout(r, 1000));
  }
  await page.screenshot({ path: path.join(outputDir, 'scene8_qloo_tester.png'), fullPage: false });

  console.log('✅ All product frames successfully captured!');
  await browser.close();
}

capture().catch(err => {
  console.error('Fatal capture error:', err);
  process.exit(1);
});
