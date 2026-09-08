<!-- Generated with AI assistance (AIT-014, register entry unconfirmed) on 2026-09-08; reviewed by TBC. -->
# LNTN-401 Jira ticket plan: lantern-sdk Angular 12 -> 13 (partial Ivy)

Mode: **create after approval**. Plan shown 2026-09-08; "go" received 2026-09-08; the 12 KAN issues were created that day through the Atlassian MCP (`createJiraIssue`, `createIssueLink`) and verified by JQL `project = KAN`. Keys are in the table and in the section at the end. G1/G2 remain draft-only (nothing created in GIS).

## Jira reach (Atlassian MCP `atlassian-86a0`)

- Site `rjwills92.atlassian.net`, cloudId `dad167a5-4b0c-4743-8bc4-c336fcedb8b8`, scopes `read:jira-work`, `write:jira-work`. No Confluence.
- One team-managed project: `KAN` "Cognition-demo-ang-migration" (Epic 10001, Subtask 10002, Task 10003, Story 10004). The project is empty: JQL `project = KAN` returns no issues, so **epic LNTN-401 does not exist on the connected site** and no existing ticket can be duplicated or linked.
- Create screens expose `summary`, `description`, `labels`, `parent`, `issuelinks`, `assignee`, `duedate` only. **No `priority`, `components` or `fixVersions` field** exists in KAN, so component (`lantern-sdk`), priority (High from the GIS-STD-022 clock) and fix version are recorded in the ticket body instead of set as fields.
- Link types available: `Blocks`, `Cloners`, `Duplicate`, `Relates`.
- Project mapping (playbook rule): intended project in brackets in the summary, label `estate-<KEY>`, epic relationship via the `parent` field (team-managed project).

## Release train

The requested train is `2026.09.x`. `RELEASE_CALENDAR.md`: `2026.09.2` froze 2026-09-04 (CAB 2026-09-08 10:00 ET, already held) and `2026.09.4` is skipped for the Q3 quarter-end freeze (2026-09-24 to 2026-10-05). **The earliest train the library publish can ride is `2026.10.2`** (code freeze Fri 2026-10-02, CAB Tue 2026-10-06, submission deadline Mon 2026-10-05 17:00 ET, prod Thu 2026-10-08). No Jira fix version exists to set; the train is named in the bodies. Nothing is targeted at the skipped `2026.09.4`.

## Ticket table

