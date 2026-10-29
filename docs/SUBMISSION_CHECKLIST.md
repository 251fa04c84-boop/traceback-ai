# Builder.io Agent-Native Hackathon 2026 — Submission Checklist

**Submission Portal:** [Builder.io Hackathon](https://www.builder.io/hackathon/)  
**Deadline:** November 9, 2026 at 11:59 PM PT (Nov 10, 2026 at 1:29 PM IST)  
**Target Completion:** November 3, 2026 (Internal Code Freeze)  

---

## 1. Hackathon Deliverables Checklist

| Item | Requirement | Target Output | Status |
| :--- | :--- | :--- | :---: |
| **1. Agent-Native Codebase** | Public GitHub repo using Agent-Native framework patterns (`defineAction`, shared state) | Clean repo with full TypeScript code | Ready for dev |
| **2. Live Deployed URL** | Publicly accessible URL with zero paywall or login required | Vercel deployment (e.g. `traceback-ai.vercel.app`) | Pending deploy |
| **3. Video Demo Clip** | 2–3 minute video walking through problem, investigation, action execution, and verification | MP4 video + YouTube/Loom link | Script prepared |
| **4. Post-Mortem & Audit Trail** | Visible proof of deterministic verification and human approval | Built into app UI and post-mortem export | Designed |
| **5. Written Submission** | Complete Devpost / Portal write-up covering all 4 judging criteria | `docs/DEVPOST_SUBMISSION.md` | Pending |

---

## 2. Technical Quality Gates (Must Pass Before Submission)

- [ ] Zero unhandled console errors or hydration errors in Chrome/Firefox/Safari.
- [ ] Responsive design verified on mobile viewport (390px × 844px) and desktop (1440px).
- [ ] No API keys or secrets exposed in frontend bundles or repository files.
- [ ] All 3 incident scenarios execute reliably end-to-end.
- [ ] Action execution requires human approval for mutating actions.
- [ ] Deterministic health check accurately verifies resolution after action execution.
- [ ] Offline benchmark mode works reliably even without external API keys.
- [ ] Automated test runner (`npm test`) exits with code 0.

---

## 3. Submission Day Action Sequence

1. **T-24 Hours:** Code freeze. Run end-to-end test suite on deployed Vercel URL.
2. **T-12 Hours:** Record final 2-minute video demo using the approved demo script.
3. **T-6 Hours:** Populate the official Builder.io submission form with write-up, video URL, GitHub link, and live demo link.
4. **T-2 Hours:** Verify all links open in an incognito window.
5. **T-1 Hour:** Final submission confirmation and screenshot archived.
