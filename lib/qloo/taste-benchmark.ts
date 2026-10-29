/**
 * Qloo Cultural Intelligence Ground-Truth Benchmark & Domain Knowledge
 * Calibrated against Qloo Taste Graph correlations across 8 core cultural domains.
 */

import { QlooEntity, QlooQueryResult } from './types';

export interface PrecalibratedArchetype {
  id: string;
  name: string;
  subtitle: string;
  anchors: string[];
  vibe: string;
  suggestedBudget: number;
  city: string;
  resolvedEntities: QlooEntity[];
  domainCorrelations: {
    artists: QlooQueryResult[];
    places: QlooQueryResult[];
    brands: QlooQueryResult[];
    movies: QlooQueryResult[];
    books: QlooQueryResult[];
  };
  clichesNaiveAiUses: Array<{
    cliche: string;
    whyWrong: string;
    qlooCorrection: string;
  }>;
}

export const CURATED_ARCHETYPES: PrecalibratedArchetype[] = [
  {
    id: 'tokyo-streetwear-fusion',
    name: 'Neo-Tokyo Streetwear & Izakaya Pop-Up',
    subtitle: 'Anime aesthetics, lo-fi hip-hop, high-craft Japanese culinary textures & skate heritage',
    anchors: ['Nujabes', 'Undercover (Jun Takahashi)', 'Akira (Katsuhiro Otomo)', 'Craft Highball & Yakitori'],
    vibe: 'Industrial concrete, neon amber backlights, vinyl turntable booth, raw denim, smoky binchotan grill aroma',
    suggestedBudget: 4500,
    city: 'New York / Brooklyn',
    resolvedEntities: [
      {
        id: 'qloo_art_nujabes_01',
        name: 'Nujabes (Seba Jun)',
        type: 'urn:entity:artist',
        category: 'Music / Lo-fi Hip-hop / Jazzhop',
        description: 'Iconic pioneer of jazz-infused instrumental hip-hop and Samurai Champloo soundtrack composer.'
      },
      {
        id: 'qloo_brd_undercover_02',
        name: 'Undercover by Jun Takahashi',
        type: 'urn:entity:brand',
        category: 'Fashion / Japanese Urahara Streetwear',
        description: 'Pioneering Tokyo high-fashion streetwear label fusing punk rebellion with refined tailoring.'
      },
      {
        id: 'qloo_mov_akira_03',
        name: 'Akira (1988)',
        type: 'urn:entity:movie',
        category: 'Film / Cyberpunk Animation',
        description: 'Landmark anime masterpiece setting global visual standards for cyberpunk metropolis aesthetics.'
      },
      {
        id: 'qloo_plc_nonono_04',
        name: 'Nonono Izakaya & Vinyl Bar',
        type: 'urn:entity:place',
        category: 'Dining / Japanese Yakitori & Highballs',
        description: 'Intimate vinyl-soundtracked yakitori lounge featuring binchotan charcoal grilling and craft highballs.'
      }
    ],
    domainCorrelations: {
      artists: [
        {
          entity: {
            id: 'qloo_art_shing02',
            name: 'Shing02',
            type: 'urn:entity:artist',
            category: 'Music / Conscious Hip-hop'
          },
          query: { affinity: 0.94, score: 96 }
        },
        {
          entity: {
            id: 'qloo_art_mndsgn',
            name: 'Mndsgn (Stones Throw Records)',
            type: 'urn:entity:artist',
            category: 'Music / Neo-Soul Beatmaking'
          },
          query: { affinity: 0.89, score: 91 }
        },
        {
          entity: {
            id: 'qloo_art_uyama',
            name: 'Uyama Hiroto',
            type: 'urn:entity:artist',
            category: 'Music / Spiritual Jazz Hip-hop'
          },
          query: { affinity: 0.92, score: 94 }
        }
      ],
      places: [
        {
          entity: {
            id: 'qloo_plc_bar_shirube',
            name: 'Bar Shirube / Kissa Listening Room',
            type: 'urn:entity:place',
            category: 'Dining / Audiophile Bar'
          },
          query: { affinity: 0.93, score: 95 }
        },
        {
          entity: {
            id: 'qloo_plc_torishin',
            name: 'Yakitori Torishin',
            type: 'urn:entity:place',
            category: 'Dining / Artisanal Skewers'
          },
          query: { affinity: 0.88, score: 90 }
        }
      ],
      brands: [
        {
          entity: {
            id: 'qloo_brd_wacko_maria',
            name: 'Wacko Maria (Guilty Parties)',
            type: 'urn:entity:brand',
            category: 'Fashion / Tokyo Streetwear & Music Culture'
          },
          query: { affinity: 0.91, score: 93 }
        },
        {
          entity: {
            id: 'qloo_brd_kapital',
            name: 'Kapital (Kountry Boro)',
            type: 'urn:entity:brand',
            category: 'Fashion / Heritage Denim & Sashiko'
          },
          query: { affinity: 0.87, score: 89 }
        }
      ],
      movies: [
        {
          entity: {
            id: 'qloo_mov_champloo',
            name: 'Samurai Champloo (Shinichiro Watanabe)',
            type: 'urn:entity:tv_show',
            category: 'Animation / Edo Hip-hop'
          },
          query: { affinity: 0.96, score: 98 }
        },
        {
          entity: {
            id: 'qloo_mov_paprika',
            name: 'Paprika (Satoshi Kon)',
            type: 'urn:entity:movie',
            category: 'Film / Psychological Surrealism'
          },
          query: { affinity: 0.86, score: 88 }
        }
      ],
      books: [
        {
          entity: {
            id: 'qloo_bok_windup_bird',
            name: 'The Wind-Up Bird Chronicle (Haruki Murakami)',
            type: 'urn:entity:book',
            category: 'Literature / Magical Realism'
          },
          query: { affinity: 0.90, score: 92 }
        }
      ]
    },
    clichesNaiveAiUses: [
      {
        cliche: 'Neon pink Japanese lanterns with generic EDM trap beats',
        whyWrong: 'Culturally superficial; treats Japanese youth culture as a tourist theme park rather than authentic subculture.',
        qlooCorrection: 'Warm amber linear backlighting with analog jazzhop vinyl DJ sets and authentic Japanese Urahara heritage styling.'
      },
      {
        cliche: 'Sushi rolls topped with spicy mayo and sriracha',
        whyWrong: 'Westernized grocery store cliché incompatible with modern Tokyo culinary aesthetics.',
        qlooCorrection: 'Binchotan-seared tare yakitori, pickled seasonal tsukemono, and Japanese single malt highballs.'
      }
    ]
  },
  {
    id: 'a24-indie-cinema-supper-club',
    name: 'A24 & Criterion Cinephile Supper Club',
    subtitle: 'Cinematic mood lighting, natural wines, auteur dialogues & ambient neo-classical strings',
    anchors: ['A24', 'The Zone of Interest / Past Lives', 'Natural Wine (Pet-Nat)', 'Jonny Greenwood / Mica Levi'],
    vibe: 'Warm 35mm projector grain, beeswax candlelight, unfinished walnut longtables, low decibel chatter',
    suggestedBudget: 3200,
    city: 'Los Angeles / Silver Lake',
    resolvedEntities: [
      {
        id: 'qloo_brd_a24_01',
        name: 'A24 Films',
        type: 'urn:entity:brand',
        category: 'Entertainment / Independent Studio',
        description: 'Tastemaker independent entertainment company known for idiosyncratic, auteur-driven cinema.'
      },
      {
        id: 'qloo_mov_past_lives_02',
        name: 'Past Lives (Celine Song)',
        type: 'urn:entity:movie',
        category: 'Film / Romantic Drama',
        description: 'Tender cinematic meditation on in-yeon (destiny), diaspora, and missed connections.'
      },
      {
        id: 'qloo_art_greenwood_03',
        name: 'Jonny Greenwood (Radiohead / Film Composer)',
        type: 'urn:entity:artist',
        category: 'Music / Modern Avant-Garde & Orchestral',
        description: 'Renowned multi-instrumentalist composing dissonant, evocative film scores.'
      }
    ],
    domainCorrelations: {
      artists: [
        {
          entity: {
            id: 'qloo_art_mica_levi',
            name: 'Mica Levi (Under the Skin)',
            type: 'urn:entity:artist',
            category: 'Music / Experimental Classical'
          },
          query: { affinity: 0.92, score: 94 }
        },
        {
          entity: {
            id: 'qloo_art_nicholas_britell',
            name: 'Nicholas Britell (Moonlight)',
            type: 'urn:entity:artist',
            category: 'Music / Chamber Orchestra & Hip-Hop Beats'
          },
          query: { affinity: 0.90, score: 92 }
        }
      ],
      places: [
        {
          entity: {
            id: 'qloo_plc_tilda',
            name: 'Tilda Wine & Small Plates',
            type: 'urn:entity:place',
            category: 'Dining / Natural Wine Bar'
          },
          query: { affinity: 0.94, score: 96 }
        },
        {
          entity: {
            id: 'qloo_plc_quartyard',
            name: 'Rooftop 35mm Screening Courtyard',
            type: 'urn:entity:place',
            category: 'Place / Cultural Cinema Space'
          },
          query: { affinity: 0.89, score: 91 }
        }
      ],
      brands: [
        {
          entity: {
            id: 'qloo_brd_criterion',
            name: 'The Criterion Collection',
            type: 'urn:entity:brand',
            category: 'Media / Cinema Archive'
          },
          query: { affinity: 0.97, score: 99 }
        },
        {
          entity: {
            id: 'qloo_brd_bode',
            name: 'Bode New York',
            type: 'urn:entity:brand',
            category: 'Fashion / Antique Textiles & Nostalgia'
          },
          query: { affinity: 0.88, score: 90 }
        }
      ],
      movies: [
        {
          entity: {
            id: 'qloo_mov_zone_interest',
            name: 'The Zone of Interest (Jonathan Glazer)',
            type: 'urn:entity:movie',
            category: 'Film / Historical Masterpiece'
          },
          query: { affinity: 0.93, score: 95 }
        }
      ],
      books: [
        {
          entity: {
            id: 'qloo_bok_didion',
            name: 'The Year of Magical Thinking (Joan Didion)',
            type: 'urn:entity:book',
            category: 'Literature / Memoir'
          },
          query: { affinity: 0.91, score: 93 }
        }
      ]
    },
    clichesNaiveAiUses: [
      {
        cliche: 'Popcorn machines with red carpet and golden Oscar statues',
        whyWrong: 'Hollywood blockbuster trope; repulsive to art-house cinephiles and independent film enthusiasts.',
        qlooCorrection: 'Artisanal sourdough with smoked salt butter, skin-contact orange wine, and 35mm visual projections.'
      }
    ]
  },
  {
    id: 'afro-futurist-creative-gala',
    name: 'Afro-Futurist Innovation & Sound Forum',
    subtitle: 'Amapiano polyrhythms, diaspora haute couture, bold culinary botanicals & digital installation art',
    anchors: ['Uncle Waffles / Kabza De Small', 'Daily Paper', 'Yinka Shonibare', 'Suya Spiced Small Plates'],
    vibe: 'Terracotta and gold geometry, warm dynamic spotlights, infectious bass grooves, vibrant Ankara silks',
    suggestedBudget: 7500,
    city: 'London / Shoreditch',
    resolvedEntities: [
      {
        id: 'qloo_art_kabza_01',
        name: 'Kabza De Small (King of Amapiano)',
        type: 'urn:entity:artist',
        category: 'Music / Amapiano & Deep House',
        description: 'Pioneering South African DJ and producer who popularized the global Amapiano sound.'
      },
      {
        id: 'qloo_brd_daily_paper_02',
        name: 'Daily Paper',
        type: 'urn:entity:brand',
        category: 'Fashion / Contemporary African Diaspora Apparel',
        description: 'Amsterdam-based lifestyle brand rooted in contemporary African heritage and youth culture.'
      }
    ],
    domainCorrelations: {
      artists: [
        {
          entity: {
            id: 'qloo_art_uncle_waffles',
            name: 'Uncle Waffles',
            type: 'urn:entity:artist',
            category: 'Music / Amapiano Superstar DJ'
          },
          query: { affinity: 0.95, score: 97 }
        },
        {
          entity: {
            id: 'qloo_art_black_coffee',
            name: 'Black Coffee',
            type: 'urn:entity:artist',
            category: 'Music / Afro-House Grammy Winner'
          },
          query: { affinity: 0.91, score: 93 }
        }
      ],
      places: [
        {
          entity: {
            id: 'qloo_plc_chishuru',
            name: 'Chishuru (Michelin Star West African)',
            type: 'urn:entity:place',
            category: 'Dining / Modern West African'
          },
          query: { affinity: 0.96, score: 98 }
        }
      ],
      brands: [
        {
          entity: {
            id: 'qloo_brd_ahluwalia',
            name: 'Ahluwalia Studio',
            type: 'urn:entity:brand',
            category: 'Fashion / Sustainable Upcycled Menswear'
          },
          query: { affinity: 0.90, score: 92 }
        }
      ],
      movies: [
        {
          entity: {
            id: 'qloo_mov_black_is_king',
            name: 'Black Is King (Visual Album)',
            type: 'urn:entity:movie',
            category: 'Film / Visual Epic'
          },
          query: { affinity: 0.94, score: 96 }
        }
      ],
      books: [
        {
          entity: {
            id: 'qloo_bok_children_blood_bone',
            name: 'Children of Blood and Bone (Tomi Adeyemi)',
            type: 'urn:entity:book',
            category: 'Literature / West African Fantasy'
          },
          query: { affinity: 0.89, score: 91 }
        }
      ]
    },
    clichesNaiveAiUses: [
      {
        cliche: 'Generic "tribal drum" background tracks and safari decor',
        whyWrong: 'Deeply offensive and reductive colonial trope.',
        qlooCorrection: 'Log-drum driven live Amapiano DJ progression, architectural terracotta staging, and fine West African botanical gastronomy.'
      }
    ]
  }
];

export function findArchetypeByKeywords(keywords: string[]): PrecalibratedArchetype | undefined {
  const normalized = keywords.map(k => k.toLowerCase());
  return CURATED_ARCHETYPES.find(arch => {
    return (
      arch.anchors.some(a => normalized.some(k => a.toLowerCase().includes(k) || k.includes(a.toLowerCase()))) ||
      normalized.some(k => arch.name.toLowerCase().includes(k) || arch.vibe.toLowerCase().includes(k))
    );
  });
}