| # | Key | Type | Intended project | Summary (KAN) | Parent / links | Labels | Priority (body) | Train (body) | Action |
|---|---|---|---|---|---|---|---|---|---|
| E | [KAN-1](https://rjwills92.atlassian.net/browse/KAN-1) | Epic | LNTN | `[LNTN] Lantern SDK Angular catch-up wave (mirror of LNTN-401)` | none | `estate-LNTN`, `angular-upgrade`, `ai-assisted` | High | — | **created** (stand-in for LNTN-401, which is not on this site) |
| S1 | [KAN-2](https://rjwills92.atlassian.net/browse/KAN-2) | Story | LNTN | `[LNTN] Upgrade lantern-sdk from Angular 12 to 13` | parent KAN-1; blocks KAN-3; relates to KAN-4 | `estate-LNTN`, `angular-upgrade`, `wave-13`, `ai-assisted` | High (GIS-2618 open High; TR-1102 expired 2025-11-12) | 2026.10.2 | **created** |
| T1 | [KAN-3](https://rjwills92.atlassian.net/browse/KAN-3) | Task | MOL | `[MOL] Verify retail-web on lantern-sdk 3.0.0 partial Ivy` | parent KAN-1; is blocked by KAN-2 | `estate-MOL`, `angular-upgrade`, `wave-13`, `ai-assisted` | High | 2026.10.2 (retail-web pin bump is out of scope of this run) | **created** |
| R1 | [KAN-4](https://rjwills92.atlassian.net/browse/KAN-4) | Task | LNTN | `[LNTN] Architecture review: ADR 0001 Angular 13 partial-Ivy build` | parent KAN-1; relates to KAN-2; due 2026-09-23 | `estate-LNTN`, `architecture-review`, `ai-assisted` | High | needed by 2026-09-23 (last working day before the Q3 freeze; 2026.09.4 is skipped) | **created** |
| S1.1 | [KAN-5](https://rjwills92.atlassian.net/browse/KAN-5) | Subtask | LNTN | `[LNTN] Record Angular 12 baseline for lantern-sdk` | parent KAN-2 | `estate-LNTN`, `ai-assisted` | — | — | **created** |
| S1.2 | [KAN-6](https://rjwills92.atlassian.net/browse/KAN-6) | Subtask | LNTN | `[LNTN] Write compatibility matrix and ADR for Angular 13` | parent KAN-2 | `estate-LNTN`, `ai-assisted` | — | — | **created** |
| S1.3 | [KAN-7](https://rjwills92.atlassian.net/browse/KAN-7) | Subtask | LNTN | `[LNTN] Confirm behaviour specs cover public API before migration` | parent KAN-2 | `estate-LNTN`, `ai-assisted` | — | — | **created** |
| S1.4 | [KAN-8](https://rjwills92.atlassian.net/browse/KAN-8) | Subtask | LNTN | `[LNTN] Commit Angular 13 framework hop with partial Ivy` | parent KAN-2 | `estate-LNTN`, `ai-assisted` | — | — | **created** |
| S1.5 | [KAN-9](https://rjwills92.atlassian.net/browse/KAN-9) | Subtask | LNTN | `[LNTN] Migrate lantern-sdk lint from TSLint to angular-eslint 13` | parent KAN-2 | `estate-LNTN`, `ai-assisted` | — | — | **created** |
| S1.6 | [KAN-10](https://rjwills92.atlassian.net/browse/KAN-10) | Subtask | LNTN | `[LNTN] Green all gates and release lantern-sdk 3.0.0` | parent KAN-2 | `estate-LNTN`, `ai-assisted` | — | — | **created** |
| S1.7 | [KAN-11](https://rjwills92.atlassian.net/browse/KAN-11) | Subtask | LNTN | `[LNTN] Draft CAB record and GIS-STD-022 pack for lantern-sdk 3.0.0` | parent KAN-2 | `estate-LNTN`, `ai-assisted` | — | 2026.10.2 | **created** |
| S1.8 | [KAN-12](https://rjwills92.atlassian.net/browse/KAN-12) | Subtask | LNTN | `[LNTN] Open lantern-sdk Angular 13 PR to develop` | parent KAN-2 | `estate-LNTN`, `ai-assisted` | — | — | **created** |
| G1 | — | GIS exception request (TECH-STD-044 s4) | GIS | `Exception: 17 npm audit advisories in Angular 13.4.0 (lantern-sdk 3.0.0)` | references S1 | — | High | — | **draft only**, `../governance/GIS_EXCEPTION_DRAFT.md`, for the DAE engineering manager to raise |
| G2 | — | GIS-STD-022 risk pack | GIS / Technology Risk | `TR pack: lantern-sdk wrapper Angular 13 remains out of vendor support` | references S1, ADR 0001 | — | High | — | **draft only**, `../governance/TR_PACK.md` (TR-1102 is at the 36-month ceiling; the pack documents the upgrade, no renewal is requested) |

Not proposed: a separate "Lantern Ivy" prerequisite story. Angular 13 removes View Engine, so the Ivy partial-compilation move is inseparable from the hop and is scoped inside S1. LNTN-140 (vendor Ivy build) is referenced in the body; it is not on this site and cannot be linked. Lantern 13 -> 14 and Canopy 4 (CNPY-2140) are the next wave steps and are named in the epic body, not ticketed here (one story per hop, created when that hop starts).

Summary check: all summaries are `Verb object detail`, under 80 characters, no emoji; the bracketed project key is the playbook's mapping prefix, not a ticket key.

## Bodies

Footer on every ticket: `Drafted with AI assistance (AIT-014, register entry unconfirmed) on 2026-09-08; to be reviewed by TBC (DAE reviewer who is not the prompter).`

### E — `[LNTN] Lantern SDK Angular catch-up wave (mirror of LNTN-401)`

**Context.** Stand-in on this Jira site for estate epic LNTN-401 (Digital Analytics Enablement). `@northgate/lantern-sdk` 2.4.1 is Angular 12.2.17 View Engine; GIS-STD-022 s6 lists it as EOL 2022-11-12 with TR-1102 expired 2025-11-12 and GIS-2618 open as High. The wrapper is in the build path of retail-web (Angular 14, epic MOL-4471) and blocks the estate's Angular 14 -> 15 wave. Governance sources: `northgate-platform-tooling/governance/FRAMEWORK_SUPPORT_STANDARD.md` s6, repo `docs/adr/0001-angular-13-partial-ivy.md`.
**Scope.** In: one story per Angular major for lantern-sdk, first 12 -> 13 (this epic's first child), then 13 -> 14. Out: replacing the Lantern vendor script (procurement), retail-web's own framework hop (MOL-4471).
**Acceptance criteria.** 1. Each hop is its own story with green gates and its own published semver major. 2. Wave order recorded: Lantern 12 -> 13, Lantern 13 -> 14, then Canopy 4 (CNPY-2140) for the estate 14 -> 15 wave. 3. GIS-2618 closure or a documented exception per hop.
**Evidence.** `docs/upgrade/LNTN-401/` in `northgate-lantern-sdk-live-upgrade`.
**Rollback.** Not applicable for an epic; each hop story carries its own rollback.
**Dependencies.** Blocks MOL-4471 (Lantern first, retail-web ADR 0014 order of operations); not linkable on this site.
**Governance.** GIS-STD-022 s6 row "Lantern SDK wrapper", TR-1102 (expired, 36-month ceiling reached, no renewal path); TECH-STD-044; TECH-POL-031 (AIT-014, unconfirmed). Priority High (compliance clock). Component `lantern-sdk` (no field in KAN).

### S1 — `[LNTN] Upgrade lantern-sdk from Angular 12 to 13`

**Context.** Move `@northgate/lantern-sdk` from Angular 12.2.17 (View Engine) to Angular 13.4.0 with Ivy partial compilation, publish 3.0.0, keep Node 14.21.3. This is Lantern's first catch-up hop and retires the View Engine / `ngcc` dependency that retail-web ADR 0014 names as the first blocker. Plan: `docs/upgrade/LNTN-401/COMPATIBILITY_MATRIX.md`, decision: `docs/adr/0001-angular-13-partial-ivy.md`.
**Scope.** In: `@angular/{core,common,compiler,compiler-cli,platform-browser,platform-browser-dynamic,router} 12.2.17 -> 13.4.0`; `@angular/cli 12.2.18 -> 13.3.11`; `@angular-devkit/build-angular 12.2.18 -> 13.3.11`; `ng-packagr 12.2.7 -> 13.3.1`; `typescript 4.3.5 -> 4.6.4`; `tsconfig.lib.prod.json` `enableIvy: false` -> `compilationMode: "partial"`; peer range `>=13 <14`; `scripts/verify-view-engine.js` replaced by `scripts/verify-partial-ivy.js` (`npm run verify:format`); TSLint -> angular-eslint 13 (own commit); release 3.0.0 (own commit). Out: Angular 14, RxJS 7, Node change, any consumer pin change, vendor script changes.
**Acceptance criteria.** 1. `npm ls @angular/core` shows exactly one version, 13.4.0. 2. `npm ci` from the committed lockfile exits 0 with no `--legacy-peer-deps`. 3. `npm run lint`, `npm test` (18 of 18 specs, no `xit`/`fit`, no spec edited except by an official migration), `npm run build` with zero warnings, `npm run verify:format`, `DRY_RUN=1 npm run publish:local` all exit 0. 4. Coverage >= 30 % (estate gate) and >= baseline 93.86 % statements. 5. `dist/lantern-sdk` contains `ɵɵngDeclare*` partial declarations and no `.metadata.json`. 6. Public API unchanged: `LanternModule.forRoot`, `LanternService`, `LanternRouterTracker`, `lanternTrack`, `LanternSessionInterceptor`, `LANTERN_CONFIG`, `maskPath`, masking and `X-Analytics-Session` behaviour asserted by the existing specs. 7. `.nvmrc` and `engines` agree on 14.21.3 (no Jenkinsfile in this repo: EVIDENCE MISSING). 8. `npm audit --production` output recorded; advisories with no fix in Angular 13 go to the GIS exception draft. 9. Commits `LNTN-401 Upgrade Angular 12 to 13`, `LNTN-401 Migrate TSLint to angular-eslint 13`, `LNTN-401 Release 3.0.0` each carry `AI-Assisted: AIT-014` and `AI-Assisted-Scope`.
**Evidence.** `docs/upgrade/LNTN-401/00-baseline/`, `docs/upgrade/LNTN-401/evidence/<step>/`, `COMPATIBILITY_MATRIX.md`, `CONSUMERS.md`, `REPORT.md`.
**Rollback.** Revert the three commits on `develop`; `@northgate/lantern-sdk@2.4.1` stays published and retail-web's pin is unchanged, so no consumer moves until MOL bumps the pin.
**Dependencies.** Blocks T1 (retail-web verification). Relates to R1 (architecture review). Next hop 13 -> 14 is created when this closes.
**Governance.** GIS-STD-022: Angular 13 is itself out of vendor support (EOL 2023-05-04); this hop does not retire TR-1102 (ceiling reached), see TR pack draft. TECH-STD-044: exact pins, internal registry, lockfile committed; 17 audit advisories need a GIS exception. CAB record drafted for train 2026.10.2 (`docs/upgrade/LNTN-401/CAB_RECORD.md`). TECH-POL-031: AIT-014 unconfirmed, non-prompter reviewer required.

### T1 — `[MOL] Verify retail-web on lantern-sdk 3.0.0 partial Ivy`

**Context.** retail-web (Angular 14.3.0, Node 16.20.2) is the only live consumer of `@northgate/lantern-sdk` (pinned 2.4.1). Angular 14 consumes partial-Ivy libraries through the linker, so a 13-built package is supported there; this task records the proof and hands the pin bump to `retail-digital`. Evidence produced by S1: `docs/upgrade/LNTN-401/CONSUMERS.md`.
**Scope.** In: read-only scratch verification of `@northgate/lantern-sdk 3.0.0` from the local registry with `npm run build:prod` and `npm test` in a scratch clone of `northgate-retail-web`; a MOL story to bump the pin `2.4.1 -> 3.0.0` and remove `ngcc` from postinstall when DAE releases. Out: changing retail-web's pin in this run; retail-web's Angular hop.
**Acceptance criteria.** 1. Scratch install of `@northgate/lantern-sdk@3.0.0` resolves peers with no `--legacy-peer-deps`. 2. `npm run build:prod` exits 0 with zero new warnings and `ngcc` does not process lantern-sdk. 3. `npm test` passes with no spec disabled. 4. Result (supported / unsupported) recorded in `CONSUMERS.md` with log paths. 5. The retail-web pin bump is a separate MOL story riding retail-web's CAB record (GIS-STD-022 s3).
**Evidence.** `docs/upgrade/LNTN-401/evidence/06-consumer-retail-web/` (created as `06-*`, not `07-*` as first planned), `CONSUMERS.md`.
**Rollback.** Not applicable: read-only verification; the pin is unchanged.
**Dependencies.** Is blocked by S1.
**Governance.** GIS-STD-022 s3 shared-library rule (2.x stays in security support until the last consumer moves or 90 days). TECH-POL-031 footer.

### R1 — `[LNTN] Architecture review: ADR 0001 Angular 13 partial-Ivy build`

**Context.** ADR 0001 (`docs/adr/0001-angular-13-partial-ivy.md`, Proposed) moves lantern-sdk to Angular 13 partial Ivy as a transit major, arguing explicitly against Architecture's "current major at time of upgrade" position (CSWT-ARCH minutes 2026-01-15) because a library must be consumable by its Angular 14 consumer and each hop is gated separately. Review is via CODEOWNERS (`@northgate/cswt-architecture`) on the hop PR; Confluence page paste-ready at `docs/upgrade/LNTN-401/governance/CONFLUENCE_PAGE.md` (no Confluence access on this site).
**Scope.** In: approve or reject ADR 0001 and the wave order in it. Out: the CAB decision (separate), retail-web's ADR 0014 supersession (MOL).
**Acceptance criteria.** 1. Architecture approval on the PR from a reviewer who is not the prompter, or written rejection with reasons. 2. ADR status changed by a human only. 3. Decision needed by 2026-09-23 (last working day before the Q3 freeze; 2026.09.4 is skipped).
**Evidence.** PR URL (added after opening), `docs/upgrade/LNTN-401/governance/`.
**Rollback.** Not applicable.
**Dependencies.** Relates to S1; parent E.
**Governance.** GIS-STD-022 s2 (framework plan as ADR), TECH-POL-031 review.

### S1.1 — `[LNTN] Record Angular 12 baseline for lantern-sdk`
Context: baseline before any change on Node 14.21.3. Scope: `npm ci`, lint, test, build, `verify:view-engine`, publish dry run, `npm audit --production`, coverage. AC: all logs and `SUMMARY.md` under `docs/upgrade/LNTN-401/00-baseline/`; 18/18 specs; coverage recorded (93.86 %). Evidence: that folder. Rollback: n/a. Dependencies: first sub-task. Governance: TECH-POL-031 footer.

### S1.2 — `[LNTN] Write compatibility matrix and ADR for Angular 13`
Context: `npx -p @angular/cli@13 ng update` preview logged. Scope: `COMPATIBILITY_MATRIX.md` for 12 -> 13 only; ADR 0001 Proposed. AC: every moved package has an exact target inside Angular 13's matrix (TypeScript >=4.4.3 <4.7, ng-packagr ^13, Node ^14.15); anything outside stops the hop. Evidence: `docs/upgrade/LNTN-401/evidence/01-ng-update-preview/`, `COMPATIBILITY_MATRIX.md`, `docs/adr/0001-*.md`. Rollback: n/a. Dependencies: after S1.1. Governance: GIS-STD-022 s2.

### S1.3 — `[LNTN] Confirm behaviour specs cover public API before migration`
Context: no spec edits are allowed in the hop except official migrations, so coverage of the public API must exist beforehand. Scope: map the 18 existing specs to `LanternModule.forRoot`, `LanternService`, `LanternRouterTracker`, `maskPath`, `lanternTrack`, `LanternSessionInterceptor` (`X-Analytics-Session`). AC: each public symbol has at least one behaviour spec; gaps recorded in `REPORT.md` as residual risk, not filled with new specs in this hop. Evidence: `REPORT.md` public API table. Rollback: n/a. Dependencies: after S1.1. Governance: TECH-POL-031 (tests assert behaviour).

### S1.4 — `[LNTN] Commit Angular 13 framework hop with partial Ivy`
Context: commit `LNTN-401 Upgrade Angular 12 to 13`. Scope: package pins per matrix, `compilationMode: "partial"`, peer range `>=13 <14`, `scripts/verify-partial-ivy.js`, `.gitignore` negation for evidence logs. AC: gates in S1 AC 1-6 green with logs under `docs/upgrade/LNTN-401/evidence/02-angular-13/`; trailers present. Rollback: revert commit. Dependencies: after S1.2, S1.3. Governance: TECH-STD-044 exact pins.

### S1.5 — `[LNTN] Migrate lantern-sdk lint from TSLint to angular-eslint 13`
Context: TSLint and codelyzer are unmaintained and pull a nested `@angular/core@9`; Angular 13 CLI has no TSLint builder. Scope: `@angular-eslint/*` 13.x, `eslint` 8.x, `@typescript-eslint/*` 5.x, `.eslintrc.json` mirroring `tslint.json` rules; remove `tslint`, `codelyzer`, `tslint.json`. AC: `npm run lint` exits 0 with zero warnings; no source change beyond lint-required edits; `npm ls @angular/core` one version; gates green under `evidence/03-angular-eslint/`. Rollback: revert commit. Dependencies: after S1.4. Governance: TECH-STD-044.

### S1.6 — `[LNTN] Green all gates and release lantern-sdk 3.0.0`
Context: release commit. Scope: version 3.0.0 in both `package.json`, `CHANGELOG.md`, `README.md`, service context string. AC: full gate set green under `evidence/04-release-3.0.0/`; `npm ci` re-verified; `npm run publish:local` to Verdaccio succeeds; `npm view @northgate/lantern-sdk@3.0.0 --registry http://localhost:4873` resolves. Rollback: unpublish is forbidden; 2.4.1 remains; consumers do not move. Dependencies: after S1.5. Governance: TECH-STD-044 internal registry.

### S1.7 — `[LNTN] Draft CAB record and GIS-STD-022 pack for lantern-sdk 3.0.0`
Context: CAB_TEMPLATE.md v4.2 copied whole; TR pack because the wrapper stays out of vendor support. Scope: `CAB_RECORD.md`, `governance/CAB_ITSM_FIELDS.md`, `governance/TR_PACK.md`, `governance/GIS_EXCEPTION_DRAFT.md`. AC: all eleven CAB sections present, no italic guidance, evidence rows cite paths, section 9 lists AI-assisted commits and AIT-014 as unconfirmed, change owner `TBC`; train 2026.10.2 with submission deadline 2026-10-05 17:00 ET. Rollback: n/a. Dependencies: after S1.6. Governance: RM-STD-003, GIS-STD-022 s5, TECH-STD-044 s4, TECH-POL-031.

### S1.8 — `[LNTN] Open lantern-sdk Angular 13 PR to develop`
Context: PR from `feature/LNTN-401-angular-12-to-13` to `develop` using `.github/pull_request_template.md`. Scope: PR body with Jira keys, CAB train, risk, rollback, verification, AI-assisted section (AIT-014 unconfirmed), reviewers `@northgate/digital-analytics-enablement`, `@northgate/cswt-architecture`, `@northgate/gis-appsec`. AC: PR open, not merged; `REPORT.md` links it. Rollback: close PR. Dependencies: after S1.7. Governance: TECH-POL-031 s4.3 review checklist (`PR_REVIEW_AI.md`).

### G1 — GIS exception request (draft only)
See `../governance/GIS_EXCEPTION_DRAFT.md`. 17 `npm audit --production` advisories (13 high, 4 moderate) against `@angular/core`, `@angular/common`, `@angular/compiler` at 12.2.17; the fixed versions are `>=19.2.16` or unpatched below 19.x, so Angular 13.4.0 leaves all 17 open. TECH-STD-044 s4 requires a GIS exception rather than skipping majors. The DAE engineering manager raises it in GIS; not created here.

### G2 — GIS-STD-022 risk pack (draft only)
See `../governance/TR_PACK.md`. TR-1102 expired 2025-11-12 at the thirty-six month ceiling (EOL 2022-11-12), so no renewal is requested; the pack documents the hop plan (13 now, 14 next) and the compensating controls in force. Raised by Technology Risk / GIS, not created here.

## Fields not set and why

- `priority`, `components`, `fixVersions`: no such field on any KAN issue type (checked with `getJiraIssueTypeMetaWithFields` for Epic, Story, Task, Subtask). Recorded in bodies.
- `assignee`: nobody named by the user; left unassigned.
- Cross-project links to LNTN-401, MOL-4471, LNTN-140, GIS-2618: those projects are not on this site; named in bodies only.

## Keys after creation (2026-09-08)

| Plan row | Key | URL |
|---|---|---|
| E | KAN-1 | https://rjwills92.atlassian.net/browse/KAN-1 |
| S1 | KAN-2 | https://rjwills92.atlassian.net/browse/KAN-2 |
| T1 | KAN-3 | https://rjwills92.atlassian.net/browse/KAN-3 |
| R1 | KAN-4 | https://rjwills92.atlassian.net/browse/KAN-4 |
| S1.1 | KAN-5 | https://rjwills92.atlassian.net/browse/KAN-5 |
| S1.2 | KAN-6 | https://rjwills92.atlassian.net/browse/KAN-6 |
| S1.3 | KAN-7 | https://rjwills92.atlassian.net/browse/KAN-7 |
| S1.4 | KAN-8 | https://rjwills92.atlassian.net/browse/KAN-8 |
| S1.5 | KAN-9 | https://rjwills92.atlassian.net/browse/KAN-9 |
| S1.6 | KAN-10 | https://rjwills92.atlassian.net/browse/KAN-10 |
| S1.7 | KAN-11 | https://rjwills92.atlassian.net/browse/KAN-11 |
| S1.8 | KAN-12 | https://rjwills92.atlassian.net/browse/KAN-12 |

Links created: `KAN-2 blocks KAN-3` (Blocks), `KAN-2 relates to KAN-4` (Relates). Parents: KAN-2/3/4 -> KAN-1; KAN-5..12 -> KAN-2. Due date set on KAN-4 only (2026-09-23). All issues are in `To Do`; none transitioned. Bodies carry the PR URL (https://github.com/rhys-j-williams/northgate-lantern-sdk-live-upgrade/pull/1) and a "status at creation" line where the work is already done on the branch.

Hand-offs not created here: G1 (GIS exception) and G2 (TR pack) to the DAE engineering manager / Technology Risk; the cross-site links to LNTN-401, MOL-4471, LNTN-140, GIS-2618 (named in bodies only); the retail-web pin-bump story in MOL (named in KAN-3 AC 5).
