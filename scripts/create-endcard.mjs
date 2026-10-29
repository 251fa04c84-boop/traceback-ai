import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, '..', 'video_assets');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      margin: 0;
      padding: 0;
      width: 1920px;
      height: 1080px;
      background: #090a0b;
      color: #e4e4e7;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .glow {
      position: absolute;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(9, 10, 11, 0) 70%);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .card {
      position: relative;
      z-index: 10;
      text-align: center;
      background: rgba(18, 20, 24, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 24px;
      padding: 60px 80px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      max-width: 1100px;
    }
    .badge {
      display: inline-block;
      padding: 8px 18px;
      background: rgba(245, 158, 11, 0.12);
      border: 1px solid rgba(245, 158, 11, 0.3);
      color: #fbbf24;
      border-radius: 9999px;
      font-size: 16px;
      font-family: monospace;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 24px;
    }
    h1 {
      font-size: 64px;
      margin: 0 0 16px 0;
      font-weight: 700;
      letter-spacing: -1.5px;
      background: linear-gradient(135deg, #ffffff 0%, #d4d4d8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p.tagline {
      font-size: 24px;
      color: #a1a1aa;
      margin: 0 0 36px 0;
      font-weight: 300;
    }
    .links-box {
      display: flex;
      gap: 30px;
      justify-content: center;
      margin-top: 30px;
    }
    .pill {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 14px 28px;
      border-radius: 12px;
      font-size: 20px;
      font-family: monospace;
      color: #f4f4f5;
    }
    .footer-note {
      margin-top: 40px;
      font-size: 16px;
      color: #71717a;
      letter-spacing: 1px;
      text-transform: uppercase;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <div class="glow"></div>
  <div class="card">
    <div class="badge">Qloo Agentic Hackathon 2026 • "Agents, but with taste."</div>
    <h1>CultureWeave AI</h1>
    <p class="tagline">The Taste-Grounded Cultural Experience Architect</p>
    <div class="links-box">
      <div class="pill">🌐 https://cultureweave-ai.vercel.app</div>
      <div class="pill">📦 github.com/251fa04c84-boop/cultureweave-ai</div>
    </div>
    <div class="footer-note">Built with Qloo Taste AI™ • Next.js 14 • 10-Step Autonomous Agent</div>
  </div>
</body>
</html>
`;

async function renderEndcard() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setContent(html);
  await page.screenshot({ path: path.join(outputDir, 'scene9_endcard.png') });
  console.log('✅ Endcard captured!');
  await browser.close();
}

renderEndcard().catch(console.error);
