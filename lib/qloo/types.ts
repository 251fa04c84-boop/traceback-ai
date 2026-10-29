/**
 * Qloo API & Cultural Intelligence Data Types
 * Official Hackathon 2026 Reference Implementation
 */

// Supported URN Entity Types in Qloo
export type QlooEntityType =
  | 'urn:entity:artist'
  | 'urn:entity:place'
  | 'urn:entity:movie'
  | 'urn:entity:tv_show'
  | 'urn:entity:book'
  | 'urn:entity:brand'
  | 'urn:entity:video_game'
  | 'urn:entity:podcast'
  | 'urn:entity:destination'
  | 'urn:entity:person';

export interface QlooEntity {
  id: string;
  name: string;
  type: QlooEntityType | string;
  category?: string;
  description?: string;
  imageUrl?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface QlooQueryResult {
  entity: QlooEntity;
  query: {
    affinity: number; // 0.00 to 1.00 empirical affinity score
    score?: number;
    confidence?: number;
  };
}

export interface QlooInsightsResponse {
  success: boolean;
  duration?: number;
  results: QlooQueryResult[];
  error?: string;
}

export interface QlooSearchResponse {
  success: boolean;
  results: Array<{
    id: string;
    name: string;
    type: string;
    category?: string;
    disambiguation?: string;
    imageUrl?: string;
  }>;
  error?: string;
}

export interface QlooTag {
  id: string;
  name: string;
  category: string;
}

export interface QlooTagsResponse {
  success: boolean;
  results: QlooTag[];
}

/**
 * Cultural Experience Design Brief
 */
export interface CulturalBrief {
  title: string;
  targetAudience: string;
  purpose: 'launch_event' | 'brand_activation' | 'curated_popup' | 'festival_stage' | 'community_supper_club' | 'experiential_retail';
  culturalAnchors: string[]; // e.g. ["Tyler, The Creator", "A24", "Natural Wine", "Retro Gaming"]
  budgetTier: 'guerrilla' | 'independent' | 'enterprise';
  budgetAmount?: number;
  cityLocation?: string;
  desiredAtmosphere: string; // e.g. "Warm, analog, neo-tokyo cyberpunk, intimate"
  constraints?: string[];
}

/**
 * Agent Execution Step Log
 */
export interface AgentActionLog {
  id: string;
  timestamp: string;
  phase: 'deconstruct' | 'resolve_anchors' | 'taste_graph_traversal' | 'dissonance_audit' | 'blueprint_synthesis' | 'coherence_evaluation';
  tool: string;
  input: Record<string, any>;
  outputSummary: string;
  status: 'pending' | 'running' | 'success' | 'warning' | 'error';
  qlooApiCalls?: number;
}

/**
 * Production Experience Blueprint Output
 */
export interface ExperienceBlueprint {
  id: string;
  brief: CulturalBrief;
  createdAt: string;
  culturalCoherenceScore: number; // 0 to 100 Coherence Index
  archetype: {
    name: string;
    tagline: string;
    essence: string;
  };
  anchorsResolved: Array<{
    term: string;
    resolvedEntity: QlooEntity;
    canonicalUrn: string;
  }>;
  vibeArchitecture: {
    aestheticName: string;
    lightingDesign: string;
    spatialFlow: string;
    materialPalette: string[];
    scentAtmosphere: string;
  };
  auditoryIdentity: {
    sonicDirection: string;
    qlooRecommendedArtists: Array<{
      artist: QlooEntity;
      affinityScore: number;
      curatorialRole: 'Headliner' | 'Opening Ambience' | 'Late Night DJ Set';
      whyQlooSelected: string;
    }>;
    sampleSetlistProgression: string[];
  };
  culinaryProgram: {
    concept: string;
    dishes: Array<{
      name: string;
      description: string;
      culturalOrigin: string;
      flavorProfile: string;
    }>;
    beveragePairings: Array<{
      name: string;
      type: 'cocktail' | 'zero_proof' | 'wine' | 'craft_brew';
      tastingNotes: string;
      culturalResonance: string;
    }>;
    hospitalityStyle: string;
  };
  brandAestheticCollabs: {
    fashionDirection: string;
    potentialPartnerships: Array<{
      brand: QlooEntity;
      affinityScore: number;
      activationIdea: string;
      whyQlooSelected: string;
    }>;
    merchConcept: {
      item: string;
      designDetail: string;
      collectorAppeal: string;
    };
  };
  interactiveMoments: Array<{
    title: string;
    description: string;
    participantJourney: string;
    culturalTouchpoint: string;
  }>;
  culturalDissonanceAudit: {
    clichesAvoided: Array<{
      cliche: string;
      whyNaiveAiChoseIt: string;
      qlooAlternative: string;
      empiricalReasoning: string;
    }>;
    crossDomainResonanceMatrix: Array<{
      domainA: string;
      domainB: string;
      resonanceScore: number;
      insight: string;
    }>;
  };
  budgetAllocation: {
    totalBudget: number;
    breakdown: Array<{
      category: string;
      amount: number;
      percentage: number;
      tacticalTips: string;
    }>;
  };
  executionChecklist: Array<{
    timelinePhase: 'T-Minus 4 Weeks' | 'T-Minus 2 Weeks' | 'Production Week' | 'Day of Show';
    tasks: string[];
  }>;
  comparativeBenchmark: {
    naiveAiOutputSummary: string;
    qlooAdvantageSummary: string;
    affinityDeltaPercentage: number;
  };
  agentExecutionTrace: AgentActionLog[];
}
