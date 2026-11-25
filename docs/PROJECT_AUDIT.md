# SchemeReady AI repository audit

## Repository inspected

- Source archive: `Lucky_Project.zip`
- Original archive size: approximately 185.5 MB compressed.
- Source/config/test files extracted for inspection: 29 files.
- Large archive contents included generated `.next` output and `node_modules`; neither is required in the source handoff.
- Existing framework: Next.js 15 App Router, React 19, TypeScript.

## Existing features found

| Feature | Initial status | Notes |
|---|---|---|
| Landing page | Implemented | Visual marketing page, rebranded in this update |
| Onboarding | Implemented | Profile captured locally |
| Dashboard | Partial | Initially contained unsupported forecast/score; forecast removed |
| Scheme discovery | Partial | 56 local demo records; not a verified nationwide dataset |
| Eligibility | Partial | Existing deterministic checks; upgraded result model and explanation fields |
| Scheme details | Partial | Details and checklist exist; source records need verification |
| Saved schemes | Implemented locally | Browser storage only |
| Proof checklist | Partial | Basic checkboxes exist; no status taxonomy or reuse by document record |
| Action plan PDF | Implemented | Client-side PDF, not a verified official plan |
| Assistant | Demo only | Scripted responses; not a live LLM/RAG service |
| Multilingual | Partial | English/Hindi/Telugu navigation foundation; not complete translated scheme content or voice |
| Application tracker | Partial | Submitted toggle only; local/self-reported |
| Document vault | Missing | No secure upload/storage |
| Scheme change radar | Missing | No source versioning or change verification workflow in the original app |
| Authentication/database | Missing | No connected Supabase backend in inspected source |
| Admin dashboard | Missing | No protected admin workflows in inspected source |
| Notifications/reminders | Missing | No delivery integration |
| PWA/offline | Missing | No service worker/manifest implementation found |

## Changes in this iteration

- Rebranded UI and metadata to SchemeReady AI.
- Updated landing-page positioning around discovering benefits and preparing applications.
- Removed the additive annual benefit forecast from the dashboard.
- Replaced synthetic opportunity scoring with document checklist completion percentage.
- Removed percentage-based profile-fit labels.
- Added explicit scheme verification metadata. PM-KISAN and Telangana ePASS now have official source candidates marked `pending_review`; other inherited catalogue records remain `demo_unverified`. No record is yet marked fully verified. PM-KISAN uses its official portal as a source candidate; Telangana ePASS links to the official eligibility page, which shows different income limits by beneficiary category and rural/urban residence, so the old single-income rule was removed.
- Updated eligibility result contract to `likely`, `potential`, `not_met`, and `unknown`.
- Added satisfied conditions, unmet reasons, missing information and source references to rule-engine results.
- Added a Supabase relational schema/RLS starting migration and `.env.example`; no live backend is connected.
- Added a self-managed multi-stage application tracker with mobile navigation.
- Changed onboarding to default gender to “Prefer not to say” and evaluate income ranges without inventing a midpoint-based eligibility decision.
- Added README with setup, disclosures and limitations.

## Architecture recommendations

Preserve Next.js/React/TypeScript. Add Supabase Auth/PostgreSQL/Storage with RLS. Keep eligibility evaluation deterministic and independent of the LLM. Use a server-side retrieval layer for verified government documents; only verified scheme versions should feed public answers. Keep AI-extracted updates pending human approval. Do not store private documents in local storage.

## Verification performed in this environment

- `npm run typecheck`: passed after the source changes.
- Engine smoke checks compiled with TypeScript and executed with Node: passed (56 catalogue rows; unverified Pragati record returned `potential`; a known gender mismatch returned `not_met`; checklist completeness calculations passed).
- `npm test` through the bundled tsx/esbuild executable is platform-blocked because the uploaded `node_modules` contains Windows-native esbuild binaries. To still execute the suite, the tests were compiled with the TypeScript compiler and run with Node's test runner: all 9 tests passed.
- `npm run build`: blocked because Next.js attempted to download the Linux SWC binary and network access to the npm registry was unavailable.
- Supabase migration: written but not applied to a live project; RLS policies have not been integration-tested.

## Competition assessment

Current official Embarko rules divide judging into Work (400), Video (400) and Reach (200). Work evaluates app appearance, originality and mobile usability. Video evaluates hook, clarity, storytelling and showing Embarko. Reach depends on public-post views and engagement. The app should therefore prioritise a polished mobile citizen journey and a distinctive proof-gap action plan, while reserving time for a concise video that visibly demonstrates Embarko deployment. Current official rules state individual entries; entrants should verify the latest rules before submission.
