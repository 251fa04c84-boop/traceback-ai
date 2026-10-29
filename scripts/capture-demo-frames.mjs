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
const targetUrl = process.env.TARGET_URL || 'http://localhost:3000';

async function capture() {
  console.log(`🚀 Launching headless Chrome via puppeteer-core to capture ${targetUrl}...`);
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1.5 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  console.log(`🌐 Navigating to ${targetUrl}...`);
  await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });

  // Scene 1: Initial Outage Alert & Telemetry Logs
  console.log('📸 Capturing Scene 1: Initial Outage Alert & Telemetry...');
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outputDir, 'scene1_alert.png'), fullPage: false });

  // Scene 2: Deployment Diff Tab
  console.log('📸 Capturing Scene 2: Deployment Diff & Code Changes...');
  const diffTab = await page.$('button:has-text("Deployment Diff")') || (await page.$$('button'))[5];
  if (diffTab) {
    await diffTab.click();
    await new Promise(r => setTimeout(r, 800));
  }
  await page.screenshot({ path: path.join(outputDir, 'scene2_telemetry.png'), fullPage: false });

  // Scene 3 & 4: Trigger Autonomous Investigation & Approval Gate
  console.log('📸 Capturing Scene 3: Autonomous Investigation & Approval Card...');
  // Click "Start Autonomous Investigation" button
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Start Autonomous Investigation')) {
      await b.click();
      break;
    }
  }

  // Wait for 5-phase investigation to populate
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outputDir, 'scene3_investigation.png'), fullPage: false });
  await page.screenshot({ path: path.join(outputDir, 'scene4_approval.png'), fullPage: false });

  // Scene 5: Authorize Action & Verified Resolution
  console.log('📸 Capturing Scene 5: Authorize Action & Post-Mortem Report...');
  const allButtons = await page.$$('button');
  for (const b of allButtons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Authorize & Execute')) {
      await b.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(outputDir, 'scene5_resolution.png'), fullPage: false });

  // Open Post-Mortem Modal
  const postMortemBtn = await page.$$('button');
  for (const b of postMortemBtn) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Post-Mortem')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outputDir, 'scene6_postmortem.png'), fullPage: false });

  await browser.close();
  console.log('🎉 All demo screenshot frames captured successfully in video_assets/!');
}

capture().catch((err) => {
  console.error('❌ Capture error:', err);
  process.exit(1);
});
