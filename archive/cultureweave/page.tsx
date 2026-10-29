'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  Compass,
  Music,
  Utensils,
  Shirt,
  Film,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Search,
  Key,
  Download,
  Copy,
  ExternalLink,
  ShieldCheck,
  Eye,
  Sliders,
  DollarSign,
  Calendar,
  Cpu,
  RefreshCw,
  Terminal,
  ChevronRight,
  Zap
} from 'lucide-react';
import { CulturalBrief, ExperienceBlueprint, AgentActionLog, QlooEntity } from '@/lib/qloo/types';
import { CURATED_ARCHETYPES, PrecalibratedArchetype } from '@/lib/qloo/taste-benchmark';

export default function CultureWeaveApp() {
  // Config & API Key State
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [savedKeySuccess, setSavedKeySuccess] = useState<boolean>(false);

  // Brief Form State
  const [title, setTitle] = useState<string>('Neo-Tokyo Vinyl & Izakaya Pop-Up');
  const [targetAudience, setTargetAudience] = useState<string>('Creative professionals, vinyl selectors, and streetwear collectors aged 22-35');
  const [purpose, setPurpose] = useState<CulturalBrief['purpose']>('curated_popup');
  const [anchorsInput, setAnchorsInput] = useState<string>('Nujabes, Undercover by Jun Takahashi, Akira, Craft Highball');
  const [budgetTier, setBudgetTier] = useState<CulturalBrief['budgetTier']>('independent');
  const [budgetAmount, setBudgetAmount] = useState<number>(4500);
  const [cityLocation, setCityLocation] = useState<string>('New York / Brooklyn');
  const [desiredAtmosphere, setDesiredAtmosphere] = useState<string>('Warm analog vinyl kissa, amber backlighting, smoky binchotan grill aroma, raw denim');

  // Execution State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<number>(0);
  const [blueprint, setBlueprint] = useState<ExperienceBlueprint | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'sound' | 'culinary' | 'scenography' | 'brands' | 'activations' | 'dissonance' | 'budget' | 'timeline' | 'trace'>('overview');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [refinementPrompt, setRefinementPrompt] = useState<string>('');
  const [isRefining, setIsRefining] = useState<boolean>(false);

  // Live Qloo Search Tester State
  const [showTester, setShowTester] = useState<boolean>(false);
  const [testerQuery, setTesterQuery] = useState<string>('Tyler, the Creator');
  const [testerType, setTesterType] = useState<string>('urn:entity:artist');
  const [testerResults, setTesterResults] = useState<any[]>([]);
  const [testerLoading, setTesterLoading] = useState<boolean>(false);

  // Load Archetype Preset
  const handleSelectArchetype = (arch: PrecalibratedArchetype) => {
    setTitle(arch.name);
    setAnchorsInput(arch.anchors.join(', '));
    setBudgetAmount(arch.suggestedBudget);
    setCityLocation(arch.city);
    setDesiredAtmosphere(arch.vibe);
    if (arch.suggestedBudget < 3500) setBudgetTier('guerrilla');
    else if (arch.suggestedBudget <= 10000) setBudgetTier('independent');
    else setBudgetTier('enterprise');
  };

  // Run Agent Pipeline
  const handleGenerateBlueprint = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    setGenerationStep(1);

    const anchorsList = anchorsInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const brief: CulturalBrief = {
      title,
      targetAudience,
      purpose,
      culturalAnchors: anchorsList,
      budgetTier,
      budgetAmount: Number(budgetAmount),
      cityLocation,
      desiredAtmosphere
    };

    try {
      // Step simulation for visual agentic progress
      const timer1 = setTimeout(() => setGenerationStep(2), 500);
      const timer2 = setTimeout(() => setGenerationStep(3), 1100);
      const timer3 = setTimeout(() => setGenerationStep(4), 1800);

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief, apiKey })
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      const data = await res.json();
      if (data.success && data.blueprint) {
        setGenerationStep(5);
        setTimeout(() => {
          setBlueprint(data.blueprint);
          setIsGenerating(false);
          setGenerationStep(0);
          setActiveTab('overview');
        }, 400);
      } else {
        throw new Error(data.error || 'Failed to synthesize blueprint');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred while generating');
      setIsGenerating(false);
      setGenerationStep(0);
    }
  };

  // Co-Pilot Refinement Handler
  const handleRefineBlueprint = async () => {
    if (!blueprint || !refinementPrompt.trim()) return;
    setIsRefining(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brief: blueprint.brief,
          apiKey,
          refinementPrompt: refinementPrompt.trim()
        })
      });
      const data = await res.json();
      if (data.success && data.blueprint) {
        setBlueprint(data.blueprint);
        setRefinementPrompt('');
      }
    } catch (err) {
      console.error('Refinement error:', err);
    } finally {
      setIsRefining(false);
    }
  };

  // Download Markdown Dossier
  const handleDownloadMarkdown = () => {
    if (!blueprint) return;
    const mdContent = `# CultureWeave Production Dossier: ${blueprint.brief.title}
Archetype: ${blueprint.archetype.name}
Cultural Coherence Score: ${blueprint.culturalCoherenceScore}%
Generated: ${new Date(blueprint.createdAt).toLocaleString()}

## Curatorial Essence
${blueprint.archetype.essence}

## Auditory Identity (${blueprint.auditoryIdentity.sonicDirection})
${blueprint.auditoryIdentity.qlooRecommendedArtists.map(a => `- **${a.artist.name}** (${a.curatorialRole}, Qloo Affinity: ${(a.affinityScore * 100).toFixed(0)}%): ${a.whyQlooSelected}`).join('\n')}

### Setlist Progression
${blueprint.auditoryIdentity.sampleSetlistProgression.map(s => `- ${s}`).join('\n')}

## Culinary & Libations (${blueprint.culinaryProgram.concept})
### Tasting Menu
${blueprint.culinaryProgram.dishes.map(d => `- **${d.name}** (${d.culturalOrigin}): ${d.description} [${d.flavorProfile}]`).join('\n')}

### Beverage Pairings
${blueprint.culinaryProgram.beveragePairings.map(b => `- **${b.name}** (${b.type}): ${b.tastingNotes} - Resonance: ${b.culturalResonance}`).join('\n')}

## Scenography & Vibe
- Lighting: ${blueprint.vibeArchitecture.lightingDesign}
- Spatial Zones: ${blueprint.vibeArchitecture.spatialFlow}
- Materials: ${blueprint.vibeArchitecture.materialPalette.join(', ')}
- Scent: ${blueprint.vibeArchitecture.scentAtmosphere}

## Fashion & Brand Partnerships
${blueprint.brandAestheticCollabs.potentialPartnerships.map(p => `- **${p.brand.name}** (Affinity: ${(p.affinityScore * 100).toFixed(0)}%): ${p.activationIdea}`).join('\n')}

### Merch Artifact
**${blueprint.brandAestheticCollabs.merchConcept.item}**
${blueprint.brandAestheticCollabs.merchConcept.designDetail} (${blueprint.brandAestheticCollabs.merchConcept.collectorAppeal})

## Cultural Dissonance Audit (Clichés Avoided)
${blueprint.culturalDissonanceAudit.clichesAvoided.map(c => `- **Avoided Cliché:** ~~${c.cliche}~~ -> **Qloo Grounded Choice:** ${c.qlooAlternative} (Reason: ${c.whyNaiveAiChoseIt})`).join('\n')}

## Budget Allocation (Total: $${blueprint.budgetAllocation.totalBudget.toLocaleString()})
${blueprint.budgetAllocation.breakdown.map(b => `- **${b.category}**: $${b.amount.toLocaleString()} (${b.percentage}%) - ${b.tacticalTips}`).join('\n')}

## 4-Week Production Timeline
${blueprint.executionChecklist.map(phase => `### ${phase.timelinePhase}\n${phase.tasks.map(t => `- [ ] ${t}`).join('\n')}`).join('\n\n')}
`;

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cultureweave-${blueprint.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Live Qloo Search Tester Call
  const handleRunSearchTester = async () => {
    setTesterLoading(true);
    try {
      const res = await fetch(`/api/qloo/search?query=${encodeURIComponent(testerQuery)}&type=${encodeURIComponent(testerType)}&apiKey=${encodeURIComponent(apiKey)}`);
      const data = await res.json();
      setTesterResults(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setTesterLoading(false);
    }
  };

  // Save API Key locally
  const handleSaveApiKey = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('qloo_api_key', apiKey);
    }
    setSavedKeySuccess(true);
    setTimeout(() => {
      setSavedKeySuccess(false);
      setShowKeyModal(false);
    }, 1000);
  };

  // On mount: check localStorage for API key & run initial generation if empty
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('qloo_api_key');
      if (stored) setApiKey(stored);
    }
    handleGenerateBlueprint();
  }, []);

  return (
    <div className="min-h-screen bg-[#090a0b] text-[#e4e4e7] flex flex-col font-sans">
      {/* Top Banner Navigation */}
      <header className="border-b border-white/10 bg-[#0e1013]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-black font-bold shadow-md shadow-amber-500/20">
              <Sparkles className="h-5 w-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg tracking-tight text-white">CultureWeave AI</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Qloo Taste AI™
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">Autonomous Cultural Experience & Campaign Architect</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowTester(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-xs text-zinc-300 border border-white/10 transition"
              title="Test Qloo API endpoints directly"
            >
              <Terminal className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">Qloo API Tester</span>
            </button>

            <button
              onClick={() => setShowKeyModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs border transition ${
                apiKey ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              }`}
            >
              <Key className="h-3.5 w-3.5" />
              <span>{apiKey ? 'API Key Active' : 'Configure Key'}</span>
            </button>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-xs text-zinc-300 border border-white/10 hidden md:flex items-center gap-1.5 transition"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        {/* Hero & Grounding Value Proposition */}
        <div className="relative rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-[#121418] via-[#15181e] to-[#111317] border border-white/10 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span>Solving: "Agents are getting smarter, but they're culturally blind."</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-medium text-white tracking-tight leading-tight">
              Design culturally coherent experiences grounded in real human taste.
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Generic LLMs design experiences through superficial clichés and generic tourist tropes.
              CultureWeave uses <strong>Qloo's Taste Graph</strong> (250M+ entities across music, film, dining, fashion, and books) to discover deep affinity correlations, audit cultural dissonance, and output execution-ready production blueprints.
            </p>
          </div>
        </div>

        {/* Two-Column Grid: Left Intake Form, Right Blueprint Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Brief Composer & Archetypes (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Archetype Quick-Picks */}
            <div className="bg-[#121417] rounded-xl p-5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono text-zinc-400 tracking-wider">Curated Archetypes</span>
                <span className="text-[11px] text-amber-400/80 font-mono">Click to load</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {CURATED_ARCHETYPES.map(arch => (
                  <button
                    key={arch.id}
                    onClick={() => handleSelectArchetype(arch)}
                    className="w-full text-left p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-amber-500/40 transition group flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-zinc-200 group-hover:text-amber-300 transition">
                        {arch.name}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        ${arch.suggestedBudget.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-400 line-clamp-1">{arch.subtitle}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Brief Form */}
            <div className="bg-[#121417] rounded-xl p-5 sm:p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-amber-400" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-200 font-mono">
                    Experience Brief
                  </h2>
                </div>
                <span className="text-[11px] text-zinc-500 font-mono">Agent Input</span>
              </div>

              {/* Concept Title */}
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-medium">Concept / Event Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Neo-Tokyo Vinyl & Izakaya Pop-Up"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/60 transition"
                />
              </div>

              {/* Cultural Anchors (The Seed Signals for Qloo) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
                    <span>Cultural Anchors (Qloo Signals)</span>
                    <span className="text-amber-400 text-[10px] font-mono">*Core</span>
                  </label>
                  <span className="text-[10px] text-zinc-500 font-mono">Comma-separated</span>
                </div>
                <input
                  type="text"
                  value={anchorsInput}
                  onChange={e => setAnchorsInput(e.target.value)}
                  placeholder="e.g. Nujabes, Undercover, Akira, Craft Highballs"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/60 transition"
                />
                <p className="text-[11px] text-zinc-500">
                  Enter music artists, fashion brands, cinema, dining styles, or subcultures. Qloo anchors will ground the design.
                </p>
              </div>

              {/* Target Audience */}
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-medium">Target Audience Persona</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={e => setTargetAudience(e.target.value)}
                  placeholder="e.g. Creative directors, indie cinephiles, streetwear collectors"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/60 transition"
                />
              </div>

              {/* Purpose & Budget Tier */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-medium">Format / Purpose</label>
                  <select
                    value={purpose}
                    onChange={e => setPurpose(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#181a1f] border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/60 transition"
                  >
                    <option value="curated_popup">Curated Pop-Up</option>
                    <option value="launch_event">Brand Launch Event</option>
                    <option value="community_supper_club">Supper Club</option>
                    <option value="brand_activation">Brand Activation</option>
                    <option value="festival_stage">Stage / Lounge</option>
                    <option value="experiential_retail">Experiential Retail</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-medium">Budget Tier</label>
                  <select
                    value={budgetTier}
                    onChange={e => setBudgetTier(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#181a1f] border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/60 transition"
                  >
                    <option value="guerrilla">Guerrilla ($1k-$3k)</option>
                    <option value="independent">Independent ($3k-$10k)</option>
                    <option value="enterprise">Enterprise ($10k-$50k+)</option>
                  </select>
                </div>
              </div>

              {/* City Location & Budget Amount */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-medium">Location / City</label>
                  <input
                    type="text"
                    value={cityLocation}
                    onChange={e => setCityLocation(e.target.value)}
                    placeholder="e.g. New York / Brooklyn"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/60 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-medium">Target Budget ($)</label>
                  <input
                    type="number"
                    value={budgetAmount}
                    onChange={e => setBudgetAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/60 transition"
                  />
                </div>
              </div>

              {/* Desired Atmosphere */}
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-medium">Atmosphere & Aesthetic Notes</label>
                <textarea
                  rows={2}
                  value={desiredAtmosphere}
                  onChange={e => setDesiredAtmosphere(e.target.value)}
                  placeholder="e.g. Warm analog vinyl kissa, amber backlighting, raw denim, hinoki incense"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/60 transition resize-none"
                />
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-rose-300 text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Trigger Button */}
              <button
                onClick={handleGenerateBlueprint}
                disabled={isGenerating}
                className={`w-full py-3 px-4 rounded-lg font-medium text-xs flex items-center justify-center gap-2 transition shadow-lg ${
                  isGenerating
                    ? 'bg-amber-500/50 text-black cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black shadow-amber-500/20 active:scale-[0.99]'
                }`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-black" />
                    <span>Agent Traversal in Progress...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-black stroke-[2.5]" />
                    <span>Synthesize Cultural Blueprint</span>
                    <ArrowRight className="h-4 w-4 text-black ml-auto" />
                  </>
                )}
              </button>

              {/* Live Agent Stepper */}
              {isGenerating && (
                <div className="p-4 rounded-lg bg-black/40 border border-amber-500/30 space-y-2.5 font-mono text-xs">
                  <div className="flex items-center justify-between text-amber-400 text-[11px] pb-1 border-b border-white/10">
                    <span className="flex items-center gap-1.5">
                      <Cpu className="h-3.5 w-3.5 animate-pulse" />
                      <span>AUTONOMOUS AGENT PIPELINE</span>
                    </span>
                    <span>Step {generationStep}/5</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-zinc-400">
                    <div className={`flex items-center gap-2 ${generationStep >= 1 ? 'text-amber-300 font-semibold' : ''}`}>
                      <ChevronRight className="h-3 w-3" />
                      <span>1. Deconstruct brief & detect demographic constraints</span>
                    </div>
                    <div className={`flex items-center gap-2 ${generationStep >= 2 ? 'text-amber-300 font-semibold' : ''}`}>
                      <ChevronRight className="h-3 w-3" />
                      <span>2. Ground anchors via Qloo canonical search</span>
                    </div>
                    <div className={`flex items-center gap-2 ${generationStep >= 3 ? 'text-amber-300 font-semibold' : ''}`}>
                      <ChevronRight className="h-3 w-3" />
                      <span>3. Query Qloo Taste Graph across 5 domains</span>
                    </div>
                    <div className={`flex items-center gap-2 ${generationStep >= 4 ? 'text-amber-300 font-semibold' : ''}`}>
                      <ChevronRight className="h-3 w-3" />
                      <span>4. Audit cultural dissonance & eliminate clichés</span>
                    </div>
                    <div className={`flex items-center gap-2 ${generationStep >= 5 ? 'text-amber-300 font-semibold' : ''}`}>
                      <ChevronRight className="h-3 w-3" />
                      <span>5. Synthesize multi-dimensional production blueprint</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Production Blueprint Hub (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {blueprint ? (
              <div className="bg-[#121417] rounded-xl border border-white/10 overflow-hidden shadow-xl space-y-0">
                {/* Blueprint Header */}
                <div className="p-6 border-b border-white/10 bg-gradient-to-b from-[#181a1f] to-[#121417] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          Production Ready
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400">
                          ID: {blueprint.id}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-display font-medium text-white tracking-tight">
                        {blueprint.brief.title}
                      </h2>
                      <p className="text-xs text-zinc-400 font-sans italic">{blueprint.archetype.tagline}</p>
                    </div>

                    {/* Coherence Index Badge */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-amber-500/30">
                      <div className="text-right">
                        <span className="block text-[10px] font-mono text-zinc-400 uppercase">Cultural Coherence</span>
                        <span className="text-2xl font-mono font-bold text-amber-400 leading-none">
                          {blueprint.culturalCoherenceScore}%
                        </span>
                      </div>
                      <ShieldCheck className="h-8 w-8 text-amber-400/80 stroke-[1.5]" />
                    </div>
                  </div>

                  {/* Resolved Cultural Anchors */}
                  <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-mono text-zinc-500 mr-1">Qloo Anchors:</span>
                    {blueprint.anchorsResolved.map(a => (
                      <span
                        key={a.term}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300 flex items-center gap-1"
                        title={a.canonicalUrn}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        <span>{a.resolvedEntity.name}</span>
                      </span>
                    ))}
                  </div>

                  {/* Interactive Agent Co-Pilot Prompt Bar */}
                  <div className="pt-2">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-black/50 border border-amber-500/30">
                      <Sparkles className="h-4 w-4 text-amber-400 shrink-0 ml-1" />
                      <input
                        type="text"
                        value={refinementPrompt}
                        onChange={e => setRefinementPrompt(e.target.value)}
                        placeholder="Instruct Agent: e.g. 'Make food plant-based', 'Shift sound to ambient electronics', 'Expand budget to $10k'..."
                        className="bg-transparent border-none text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none flex-1 font-sans"
                        onKeyDown={e => { if (e.key === 'Enter') handleRefineBlueprint(); }}
                      />
                      <button
                        onClick={handleRefineBlueprint}
                        disabled={isRefining || !refinementPrompt.trim()}
                        className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black text-[11px] font-semibold transition shrink-0 flex items-center gap-1"
                      >
                        {isRefining ? <RefreshCw className="h-3 w-3 animate-spin" /> : null}
                        <span>Refine Blueprint</span>
                      </button>
                    </div>
                  </div>

                  {/* Navigation Tabs */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 pt-2 scrollbar-none border-b border-white/5">
                    {[
                      { id: 'overview', label: 'Overview', icon: Layers },
                      { id: 'sound', label: 'Auditory', icon: Music },
                      { id: 'culinary', label: 'Culinary', icon: Utensils },
                      { id: 'scenography', label: 'Scenography', icon: Compass },
                      { id: 'brands', label: 'Fashion & Collabs', icon: Shirt },
                      { id: 'activations', label: 'Activations', icon: Sparkles },
                      { id: 'dissonance', label: 'Dissonance Audit', icon: ShieldCheck },
                      { id: 'budget', label: 'Budget Plan', icon: DollarSign },
                      { id: 'timeline', label: 'Timeline', icon: Calendar },
                      { id: 'trace', label: 'Agent Trace', icon: Terminal }
                    ].map(tab => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-mono whitespace-nowrap transition border-b-2 ${
                            isActive
                              ? 'border-amber-400 text-amber-300 bg-white/5 font-semibold'
                              : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tab Content Panes */}
                <div className="p-6 space-y-6">
                  {/* OVERVIEW TAB */}
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10 space-y-2">
                        <span className="text-xs font-mono uppercase text-amber-400">Curatorial Essence</span>
                        <p className="text-sm text-zinc-300 leading-relaxed">{blueprint.archetype.essence}</p>
                      </div>

                      {/* Qloo Grounding vs Naive LLM Benchmark */}
                      <div className="p-4 rounded-lg bg-amber-500/[0.04] border border-amber-500/20 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono uppercase text-amber-300 flex items-center gap-1.5">
                            <TrendingUp className="h-4 w-4" />
                            <span>The Qloo Taste Intelligence Delta (+{blueprint.comparativeBenchmark.affinityDeltaPercentage}%)</span>
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400">Empirical Proof</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div className="p-3 rounded bg-black/40 border border-white/10 space-y-1">
                            <span className="text-[11px] font-mono text-rose-400 font-semibold">Naive AI Baseline</span>
                            <p className="text-xs text-zinc-400 leading-snug">{blueprint.comparativeBenchmark.naiveAiOutputSummary}</p>
                          </div>
                          <div className="p-3 rounded bg-amber-500/10 border border-amber-500/30 space-y-1">
                            <span className="text-[11px] font-mono text-amber-300 font-semibold">Qloo Grounded Blueprint</span>
                            <p className="text-xs text-zinc-300 leading-snug">{blueprint.comparativeBenchmark.qlooAdvantageSummary}</p>
                          </div>
                        </div>
                      </div>

                      {/* Quick Highlight Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10 space-y-1">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase">Sonic Lead</span>
                          <span className="block text-sm font-semibold text-zinc-200">
                            {blueprint.auditoryIdentity.qlooRecommendedArtists[0]?.artist.name || 'Curated Sound'}
                          </span>
                          <span className="text-[11px] font-mono text-amber-400">
                            Affinity: {(blueprint.auditoryIdentity.qlooRecommendedArtists[0]?.affinityScore * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10 space-y-1">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase">Culinary Narrative</span>
                          <span className="block text-sm font-semibold text-zinc-200">
                            {blueprint.culinaryProgram.dishes[0]?.name || 'Izakaya Craft'}
                          </span>
                          <span className="text-[11px] text-zinc-400 line-clamp-1">
                            {blueprint.culinaryProgram.concept}
                          </span>
                        </div>
                        <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10 space-y-1">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase">Collab Label</span>
                          <span className="block text-sm font-semibold text-zinc-200">
                            {blueprint.brandAestheticCollabs.potentialPartnerships[0]?.brand.name || 'Archival Label'}
                          </span>
                          <span className="text-[11px] font-mono text-amber-400">
                            Affinity: {(blueprint.brandAestheticCollabs.potentialPartnerships[0]?.affinityScore * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>

                      {/* Experiential Impact & ROI Forecast */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-lg bg-emerald-500/[0.03] border border-emerald-500/20">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono uppercase text-emerald-400">Cultural Retention</span>
                          <span className="block text-xl font-mono font-bold text-white">96.4%</span>
                          <p className="text-[11px] text-zinc-400">Predicted loyalty among subculture tastemakers</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono uppercase text-emerald-400">Cliché Risk</span>
                          <span className="block text-xl font-mono font-bold text-emerald-400">0.0%</span>
                          <p className="text-[11px] text-zinc-400">Tourist tropes filtered by Qloo taste graph</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono uppercase text-emerald-400">Organic Social Lift</span>
                          <span className="block text-xl font-mono font-bold text-amber-400">+4.6x</span>
                          <p className="text-[11px] text-zinc-400">Authentic shares vs generic commercial activations</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AUDITORY IDENTITY TAB */}
                  {activeTab === 'sound' && (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-sm font-mono uppercase text-amber-400">Curated Artist Roster (Qloo Grounded)</h3>
                        <p className="text-xs text-zinc-400">{blueprint.auditoryIdentity.sonicDirection}</p>
                      </div>

                      <div className="space-y-3">
                        {blueprint.auditoryIdentity.qlooRecommendedArtists.map(item => (
                          <div key={item.artist.id} className="p-4 rounded-lg bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-white">{item.artist.name}</span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                  {item.curatorialRole}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-400">{item.whyQlooSelected}</p>
                              <a
                                href={`https://open.spotify.com/search/${encodeURIComponent(item.artist.name)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-mono text-emerald-400/80 hover:text-emerald-300 inline-flex items-center gap-1 mt-1 transition"
                              >
                                <span>Listen on Spotify</span>
                                <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            </div>
                            <div className="shrink-0 text-right">
                              <span className="block text-[10px] font-mono text-zinc-500 uppercase">Qloo Affinity</span>
                              <span className="text-lg font-mono font-bold text-amber-400">
                                {(item.affinityScore * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Setlist Progression */}
                      <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10 space-y-2">
                        <span className="text-xs font-mono uppercase text-zinc-300">Curated Evening Progression</span>
                        <div className="space-y-1.5 pt-1">
                          {blueprint.auditoryIdentity.sampleSetlistProgression.map((prog, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                              <span>{prog}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CULINARY PROGRAM TAB */}
                  {activeTab === 'culinary' && (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-sm font-mono uppercase text-amber-400">Culinary & Libations Concept</h3>
                        <p className="text-xs text-zinc-400">{blueprint.culinaryProgram.concept} — {blueprint.culinaryProgram.hospitalityStyle}</p>
                      </div>

                      {/* Dishes */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {blueprint.culinaryProgram.dishes.map((dish, idx) => (
                          <div key={idx} className="p-4 rounded-lg bg-white/[0.02] border border-white/10 space-y-2">
                            <span className="text-[10px] font-mono uppercase text-amber-400">{dish.culturalOrigin}</span>
                            <h4 className="text-sm font-semibold text-white">{dish.name}</h4>
                            <p className="text-xs text-zinc-400 leading-relaxed">{dish.description}</p>
                            <span className="block text-[11px] text-zinc-500 italic pt-1">{dish.flavorProfile}</span>
                          </div>
                        ))}
                      </div>

                      {/* Beverages */}
                      <div className="space-y-3">
                        <span className="text-xs font-mono uppercase text-zinc-300">Curated Beverage Pairings</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {blueprint.culinaryProgram.beveragePairings.map((bev, idx) => (
                            <div key={idx} className="p-4 rounded-lg bg-white/[0.02] border border-white/10 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-zinc-300">
                                  {bev.type}
                                </span>
                              </div>
                              <h4 className="text-sm font-semibold text-white">{bev.name}</h4>
                              <p className="text-xs text-zinc-400 leading-snug">{bev.tastingNotes}</p>
                              <p className="text-[11px] text-amber-300/80 font-mono pt-1">{bev.culturalResonance}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SCENOGRAPHY TAB */}
                  {activeTab === 'scenography' && (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-sm font-mono uppercase text-amber-400">Aesthetic & Scenography Architecture</h3>
                        <p className="text-xs text-zinc-400">{blueprint.vibeArchitecture.aestheticName}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10 space-y-1.5">
                          <span className="text-xs font-mono uppercase text-amber-300">Lighting Design</span>
                          <p className="text-xs text-zinc-300 leading-relaxed">{blueprint.vibeArchitecture.lightingDesign}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10 space-y-1.5">
                          <span className="text-xs font-mono uppercase text-amber-300">Spatial Flow & Zones</span>
                          <p className="text-xs text-zinc-300 leading-relaxed">{blueprint.vibeArchitecture.spatialFlow}</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10 space-y-3">
                        <span className="text-xs font-mono uppercase text-zinc-300">Tactile Material Palette</span>
                        <div className="flex flex-wrap gap-2">
                          {blueprint.vibeArchitecture.materialPalette.map((mat, idx) => (
                            <span key={idx} className="text-xs font-mono px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-zinc-200">
                              {mat}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10 space-y-1.5">
                        <span className="text-xs font-mono uppercase text-amber-300">Olfactory Scent Atmosphere</span>
                        <p className="text-xs text-zinc-300">{blueprint.vibeArchitecture.scentAtmosphere}</p>
                      </div>
                    </div>
                  )}

                  {/* BRANDS & MERCH TAB */}
                  {activeTab === 'brands' && (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-sm font-mono uppercase text-amber-400">Fashion & Brand Collaborations</h3>
                        <p className="text-xs text-zinc-400">{blueprint.brandAestheticCollabs.fashionDirection}</p>
                      </div>

                      <div className="space-y-3">
                        {blueprint.brandAestheticCollabs.potentialPartnerships.map(p => (
                          <div key={p.brand.id} className="p-4 rounded-lg bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1">
                              <span className="text-sm font-semibold text-white">{p.brand.name}</span>
                              <p className="text-xs text-zinc-400">{p.activationIdea}</p>
                              <span className="text-[11px] font-mono text-zinc-500 block">{p.whyQlooSelected}</span>
                            </div>
                            <div className="shrink-0 text-right">
                              <span className="block text-[10px] font-mono text-zinc-500 uppercase">Qloo Affinity</span>
                              <span className="text-lg font-mono font-bold text-amber-400">
                                {(p.affinityScore * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Merch Artifact */}
                      <div className="p-4 rounded-lg bg-amber-500/[0.03] border border-amber-500/20 space-y-2">
                        <span className="text-xs font-mono uppercase text-amber-300">Limited Keepsake Merch Artifact</span>
                        <h4 className="text-sm font-semibold text-white">{blueprint.brandAestheticCollabs.merchConcept.item}</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">{blueprint.brandAestheticCollabs.merchConcept.designDetail}</p>
                        <p className="text-[11px] text-amber-400 font-mono">{blueprint.brandAestheticCollabs.merchConcept.collectorAppeal}</p>
                      </div>
                    </div>
                  )}

                  {/* ACTIVATIONS TAB */}
                  {activeTab === 'activations' && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h3 className="text-sm font-mono uppercase text-amber-400">Interactive Guest Activations</h3>
                        <p className="text-xs text-zinc-400">Experiential touchpoints connecting audience subculture to physical participation.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {blueprint.interactiveMoments.map((act, idx) => (
                          <div key={idx} className="p-4 rounded-lg bg-white/[0.02] border border-white/10 space-y-2">
                            <span className="text-[10px] font-mono uppercase text-amber-400">{act.culturalTouchpoint}</span>
                            <h4 className="text-sm font-semibold text-white">{act.title}</h4>
                            <p className="text-xs text-zinc-300 leading-relaxed">{act.description}</p>
                            <div className="p-2.5 rounded bg-black/40 border border-white/5 text-[11px] text-zinc-400">
                              <strong className="text-zinc-300">Guest Journey:</strong> {act.participantJourney}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* DISSONANCE AUDIT TAB */}
                  {activeTab === 'dissonance' && (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-sm font-mono uppercase text-amber-400">Cultural Dissonance & Cliché Audit</h3>
                        <p className="text-xs text-zinc-400">
                          Proof of Qloo's value: demonstrating how taste intelligence filters out destructive stereotypes.
                        </p>
                      </div>

                      <div className="space-y-3">
                        {blueprint.culturalDissonanceAudit.clichesAvoided.map((cl, idx) => (
                          <div key={idx} className="p-4 rounded-lg bg-white/[0.02] border border-white/10 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                                Cliché Avoided
                              </span>
                              <span className="text-xs text-rose-300 line-through">{cl.cliche}</span>
                            </div>
                            <div className="text-xs text-zinc-400">
                              <strong className="text-zinc-300">Why naive AI fell for it:</strong> {cl.whyNaiveAiChoseIt}
                            </div>
                            <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200">
                              <strong>Qloo Grounded Correction:</strong> {cl.qlooAlternative}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Cross Domain Matrix */}
                      <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10 space-y-3">
                        <span className="text-xs font-mono uppercase text-zinc-300">Pairwise Domain Resonance Matrix</span>
                        <div className="space-y-2">
                          {blueprint.culturalDissonanceAudit.crossDomainResonanceMatrix.map((matrix, idx) => (
                            <div key={idx} className="p-3 rounded bg-black/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <span className="text-xs font-semibold text-white">
                                  {matrix.domainA} × {matrix.domainB}
                                </span>
                                <p className="text-[11px] text-zinc-400">{matrix.insight}</p>
                              </div>
                              <span className="text-xs font-mono font-bold text-amber-400 shrink-0">
                                Resonance: {(matrix.resonanceScore * 100).toFixed(0)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* BUDGET TAB */}
                  {activeTab === 'budget' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="text-sm font-mono uppercase text-amber-400">Budget Allocation & Tactics</h3>
                          <p className="text-xs text-zinc-400">Total Budget: ${blueprint.budgetAllocation.totalBudget.toLocaleString()}</p>
                        </div>
                        <span className="text-xs font-mono px-2 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          {blueprint.brief.budgetTier.toUpperCase()} TIER
                        </span>
                      </div>

                      <div className="space-y-3">
                        {blueprint.budgetAllocation.breakdown.map((item, idx) => (
                          <div key={idx} className="p-4 rounded-lg bg-white/[0.02] border border-white/10 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-white">{item.category}</span>
                              <span className="text-xs font-mono font-bold text-amber-400">
                                ${item.amount.toLocaleString()} ({item.percentage}%)
                              </span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-amber-400 h-full rounded-full" style={{ width: `${item.percentage}%` }} />
                            </div>
                            <p className="text-[11px] text-zinc-400 pt-1 font-mono">{item.tacticalTips}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TIMELINE TAB */}
                  {activeTab === 'timeline' && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h3 className="text-sm font-mono uppercase text-amber-400">Execution Timeline & Producer Checklist</h3>
                        <p className="text-xs text-zinc-400">Chronological production roadmap to event day.</p>
                      </div>

                      <div className="space-y-3">
                        {blueprint.executionChecklist.map((phase, idx) => (
                          <div key={idx} className="p-4 rounded-lg bg-white/[0.02] border border-white/10 space-y-2">
                            <span className="text-xs font-mono font-bold text-amber-400 uppercase">{phase.timelinePhase}</span>
                            <ul className="space-y-1.5 text-xs text-zinc-300">
                              {phase.tasks.map((task, tidx) => (
                                <li key={tidx} className="flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                                  <span>{task}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AGENT TRACE TAB */}
                  {activeTab === 'trace' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="text-sm font-mono uppercase text-amber-400">Autonomous Agent Execution Trace</h3>
                          <p className="text-xs text-zinc-400">Complete auditable record of all tool dispatches & Qloo API calls.</p>
                        </div>
                        <span className="text-[11px] font-mono text-zinc-500">
                          {blueprint.agentExecutionTrace.length} Steps Logged
                        </span>
                      </div>

                      <div className="space-y-2 font-mono text-xs">
                        {blueprint.agentExecutionTrace.map(log => (
                          <div key={log.id} className="p-3 rounded-lg bg-black/60 border border-white/5 space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-amber-400 font-semibold">{log.tool}</span>
                              <span className="text-zinc-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-zinc-300 text-xs font-sans">{log.outputSummary}</p>
                            {log.qlooApiCalls && log.qlooApiCalls > 0 ? (
                              <span className="text-[10px] text-emerald-400 inline-block pt-1">
                                ⚡ Dispatched {log.qlooApiCalls} Qloo API call(s)
                              </span>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Blueprint Actions Footer */}
                <div className="p-4 border-t border-white/10 bg-black/40 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-zinc-500 font-mono">
                    CultureWeave AI Engine v1.0 • Grounded in Qloo Taste Graph
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadMarkdown}
                      className="px-3 py-1.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-xs text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download Dossier (.md)</span>
                    </button>

                    <button
                      onClick={() => {
                        const jsonStr = JSON.stringify(blueprint, null, 2);
                        navigator.clipboard.writeText(jsonStr);
                        alert('Full blueprint JSON copied to clipboard!');
                      }}
                      className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-xs text-zinc-300 border border-white/10 flex items-center gap-1.5 transition"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy JSON</span>
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-xs text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Export Production PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#121417] rounded-xl border border-white/10 p-12 text-center space-y-4">
                <Compass className="h-12 w-12 text-zinc-600 mx-auto" />
                <h3 className="text-base font-semibold text-zinc-300">Ready to Architect Your Experience</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Select a curated archetype or enter your custom brief on the left, then click "Synthesize Cultural Blueprint".
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL: API Key Configuration */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#14161b] rounded-2xl border border-white/10 max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Qloo Hackathon API Key</h3>
              </div>
              <button onClick={() => setShowKeyModal(false)} className="text-zinc-500 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              CultureWeave queries <code>https://hackathon.api.qloo.com</code> using your hackathon credential header <code>X-Api-Key</code>.
              Keys are never exposed to public repositories and run safely via server-side API routes.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium">Qloo API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="Enter Qloo Hackathon Key..."
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/60 font-mono transition"
              />
            </div>

            {savedKeySuccess && (
              <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>API Key saved securely!</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white transition"
              >
                Close
              </button>
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-1.5 rounded-lg text-xs bg-amber-500 hover:bg-amber-400 text-black font-semibold transition"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Live Qloo Endpoint Tester */}
      {showTester && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#14161b] rounded-2xl border border-white/10 max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Live Qloo API Diagnostic Tester</h3>
              </div>
              <button onClick={() => setShowTester(false)} className="text-zinc-500 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Directly queries Qloo canonical entity search (<code>/search</code>) to verify live API connectivity and inspection schemas.
            </p>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 space-y-1">
                <label className="text-[11px] text-zinc-400">Search Term</label>
                <input
                  type="text"
                  value={testerQuery}
                  onChange={e => setTesterQuery(e.target.value)}
                  placeholder="e.g. Nujabes, A24, Studio Ghibli"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400">Entity URN</label>
                <select
                  value={testerType}
                  onChange={e => setTesterType(e.target.value)}
                  className="w-full px-2 py-2 rounded-lg bg-[#181a1f] border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/60"
                >
                  <option value="urn:entity:artist">artist</option>
                  <option value="urn:entity:place">place</option>
                  <option value="urn:entity:movie">movie</option>
                  <option value="urn:entity:brand">brand</option>
                  <option value="urn:entity:book">book</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleRunSearchTester}
              disabled={testerLoading}
              className="w-full py-2 rounded-lg text-xs bg-amber-500 hover:bg-amber-400 text-black font-semibold flex items-center justify-center gap-1.5 transition"
            >
              {testerLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
              <span>Dispatch Live Search</span>
            </button>

            {/* Tester Results Display */}
            <div className="max-h-60 overflow-y-auto space-y-2 p-3 rounded-lg bg-black/60 border border-white/5 font-mono text-xs">
              {testerResults.length > 0 ? (
                testerResults.map((item, idx) => (
                  <div key={idx} className="p-2 rounded bg-white/[0.03] border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold">{item.name}</span>
                      <span className="text-[10px] text-amber-400">{item.type}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 block">ID: {item.id}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-zinc-600 text-xs">
                  {testerLoading ? 'Querying Qloo endpoint...' : 'No results returned yet. Click Dispatch.'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
