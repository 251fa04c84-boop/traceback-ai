# Builder.io Agent-Native Hackathon 2026 — Requirements and Readiness

**Checked:** November 5, 2026  
**Official rules:** https://www.builder.io/hackathon/rules  
**Hackathon overview:** https://www.builder.io/hackathon  
**Framework:** https://github.com/BuilderIO/agent-native

## Deadline

**Monday, November 9, 2026 at 11:59 PM Pacific Time**  
Equivalent to **Tuesday, November 10 at 07:59 UTC / 13:29 India Standard Time**.

Submit before the deadline and verify the confirmation receipt. A public repository or a recorded Clips video does not, by itself, submit an entry.

## Official entry requirements

1. Build a functional application using Agent-Native.
2. Submit original work or meaningful new development completed during the hackathon (which began October 27, 2026).
3. Identify pre-existing work, templates, libraries, third-party assets, and what changed during the event.
4. Provide a project description, creator/team details, contact information, and an accessible demonstration.
5. Record a **public Clips demonstration** showing the actual application in use. The recording must be viewable without a login or access request.
6. Submit the required details and public Clips URL through the official project submission form.
7. Agree to the Official Rules and confirm eligibility. Every participant must be at least 18 or the age of legal majority in their jurisdiction, whichever is higher.

## Judging rubric

| Criterion | Weight | TraceBack focus |
| --- | ---: | --- |
| Usefulness and Execution | 40% | A complete incident investigation flow with traceable telemetry, logs, deployment evidence, and a reviewable plan |
| Creativity and Design | 20% | A focused incident command workspace rather than a generic chat wrapper |
| Innovation | 20% | An agent that correlates operational evidence and prepares a recovery plan for human review |
| Cleverness and Use of Agent-Native | 20% | Official `defineAction` capabilities shared by the agent and the UI |

## TraceBack implementation disclosure

### Existing project work
The repository retains an earlier custom Next.js incident workspace and deterministic incident scenarios. It is preserved as prior project work and must not be represented as newly authored Agent-Native framework code.

### Hackathon development
The Agent-Native app under `agent-native-poc/` adapts the official Chat starter template for TraceBack. The project adds typed read-only actions for listing incidents, retrieving incident evidence, and producing a five-stage investigation brief; incident routes; TraceBack-specific agent instructions; action tests; and a domain-specific overview.

### Template and third-party dependencies
The app uses the Agent-Native Chat starter from `@agent-native/core@0.223.0`, plus the framework Toolkit and packages declared in `agent-native-poc/package.json`. Their upstream licenses apply. Disclose the template and third-party packages in the entry.

## Current readiness audit — November 5

| Requirement | Status | Evidence / remaining work |
| --- | --- | --- |
| Official Agent-Native code in the app | Implemented in the isolated app | `agent-native-poc/actions/` contains `defineAction` actions; the Agent-Native Vercel project targets this folder |
| Five-stage investigation brief | Implemented in source | New action, incident detail UI, and action tests added; latest CI still needs to pass |
| Three incident scenarios | Implemented as benchmark data | Manual tests were previously completed in the legacy app; repeat them on the Agent-Native deployment |
| Runtime deployment | In progress | First runtime smoke test found missing `yjs`; direct dependency and lockfile fix added; verify a fresh deployment |
| Agent chat with a configured model | Not yet verified | Confirm an AI provider is configured and test a real chat turn using shared incident actions |
| Public access without Vercel SSO | Configured on the isolated Vercel project | Verify in an incognito browser; application authentication remains enabled |
| Public Clips video | Not complete | Record the final Agent-Native app, publish the clip, and verify public access |
| Official submission | Not complete | Complete the form and confirm receipt |

## Submission links

- Rules: https://www.builder.io/hackathon/rules
- Submission form: https://www.builder.io/hackathon/submit
- Clips: https://clips.agent-native.com/

Do not mark any item complete until the exact current deployment or submission receipt has been checked.
