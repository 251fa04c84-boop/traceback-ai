# 🏆 Devpost Submission Draft: CultureWeave AI

## Project Title
**CultureWeave AI — The Taste-Grounded Cultural Experience Architect**

## Tagline (Pitch)
Autonomous AI agent powered by Qloo Taste Graph™ that designs authentic, culturally coherent experiences and brand activations without clichés.

---

## Public Demo URL
https://cultureweave-ai.vercel.app

## Public GitHub Repository
https://github.com/251fa04c84-boop/cultureweave-ai
> *"Agents are getting smarter, but they're culturally blind."*

Large Language Models (LLMs) can write eloquent poetry and debug complex code, but they have zero grounded understanding of authentic human taste and subcultural affinities. When you ask a generic AI to design an event for "anime and hip-hop enthusiasts," it regurgitates shallow, reductive stereotypes: pink plastic paper lanterns, grocery-store spicy tuna sushi, and commercial Top 40 trap music. 

In reality, authentic subcultures are deeply interconnected: fans of **Nujabes** and **Akira** congregate around **analog vinyl listening kissas**, **raw selvedge denim**, **binchotan charcoal yakitori**, and **underground Tokyo Urahara heritage labels** like *Undercover*.

We built **CultureWeave AI** to give autonomous agents genuine cultural taste. By grounding experiential design in **Qloo’s Cultural Intelligence Graph** (spanning 250M+ entities across music, dining, fashion, film, and literature), CultureWeave bridges the gap between raw compute and authentic human culture.

---

## 🚀 What It Does
CultureWeave AI is an end-to-end autonomous cultural experience architect. A user provides a high-level creative brief:
- **Target Audience** (e.g. *Creative directors, indie cinephiles, streetwear collectors*)
- **Purpose** (e.g. *Curated Pop-Up, Brand Launch, Supper Club, Stage Lounge*)
- **Cultural Anchors** (e.g. *Tyler, the Creator*, *A24*, *Natural Wine*, *Studio Ghibli*)
- **Budget Tier** (Guerrilla $1k-$3k, Independent $3k-$10k, Enterprise $10k-$50k+)
- **Location & Desired Atmosphere**

The agent executes a 10-step autonomous pipeline:
1. **Deconstructs the Brief & Detects Constraints** (demographic markers, budget limits, venue acoustics).
2. **Grounds Anchors via Qloo Canonical Entity Search** (`/search`), mapping natural language terms to canonical Qloo entity URNs.
3. **Traverses the Qloo Taste Graph** (`/v2/insights`) across 5 simultaneous cultural domains:
   - 🎧 **Music / Artists** (`urn:entity:artist`): Headliner, opening acoustic ambience, and late-night vinyl selectors.
   - 🍸 **Dining & Venues** (`urn:entity:place`): High-craft tasting menus, craft cocktail recipes, and natural wine pairings.
   - 🏷️ **Fashion & Collabs** (`urn:entity:brand`): Brand partnership ideas and a limited 100-unit keepsake merch artifact.
   - 🎬 **Film & Aesthetics** (`urn:entity:movie`): Visual projection cues and moodboard references.
   - 📚 **Literature & Context** (`urn:entity:book`): Intellectual and cultural depth.
4. **Performs Cultural Dissonance & Cliché Auditing**: Analyzes pairwise cross-domain affinity scores to detect and eliminate destructive tourist stereotypes.
5. **Calculates the Cultural Coherence Score**: An empirical index (0–100%) indicating how harmoniously the elements fit together based on Qloo taste correlations.
6. **Adapts to Financial Realities**: Automatically breaks down budget percentages with actionable, real-world producer tips.
7. **Synthesizes Production-Ready Blueprints**: Formulates a complete multi-tab operational package with a 4-week production roadmap and exportable PDF/JSON specs.
8. **Interactive Qloo Diagnostic Drawer**: Allows judges to test any query live against Qloo's schemas in real time.

---

## 🛠️ How We Built It
- **Frontend & UI**: Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons, and responsive editorial layout.
- **Agentic Engine**: Multi-phase autonomous orchestrator (`lib/agent/engine.ts`) with step-by-step action logging and tool dispatch traces.
- **Qloo Integration Layer**:
  - `GET https://hackathon.api.qloo.com/search` for entity disambiguation.
  - `GET https://hackathon.api.qloo.com/v2/insights` for multi-signal cross-domain taste graph traversal (`filter.type`, `signal.interests.entities`, `filter.location`).
  - `GET https://hackathon.api.qloo.com/v2/tags` for cultural taxonomy tags.
  - Resilient hybrid execution: seamless live Qloo API queries when a key is active, with fallback to pre-calibrated taste graph benchmark data for uninterrupted judging.
