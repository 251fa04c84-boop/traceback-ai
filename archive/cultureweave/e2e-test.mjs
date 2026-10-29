import { spawn } from 'child_process';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const nodeExe = path.join(projectRoot, '.tools', 'node-v20.18.0-win-x64', 'node.exe');
const nextBin = path.join(projectRoot, 'node_modules', 'next', 'dist', 'bin', 'next');

console.log('🚀 Starting CultureWeave Server via child_process...');

const serverProc = spawn(nodeExe, [nextBin, 'start', '-H', '127.0.0.1', '-p', '3000'], {
  cwd: projectRoot,
  stdio: 'pipe',
  env: {
    ...process.env,
    PATH: `${path.join(projectRoot, '.tools', 'node-v20.18.0-win-x64')};${process.env.PATH}`
  }
});

serverProc.stdout.on('data', data => {
  const line = data.toString();
  if (line.includes('Ready') || line.includes('started') || line.includes('localhost')) {
    console.log(`[Next.js Server] ${line.trim()}`);
  }
});

serverProc.stderr.on('data', data => {
  console.error(`[Next.js Server Err] ${data.toString().trim()}`);
});

function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function runVerification() {
  console.log('⏳ Waiting for server to become responsive...');
  let ready = false;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 1000));
    try {
      const res = await fetchUrl('http://127.0.0.1:3000');
      if (res.status === 200) {
        ready = true;
        break;
      }
    } catch (e) {
      // still starting
    }
  }

  if (!ready) {
    console.error('❌ Server did not respond within 20s');
    serverProc.kill();
    process.exit(1);
  }

  console.log('✅ Server is ready on http://127.0.0.1:3000!\n');

  let passed = 0;
  let total = 4;

  // Test 1: Homepage
  try {
    const res = await fetchUrl('http://127.0.0.1:3000');
    if (res.status === 200 && res.body.includes('CultureWeave AI')) {
      console.log('✅ [1/4] Homepage UI rendered successfully with CultureWeave AI branding.');
      passed++;
    } else {
      console.error(`❌ [1/4] Homepage failed (status ${res.status})`);
    }
  } catch (err) {
    console.error(`❌ [1/4] Homepage error: ${err.message}`);
  }

  // Test 2: Archetypes API
  try {
    const res = await fetchUrl('http://127.0.0.1:3000/api/archetypes');
    const json = JSON.parse(res.body);
    if (res.status === 200 && json.success && json.archetypes.length >= 3) {
      console.log(`✅ [2/4] /api/archetypes returned ${json.archetypes.length} cultural archetypes.`);
      passed++;
    } else {
      console.error('❌ [2/4] /api/archetypes failed schema validation');
    }
  } catch (err) {
    console.error(`❌ [2/4] /api/archetypes error: ${err.message}`);
  }

  // Test 3: Qloo Search API
  try {
    const res = await fetchUrl('http://127.0.0.1:3000/api/qloo/search?query=Nujabes&type=urn:entity:artist');
    const json = JSON.parse(res.body);
    if (res.status === 200 && json.success && json.results.length > 0) {
      console.log(`✅ [3/4] /api/qloo/search resolved "${json.results[0].name}" (ID: ${json.results[0].id}).`);
      passed++;
    } else {
      console.error('❌ [3/4] /api/qloo/search failed');
    }
  } catch (err) {
    console.error(`❌ [3/4] /api/qloo/search error: ${err.message}`);
  }

  // Test 4: Autonomous Agent Pipeline (/api/generate)
  try {
    const payload = JSON.stringify({
      brief: {
        title: 'A24 Film Enthusiast Supper Club',
        targetAudience: 'Independent cinephiles and natural wine enthusiasts',
        purpose: 'community_supper_club',
        culturalAnchors: ['A24', 'Past Lives', 'Natural Wine'],
        budgetTier: 'independent',
        budgetAmount: 3200,
        cityLocation: 'Los Angeles / Silver Lake',
        desiredAtmosphere: 'Warm 35mm grain, beeswax candlelight, unfinished walnut longtables'
      }
    });

    const res = await fetchUrl('http://127.0.0.1:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      },
      body: payload
    });

    const json = JSON.parse(res.body);
    if (res.status === 200 && json.success && json.blueprint) {
      const bp = json.blueprint;
      console.log(`✅ [4/4] /api/generate synthesized blueprint "${bp.brief.title}"!`);
      console.log(`       - Cultural Coherence Score: ${bp.culturalCoherenceScore}%`);
      console.log(`       - Qloo Anchors Grounded: ${bp.anchorsResolved.length}`);
      console.log(`       - Auditory Lineup: ${bp.auditoryIdentity.qlooRecommendedArtists.length} artists`);
      console.log(`       - Culinary Menu: ${bp.culinaryProgram.dishes.length} dishes`);
      console.log(`       - Clichés Filtered: ${bp.culturalDissonanceAudit.clichesAvoided.length}`);
      console.log(`       - Agent Steps Logged: ${bp.agentExecutionTrace.length}`);
      passed++;
    } else {
      console.error(`❌ [4/4] /api/generate failed: ${res.body}`);
    }
  } catch (err) {
    console.error(`❌ [4/4] /api/generate error: ${err.message}`);
  }

  console.log('\n🛑 Cleaning up server process...');
  serverProc.kill();

  console.log(`\n==============================================`);
  console.log(`  End-to-End Verification: ${passed}/${total} Passed`);
  console.log(`==============================================\n`);

  if (passed === total) {
    console.log('🎉 ALL INTEGRATION AND AGENTIC TESTS VERIFIED.');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runVerification();
