# LNTN-401 hop report: `@northgate/lantern-sdk` Angular 12.2.17 -> 13.4.0 (3.0.0)

<!-- Generated with AI assistance (AIT-014, register entry unconfirmed) on 2026-09-08; reviewed by TBC. -->

| | |
|---|---|
| Repository / branch | `northgate-lantern-sdk-live-upgrade`, `feature/LNTN-401-angular-12-to-13` off `develop`, PR to `develop` |
| Hop | Angular 12.2.17 -> **13.4.0** (last 13.x); CLI / build-angular 13.3.11, ng-packagr 13.3.1, TypeScript 4.6.4; Node **14.21.3** unchanged |
| Package | `@northgate/lantern-sdk` 2.4.1 (View Engine) -> **3.0.0** (Ivy partial compilation, APF v13), peer `@angular/{core,common,router} >=13.0.0 <14.0.0` |
| Wave position | Lantern's first catch-up hop; next is 13 -> 14 (4.0.0), which must land before retail-web's 14 -> 15 hop in the estate wave (Canopy 4 / CNPY-2140, MOL-4471) |
| Compliance clock | Angular 12 EOL 2022-11-12; TR-1102 expired 2025-11-12 (ceiling); GIS-2618 open High. Angular 13 EOL 2023-05-04, also past the ceiling: no acceptance requested, `governance/TR_PACK.md` |
| Release train | requested 2026.09.x; not available (2026.09.2 froze 2026-09-04, 2026.09.4 skipped for Q3 freeze). **2026.10.2** requested in the CAB record (freeze Fri 2026-10-02, CAB Tue 2026-10-06, deploy Thu 2026-10-08) |
| Stop condition | Stopped at Angular 13 green + PR open. Angular 14 not started. |
| PR | https://github.com/rhys-j-williams/northgate-lantern-sdk-live-upgrade/pull/1 (into `develop`; open, not merged) |
| Jira (connected site, project KAN) | epic stand-in [KAN-1](https://rjwills92.atlassian.net/browse/KAN-1); hop story [KAN-2](https://rjwills92.atlassian.net/browse/KAN-2) (sub-tasks KAN-5..KAN-12); retail-web verification [KAN-3](https://rjwills92.atlassian.net/browse/KAN-3); architecture review [KAN-4](https://rjwills92.atlassian.net/browse/KAN-4), due 2026-09-23. Index: `jira/TICKET_PLAN.md`. GIS items draft-only. |

## Commits on the branch (all with `AI-Assisted: AIT-014` / `AI-Assisted-Scope:` trailers)

| # | commit | scope |
|---|---|---|
| 0 | `a6d5826` LNTN-401 Record Angular 12 baseline and Angular 13 update preview | `00-baseline/`, `evidence/01-ng-update-preview/`, `jira/TICKET_PLAN.md`, `.gitignore` negation for `docs/upgrade/**/*.log` |
| 1 | `0993454` LNTN-401 Upgrade Angular 12 to 13 | `ng update` 12 -> 13; `compilationMode: "partial"`; `scripts/verify-partial-ivy.js` replaces `verify-view-engine.js` (`npm run verify:format`); peers `>=13 <14`; `COMPATIBILITY_MATRIX.md`; `evidence/02-angular-13/` |
| 2 | `8cb51cb` LNTN-401 Migrate lint from TSLint to angular-eslint 13 | tslint 6 / codelyzer 6 -> `@angular-eslint` 13.5.0, eslint 8.57.1, `@typescript-eslint` 5.27.1; rules translated; removes the nested `@angular/core@9.0.0` codelyzer dragged in; `evidence/03-angular-eslint/` |
| 3 | `15793de` LNTN-401 Release 3.0.0 for the Angular 13 line | version 3.0.0 (root + library), CHANGELOG, README, `sdk` context / `data-lantern-sdk` literal; `evidence/04-release-3.0.0/` |
| 4 | governance commit (this report, ADR, CAB record, TR pack, consumers) | `docs/**` only |

## Gate table

Every gate on Node 14.21.3 / npm 6.14.18, from a clean `npm ci` (no `--legacy-peer-deps`, no
`npm audit fix`). Logs: `docs/upgrade/LNTN-401/00-baseline/` and `evidence/0N-*/`.

| gate | baseline 2.4.1 / Angular 12 | commit 1 (Angular 13) | commit 2 (angular-eslint) | commit 3 (3.0.0) |
|---|---|---|---|---|
| `npm ci` | exit 0 | exit 0 | exit 0 | exit 0 |
| `npm run lint` | exit 0 (TSLint) | exit 0, but TSLint's `deprecation` rule throws `message.trim is not a function` on TS 4.6 (`evidence/02-angular-13/lint.log`), so that rule did not run; fixed by commit 2 | exit 0 (angular-eslint, all rules) | exit 0 |
| `npm test` | 18/18, 0 skipped | 18/18, 0 skipped | 18/18 | 18/18, no `xit`/`fit`/`xdescribe` |
| coverage (stmts / branches / funcs / lines) | 93.86 / 79.57 / 97.56 / 93.42 | 93.75 / 79.83 / 97.56 / 93.28 | same | 93.75 / 79.83 / 97.56 / 93.28 |
| `npm run build` (production) | exit 0, 0 warnings, View Engine | exit 0, 0 warnings, Ivy partial | exit 0, 0 warnings | exit 0, 0 warnings |
| `npm run verify:format` | `verify:view-engine` OK | partial-Ivy verifier OK | OK | OK (APF v13, 7 public symbols, `ɵɵngDeclare*` only, no `.metadata.json`) |
| `DRY_RUN=1 npm run publish:local` | exit 0 | exit 0 | exit 0 | exit 0 |
| `npm audit --production` | **exit 1: 17 advisories (13 High, 4 Moderate), all `@angular/*`** | exit 1, same 17 | exit 1, same 17 | exit 1, same 17, delta vs baseline none |
| `npm ls @angular/core` | 12.2.17 + nested 9.0.0 (codelyzer) | 13.4.0 + nested 9.0.0 (codelyzer) | 13.4.0 only | 13.4.0 only |
| GIS-1180 forbidden strings (`cswt-workspace/scripts/check-forbidden-strings.sh worktree`) | | | | PASS |

Coverage note: the statement percentage moved 93.86 % -> 93.75 % because the total fell from 163 to
160 statements (View Engine-only code paths removed by the migration); the count of uncovered
statements (10) and uncovered lines (10) is unchanged and branch coverage rose. No spec was
disabled. Coverage gate for this repo: estate default 30 % (no `Jenkinsfile` in the repository,
EVIDENCE MISSING for a repo-specific threshold).

`npm audit --production` is the one gate that is red. It was red at baseline with the same 17
advisories; the lowest fixed version is `@angular/common` 19.2.16 and most have no fix below 19. Per
the run rules this is **not** fixed by skipping majors: it is recorded as a GIS dependency exception
request (`governance/GIS_EXCEPTION_DRAFT.md`, draft only, not raised).

## Downstream

3.0.0 published to the estate Verdaccio (`evidence/05-publish-verdaccio/publish-local.log`). Verified
in a read-only scratch clone of `northgate-retail-web` (Angular 14.3.0, Node 16.20.2), pin not
changed in the canonical checkout: `build:prod` exit 0 (0 new warnings; the pre-existing bundle
budget warning is 0.19 kB smaller), `test:ci` 196/198 SUCCESS (2 pre-existing skips), identical to
the baseline run with 2.4.1. **Supported.** Caveats (peer range formally `<14`, RxJS 6 peer,
`legacy-peer-deps` already in retail-web's `.npmrc`) and the PLAT-2718 lock-entry refresh used in the
scratch clone are in `CONSUMERS.md`. Rows: `evidence/06-consumer-retail-web/SUMMARY.txt`.

## Behaviour preserved

`LanternModule.forRoot`, `LanternService`, `LanternRouterTracker`, `lanternTrack`,
`LanternSessionInterceptor`, `LANTERN_CONFIG`, `maskPath`, identifier masking and the
`X-Analytics-Session` header: no source change other than lint suppressions, and the same 18 specs
pass unchanged in content. The 7 public symbols are asserted by `verify-partial-ivy.js` against the
built `.d.ts`.

**Deviation to review.** The run rules say "no spec edits except where an official Angular migration
rewrites them". Commit 3 changed two spec literals (`lantern.service.spec.ts`,
`lantern.module.spec.ts`: expected `2.4.1` -> `3.0.0`) because the source hardcodes the version in
the `sdk` context string and the `data-lantern-sdk` attribute and the specs assert that literal. No
official migration did this. The alternative (leaving both source and specs at `2.4.1`) would ship a
3.0.0 package that reports itself as 2.4.1. Flagged to the requester; kept pending their answer.

## Governance artefacts

| artefact | path | state |
|---|---|---|
| ADR 0001 (Angular 13 + partial Ivy) | `docs/adr/0001-angular-13-partial-ivy.md`, index `docs/adr/README.md` | **Proposed**; CODEOWNERS routes to `@northgate/cswt-architecture` |
| Compatibility matrix 12 -> 13 | `COMPATIBILITY_MATRIX.md` | done |
| Consumers | `CONSUMERS.md` | done, retail-web supported |
| CAB record (template v4.2, 11 sections) + ITSM fields | `CAB_RECORD.md`, `CAB_ITSM_FIELDS.md` | draft; CHG, owner, approvals, CMDB ids `TBC`; AIT-014 marked unconfirmed |
| GIS-STD-022 risk pack | `governance/TR_PACK.md` | draft; no extension requested (ceiling), documents the upgrade |
| GIS dependency exception (audit advisories) | `governance/GIS_EXCEPTION_DRAFT.md` | draft only, for the DAE engineering manager to raise in GIS |
| Confluence decision page | `governance/CONFLUENCE_PAGE.md` | paste-ready fallback: connected Atlassian site has no Confluence |
| Architecture review ticket | `governance/REVIEW_TICKET.md` + `jira/TICKET_PLAN.md` row R1 | **created**: KAN-4 (unassigned, due 2026-09-23, relates to KAN-2) |
| Jira ticket set | `jira/TICKET_PLAN.md` | **created 2026-09-08 after "go"**: KAN-1..KAN-12 via Atlassian MCP, links `KAN-2 blocks KAN-3`, `KAN-2 relates to KAN-4`; priority / component / fix version recorded in bodies (no such fields in KAN); G1/G2 GIS items draft-only, nothing created in GIS |
| CHANGELOG / README | `CHANGELOG.md` (3.0.0 unreleased), `README.md` | done |

EVIDENCE MISSING (not fabricated): Checkmarx, Xray and Sonar runs (no scanners in the local estate);
`Jenkinsfile` / pipeline coverage threshold (none in the repository); CMDB app-id; retail-web
`smoke.sh` / `verify-estate.sh` against a running estate (belongs to the `[MOL]` verify task).

## Residual risks

1. **Still out of vendor support.** Angular 13 EOL 2023-05-04, beyond the GIS-STD-022 ceiling, so no
   acceptance is possible; GIS-2618 stays open until the 13 -> 14 hop (and 14 is at its own ceiling
   2026-11-18). Mitigation: schedule 13 -> 14 immediately under LNTN-401.
2. **17 `npm audit` advisories in `@angular/*` 13.4.0** with no fix below 19; peers only, the
   consumer's Angular runs in the browser. GIS exception draft; six-month maximum.
3. **Peer range excludes the live consumer's major.** 3.0.0 says `<14`; retail-web is 14.3.0 and
   installs only through its existing `legacy-peer-deps=true` (MOL-3611), as it does for 2.4.1
   today. Resolved by the next hop (`>=14 <15`).
4. **Governance not yet approved.** ADR Proposed, CAB approvals TBC, no named change owner, AIT-014
   unconfirmed in the register, reviewer who is not the prompter still to be named (TECH-POL-031).
5. **Spec literal deviation** (above), pending the requester's call.
6. **PLAT-2718.** Local republishes of `@northgate/*` do not hash like the Artifactory tarballs; the
   consumer verification needed a scratch-only lock-entry refresh. Not a defect in this package, but
   the retail-web pin bump must use the Artifactory-published 3.0.0, not a local one.

## Next hop in the wave

1. **Lantern 13 -> 14** (LNTN-401, next story): Angular 14.x latest patch, peer `>=14 <15`, 4.0.0,
   TypeScript 4.6/4.7 per Angular 14, Node 14.21.3 (Angular 14 still supports Node 14.15+); same
   gate set; retail-web re-verified. Must publish before retail-web starts 14 -> 15.
2. **Canopy 4** (CNPY-2140) for the estate's 14 -> 15 wave, then the consumer apps (MOL-4471 first).
3. retail-web pin bump 2.4.1 -> 3.0.0 (or straight to 4.0.0 if the hop lands in time) on its own
   CAB record, Medium or above.

PR_LINK: https://github.com/rhys-j-williams/northgate-lantern-sdk-live-upgrade/pull/1