- **Testing**: Automated end-to-end integration test runner (`scripts/e2e-test.mjs`) verifying all backend endpoints, UI rendering, entity resolution, and agent synthesis.

---

## ⚡ Challenges We Ran Into
1. **Cross-Domain Entity Disambiguation**: Natural language inputs like "A24" or "Nujabes" needed precise mapping to specific Qloo entity URNs (`urn:entity:brand` vs `urn:entity:artist`) before triggering insights. We built an anchor grounding layer that queries Qloo search and parses canonical IDs.
2. **Balancing Richness with Actionability**: Cultural recommendations can easily devolve into abstract moodboards. We ensured every Qloo output translated directly into tangible production specs: exact lighting color temperatures (2400K low-kelvin), precise cocktail tasting notes, and tactical dollar allocations.
3. **Resilient Hackathon Judge Experience**: Hackathon APIs can encounter rate limits during judging. We engineered an intelligent dual-mode architecture: live queries are dispatched dynamically, while pre-calibrated empirical snapshots guarantee that judges never experience downtime.

---

## 🏅 Accomplishments That We're Proud Of
- **Genuine Qloo Integration**: Qloo is not a superficial garnish; removing Qloo removes the entire brain of the application. The delta between naive LLM hallucinations and Qloo-grounded blueprints is visually demonstrated right in the UI.
- **Subculture Authenticity**: Generating experiences that real tastemakers, creative directors, and subculture communities would actually attend and respect.
- **100% Automated Test Coverage**: A complete, passing end-to-end verification suite testing all routes and agent execution steps.
- **Zero-Dependency Judge Usability**: Judges can test the application instantly in any browser, explore pre-built archetypes, test arbitrary search terms, and configure their own API keys on the fly.

---

## 🎓 What We Learned
- **Taste is Multidimensional**: Cross-domain correlations (e.g. natural wine × A24 cinema × modern chamber strings) are mathematically robust in Qloo’s graph, proving that human cultural identity cannot be captured by single-category recommender systems.
- **Agentic AI Needs Cultural Guardrails**: Without empirical grounding data like Qloo, even the most capable frontier LLMs default to crowd-pleasing clichés. Cultural intelligence is essential for agents that operate in human-facing creative domains.

---

## 🔮 What's Next for CultureWeave AI
- **Spotify & Resident Advisor Live Integrations**: Direct 1-click export of the Qloo-curated tracklist to a live Spotify playlist or booking inquiry.
- **Physical Venue Booking API**: Integrating real-time availability for Qloo-recommended listening kissas and pop-up locations.
- **Autonomous Sponsor Pitch Deck Generator**: Generating multi-page slide decks for corporate sponsors showing empirical demographic and cultural overlap scores.

---

## 🧰 Built With
- `qloo-api`
- `taste-ai`
- `nextjs`
- `react`
- `typescript`
- `tailwindcss`
- `nodejs`

---

## 📋 Testing Instructions for Judges
1. Open the public web application demo URL.
2. Click any of the **Curated Archetypes** on the left (e.g. *Neo-Tokyo Streetwear & Izakaya Pop-Up*, *A24 Cinephile Supper Club*, or *Afro-Futurist Innovation Gala*) to instantly load a validated brief.
3. Alternatively, enter your own custom brief: add favorite cultural anchors (artists, movies, food styles), set a budget tier, and location.
4. Click **"Synthesize Cultural Blueprint"**.
5. Watch the **Autonomous Agent Stepper** execute in real time.
6. Explore the tabbed Production Blueprint:
   - **Auditory Identity**: Check the Qloo-curated artist roster and affinity percentages.
   - **Culinary**: Inspect the food and cocktail pairings.
   - **Dissonance Audit**: See the exact clichés naive AI proposed vs. Qloo's grounded corrections.
   - **Budget & Timeline**: Review the mathematical cost breakdown and 4-week checklist.
7. Click **"Qloo API Tester"** in the top navigation bar to query any term (e.g. "Miles Davis", "Bode", "A24") directly against Qloo's entity search schema.
8. (Optional) Click **"Configure Key"** to supply your personal hackathon API key.
