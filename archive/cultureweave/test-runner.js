/**
 * CultureWeave Automated Test Suite
 * Validates Qloo API Integration, Agentic Pipeline & Production Blueprint Engine
 */

const assert = require('assert');

async function runTests() {
  console.log('🧪 Starting CultureWeave Autonomous Test Suite...\n');
  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
    }
  }

  async function testAsync(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
    }
  }

  // --- UNIT TESTS ---

  test('Taste Benchmark Archetypes are valid and populated', () => {
    const { CURATED_ARCHETYPES, findArchetypeByKeywords } = require('../lib/qloo/taste-benchmark');
    assert(Array.isArray(CURATED_ARCHETYPES), 'Curated archetypes should be an array');
    assert(CURATED_ARCHETYPES.length >= 3, 'Should have at least 3 pre-calibrated archetypes');

    const tokyo = findArchetypeByKeywords(['Nujabes', 'streetwear']);
    assert(tokyo, 'Should find Tokyo streetwear archetype by keywords');
    assert.strictEqual(tokyo.id, 'tokyo-streetwear-fusion');
    assert(tokyo.domainCorrelations.artists.length > 0, 'Artists correlations should not be empty');
    assert(tokyo.clichesNaiveAiUses.length > 0, 'Should have clichés documented');
  });

  test('Qloo Client initializes with default config and endpoint', () => {
    const { QlooClient } = require('../lib/qloo/client');
    const client = new QlooClient();
    assert.strictEqual(client.hasApiKey(), false, 'Default client should have no API key');

    client.setApiKey('test_qloo_hackathon_key_123');
    assert.strictEqual(client.hasApiKey(), true, 'Client should recognize set API key');
  });

  await testAsync('Qloo Client fallback entity search returns grounded URN entities', async () => {
    const { QlooClient } = require('../lib/qloo/client');
    const client = new QlooClient();
    const res = await client.searchEntities('Nujabes', 'urn:entity:artist');
    assert(res.success, 'Search should succeed');
    assert(res.results.length > 0, 'Should return matching entity');
    assert(res.results[0].name.includes('Nujabes'), 'Entity name should match search');
  });

  await testAsync('Qloo Client fallback insights queries return cross-domain correlations', async () => {
    const { QlooClient } = require('../lib/qloo/client');
    const client = new QlooClient();
    const res = await client.getInsights({
      signalEntityIds: ['qloo_art_nujabes_01'],
      filterType: 'urn:entity:artist',
      limit: 3
    });
    assert(res.success, 'Insights query should succeed');
    assert(res.results.length > 0, 'Should return artist results');
    assert(typeof res.results[0].query.affinity === 'number', 'Affinity must be a number');
    assert(res.results[0].query.affinity > 0.5, 'Affinity should be high for correlated entities');
  });

  await testAsync('Autonomous Agent executes 10-step design pipeline end-to-end', async () => {
    const { CultureWeaveAgent } = require('../lib/agent/engine');
    const agent = new CultureWeaveAgent();
    const brief = {
      title: 'A24 Film Enthusiast Supper Club',
      targetAudience: 'Independent cinephiles and natural wine enthusiasts',
      purpose: 'community_supper_club',
      culturalAnchors: ['A24', 'Past Lives', 'Natural Wine'],
      budgetTier: 'independent',
      budgetAmount: 3200,
      cityLocation: 'Los Angeles / Silver Lake',
      desiredAtmosphere: 'Warm 35mm grain, beeswax candlelight, unfinished walnut longtables'
    };

    const blueprint = await agent.executeDesignPipeline(brief);
    assert(blueprint, 'Blueprint must be returned');
    assert(blueprint.culturalCoherenceScore >= 70, 'Coherence score should be strong');
    assert(blueprint.anchorsResolved.length >= 3, 'Should resolve all cultural anchors');
    assert(blueprint.auditoryIdentity.qlooRecommendedArtists.length > 0, 'Should have artist recommendations');
    assert(blueprint.culinaryProgram.dishes.length > 0, 'Should have culinary menu');
    assert(blueprint.culturalDissonanceAudit.clichesAvoided.length > 0, 'Should audit avoided clichés');
    assert(blueprint.budgetAllocation.breakdown.length > 0, 'Should generate budget breakdown');
    assert(blueprint.agentExecutionTrace.length >= 5, 'Should log agent execution trace');
  });

  console.log(`\n========================================`);
  console.log(`  Tests Passed: ${passed} / ${total}`);
  console.log(`========================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
