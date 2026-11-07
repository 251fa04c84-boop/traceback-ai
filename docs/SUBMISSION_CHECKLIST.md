# Builder.io Agent-Native Hackathon 2026 — Submission Checklist

**Deadline:** November 9, 2026 at 11:59 PM PT (November 10 at 13:29 IST).  
**Official form:** https://www.builder.io/hackathon/submit  
**Rules:** https://www.builder.io/hackathon/rules

## Engineering release gates

- [ ] Latest Agent-Native Vercel deployment is Ready on the exact PR head commit.
- [ ] Runtime smoke test succeeds; no missing package or server crash.
- [ ] Public app URL opens without Vercel SSO or access request.
- [ ] App authentication and sign-up flow work.
- [ ] AI provider is configured; agent completes a real chat turn using shared TraceBack actions.
- [ ] Incident list returns all three scenarios.
- [ ] Checkout investigation shows latest 43.5%, peak 44.1%, and initial 42.8% accurately.
- [ ] Session investigation cites OOMKilled and unbounded cache evidence.
- [ ] Database investigation connects SQLSTATE 53300 with HikariPool timeout evidence.
- [ ] All five stages render for all three incidents.
- [ ] Unknown incident IDs fail safely.
- [ ] The public app clearly labels all scenarios as simulated and read-only.
- [ ] Agent never claims an action was executed or an incident was resolved.
- [ ] Typecheck, action tests, Agent-Native doctor, build, and CI pass on the exact candidate commit.
- [ ] Mobile and desktop layouts are checked manually.

## Public demo gates

- [ ] Record the actual Agent-Native app using `docs/DEMO_SCRIPT.md`.
- [ ] Do not record the legacy Next.js dashboard as the Agent-Native app.
- [ ] Publish a public Clips video that opens without login or access request.
- [ ] Check the video and audio, ensure no personal secrets are visible, and verify the URL while signed out.
- [ ] Add the public Clips URL to the submission draft.

## Official submission

- [ ] Confirm every creator/team member meets the eligibility requirements.
- [ ] Disclose the earlier custom Next.js work and the Agent-Native Chat starter template.
- [ ] Include all relevant third-party libraries/assets and accurate work dates.
- [ ] Enter project title, description, contact details, GitHub link, live app URL, and public Clips URL.
- [ ] Agree to the Official Rules.
- [ ] Submit before the deadline.
- [ ] Verify the confirmation receipt and save it.

**Do not mark a box complete based only on source code or a successful build. Verify the deployed experience.**
