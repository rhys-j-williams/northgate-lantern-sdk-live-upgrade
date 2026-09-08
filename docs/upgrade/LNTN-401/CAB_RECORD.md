# Change Advisory Board submission — CSWT

<!-- Generated with AI assistance (AIT-014, register entry unconfirmed) on 2026-09-08; reviewed by TBC. -->

Template version 4.2 (RM-STD-003, revised 2025-08 to add section 9). Copy the whole thing into the
CHG record's description field in the ITSM tool; the fields there are not wide enough for the
tables, so the record body is this markdown and the mandatory ITSM fields are filled from section
1. Submissions after the Monday 17:00 ET deadline are heard the following fortnight. The CAB does
not read attachments it was not pointed at; if the evidence is in the bundle, say where.

Draft status: not submitted. Section-1 fields for the ITSM form are listed separately in
`CAB_ITSM_FIELDS.md`. Every `TBC` below is a value only a named human can supply.

---

## 1. Record

| field | value |
|---|---|
| CHG number | TBC (assigned by ITSM on save; not an emergency change) |
| Change type | Normal |
| Release train | 2026.10.2 requested (code freeze Fri 2026-10-02, CAB Tue 2026-10-06, deploy Thu 2026-10-08). The train asked for, 2026.09.x, is not available: 2026.09.2 froze on 2026-09-04 and 2026.09.4 is skipped for the Q3 freeze (`RELEASE_CALENDAR.md`). |
| Requested implementation window | Thu 2026-10-08 20:00 to 23:00 ET (publish window; no production deploy of a service, see section 2) |
| Requesting team | Digital Analytics Enablement (DAE) |
| Change owner (accountable) | TBC (permanent employee, M2 or above; cannot be supplied by the drafter) |
| Implementer | TBC |
| Business sponsor | TBC (DAE product owner) |
| Application(s) and CMDB app-id(s) | `@northgate/lantern-sdk` (shared library; CMDB app-id TBC, not found in the repository). Consumer in scope of the follow-on change: retail-web (Northgate Online, app-id TBC). |
| Environment(s) | Artifactory `npm-northgate` (publish only). No prod-east / prod-west deploy in this change. |
| Jira release version | not applicable: the connected Jira project (KAN) has no fix versions; train recorded here and in KAN-2 / `jira/TICKET_PLAN.md` |
| Evidence bundle | `docs/upgrade/LNTN-401/` on branch `feature/LNTN-401-angular-12-to-13` until `Jenkinsfile.release` produces the Artifactory bundle (this repository has no `Jenkinsfile.release`; see EVIDENCE MISSING in `REPORT.md`) |

## 2. Summary of change

This is a dependency/platform upgrade. `@northgate/lantern-sdk`, the Angular wrapper for the Lantern
analytics script, moves from Angular 12.2.17 (end of life 2022-11-12, acceptance TR-1102 expired
2025-11-12, GIS-2618 open High) to Angular 13.4.0 and is published as 3.0.0. The package output
changes from View Engine to Ivy partial compilation, which is the format Angular libraries have to
use from 13 onwards and which an Angular 14 consumer links with its own compiler. Public API, the
identifier masking on router page events and the `X-Analytics-Session` header are unchanged. This
change publishes the package to the registry only; the consumer pin bump in retail-web (2.4.1 ->
3.0.0) is a separate change under MOL/LNTN-401 and rides that deployable's own CAB record. Tickets:
LNTN-401 (epic, bank instance); connected-site keys KAN-1 (epic stand-in), KAN-2 (hop story, sub-tasks
KAN-5..KAN-12), KAN-3 (retail-web verification), KAN-4 (architecture review) per `jira/TICKET_PLAN.md`.

## 3. Scope

### In scope

| component | from | to | change |
|---|---|---|---|
| `@northgate/lantern-sdk` (git tag `lantern-sdk-v3.0.0`, to be applied at publish) | 2.4.1, Angular 12.2.17, View Engine | 3.0.0, Angular 13.4.0, Ivy partial compilation (APF v13) | framework major, package format, peer range `>=13.0.0 <14.0.0` |
| Build tooling (repo only) | Angular CLI 12.2.18, ng-packagr 12.2.7, TypeScript 4.3.5, TSLint 6.1.3 / codelyzer 6.0.2 | Angular CLI 13.3.11, ng-packagr 13.3.1, TypeScript 4.6.4, angular-eslint 13.5.0 | build/lint toolchain |
| Release gate script | `scripts/verify-view-engine.js` (`npm run verify:view-engine`) | `scripts/verify-partial-ivy.js` (`npm run verify:format`) | replaced |
| `docs/adr/0001-angular-13-partial-ivy.md` | none | Proposed | new ADR |

### Out of scope / explicitly not changing

- The vendor script (`lantern.min.js`, hosted copy, Web SDK 4.11), its URL, the collector, and the
  data sent to it. No change to the GIS-1188 hosted-copy arrangement.
- Public API: `LanternModule.forRoot`, `LanternService`, `LanternRouterTracker`, `lanternTrack`,
  `LanternSessionInterceptor`, `LANTERN_CONFIG`, `maskPath`; identifier masking; the
  `X-Analytics-Session` header name and prefix behaviour.
- Node runtime (stays 14.21.3), RxJS (6.6.7), Zone.js (0.11.4).
- retail-web's `package.json` pin (2.4.1) and its `postinstall` `ngcc` step. Not changed by this
  record.
- Angular 14 for the package (next hop, LNTN-401), Canopy 4, the estate 14 -> 15 wave.
- Database schema, IdP configuration, WAF rules, third party contracts (the LNTN-361 vendor items are
  flagged in the ADR as open questions, not changed here).

## 4. Risk assessment

| | |
|---|---|
| Risk rating | Low for this change (library publish; nothing deploys). The consumer bump in retail-web is customer facing and is at least Medium under RM-STD-003 on its own record. |
| Customer impact during implementation | None. Publish to the registry only. |
| Customer impact if it goes wrong | None until a consumer takes 3.0.0. If retail-web then fails to build or analytics events stop, that is caught in the consumer's pipeline and UAT before prod. |
| Regulatory or data classification considerations | `DATA_CLASSIFICATION.md`: Synthetic — Non Restricted. No PII flows change; the masking of identifiers in page paths (`maskPath`, GIS-1471) is covered by the unchanged spec suite (18/18). |
| Dependencies on other changes | None for the publish. The retail-web pin bump depends on this change and on the retail-web CAB record (CHG TBC). |
| Blast radius | Consumers of `@northgate/lantern-sdk`: retail-web (only live consumer, pins 2.4.1 exactly, unaffected until it bumps). Business-web does not pin the package; the Beacon console is not in the estate workspace. 2.4.1 stays published. |

Specific failure mode of most concern: the partial-Ivy output not linking in the Angular 14
consumer. Addressed by publishing 3.0.0 to the estate Verdaccio and running retail-web's
`build:prod` and `test:ci` against it in a read-only scratch clone before this record was drafted:
see section 6 and `CONSUMERS.md`.

## 5. Dependency and platform changes

| dependency | from | to | reason | DEPENDENCY_POLICY.md exception ref (if any) |
|---|---|---|---|---|
| `@angular/core`, `common`, `compiler`, `compiler-cli`, `platform-browser`, `platform-browser-dynamic`, `router`, `forms`, `animations` | 12.2.17 | 13.4.0 | Angular 12 EOL 2022-11-12, TR-1102 expired, GIS-2618 | ADR 0001 (estate version map move); audit advisories: GIS exception request drafted, id TBC (`governance/GIS_EXCEPTION_DRAFT.md`) |
| `@angular/cli`, `@angular-devkit/build-angular` | 12.2.18 | 13.3.11 | required by Angular 13 | none |
| `ng-packagr` | 12.2.7 | 13.3.1 | required by Angular 13 library build | none |
| `typescript` | 4.3.5 | 4.6.4 | Angular 13.4 requires `>=4.4.2 <4.7` | none |
| `tslint`, `codelyzer` | 6.1.3 / 6.0.2 | removed | unsupported on Angular 13; codelyzer nested Angular 9 in the tree | none |
| `@angular-eslint/*` | none | 13.5.0 | replacement lint | none |
| `@typescript-eslint/eslint-plugin`, `parser` | none | 5.27.1 | required by angular-eslint 13 | none |
| `eslint` | none | 8.57.1 | required by angular-eslint 13 | none |
| Node | 14.21.3 | 14.21.3 | unchanged | none |

- Xray report for the new versions: EVIDENCE MISSING (no Xray in the local estate). Substitute:
  `evidence/04-release-3.0.0/npm-audit-production.log` (17 advisories, 13 High / 4 Moderate, all in
  `@angular/*` 13.4.0; none fixable below Angular 19).
- Lifecycle status of everything in the "to" column: Angular 13.4.0 end of life 2023-05-04
  (out of support; interim hop, next hop 13 -> 14 under LNTN-401); TypeScript 4.6 out of support;
  ng-packagr 13 follows Angular 13; angular-eslint 13 follows Angular 13; Node 14.21.3 end of life
  2023-04-30 (unchanged, already in the inventory).
- Confirm no version moves outside the estate version map without an ADR: ADR 0001
  (`docs/adr/0001-angular-13-partial-ivy.md`, Proposed).

## 6. Testing and evidence

| evidence | location | result |
|---|---|---|
| Unit tests and coverage (threshold from the Jenkins job) | `evidence/04-release-3.0.0/test.log`, `test-coverage.log` (baseline `00-baseline/test.log`) | 18/18 pass; statements 93.75% (baseline 93.86%, -1 statement of 160 from the removed View Engine-only branch), branches 79.83% (79.57%), functions 97.56%, lines 93.28% (93.42%) |
| Sonar quality gate | EVIDENCE MISSING (no Sonar in the local estate; `sonar-project.properties` unchanged) | not run |
| Checkmarx scan (no High or Critical open) | EVIDENCE MISSING (no Checkmarx in the local estate; `checkmarx.yml` unchanged) | not run |
| Xray dependency scan (no High or Critical open) | EVIDENCE MISSING; substitute `evidence/04-release-3.0.0/npm-audit-production.log` | 13 High / 4 Moderate open, all `@angular/*`, see accepted-findings table |
| uat regression suite | not applicable: library, no deployable; consumer suite run instead, `evidence/06-consumer-retail-web/` | see `CONSUMERS.md` |
| Manual UAT sign off | not applicable for the publish; required on the retail-web bump record | TBC |
| Performance test *(Medium and High only)* | not applicable: Low, library publish | |
| Accessibility check *(customer facing UI only)* | not applicable: no UI in the package (attribute directive only) | |
| Security review *(if GIS-STD-014/021/030 material changed)* | `SECURITY.md`, `.npmrc`, `checkmarx.yml`, `Jenkinsfile`, `Dockerfile` unchanged; interceptor behaviour covered by `lantern-session.interceptor.spec.ts` | GIS ticket TBC (GIS exception request drafted for the audit advisories) |
| Lint | `evidence/04-release-3.0.0/lint.log` | pass (angular-eslint 13.5.0) |
| Production build, zero warnings | `evidence/04-release-3.0.0/build.log` | pass, 0 warnings |
| Package format gate | `evidence/04-release-3.0.0/verify-format.log` | pass (Ivy partial, APF v13, 7 public symbols) |
| Publish dry run / real publish to estate registry | `evidence/04-release-3.0.0/publish-dry-run.log`, `evidence/05-publish-verdaccio/publish-local.log` | pass |
| Single Angular version in tree | `evidence/04-release-3.0.0/npm-ls-angular-core.log` | `@angular/core@13.4.0` only |
| Consumer verification (retail-web, Angular 14.3.0) | `evidence/06-consumer-retail-web/SUMMARY.txt`, `b-build-prod.log`, `b-test-ci.log`, `CONSUMERS.md` | pass: `build:prod` exit 0, `test:ci` 196/198 (2 pre-existing skips), supported; peer-range caveat in `CONSUMERS.md` |

Open scanner findings carried into prod, with the GIS risk acceptance reference for each:

| finding id | severity | GIS acceptance | expiry |
|---|---|---|---|
| `npm audit` advisories in `@angular/common`, `@angular/compiler`, `@angular/core` 13.4.0 (13 High, 4 Moderate; fixes at `>=19.2.16` or none below 19; list in `00-baseline/npm-audit-production-summary.tsv`) | High | TBC — GIS dependency exception requested (`governance/GIS_EXCEPTION_DRAFT.md`), to be raised by the DAE engineering manager | requested: until the 13 -> 14 hop publishes, six months maximum per DEPENDENCY_POLICY.md section 5 |
| Angular 13 out of vendor support (GIS-STD-022) | High (GIS-2618 remains open) | TBC — `governance/TR_PACK.md`; ceiling reached, documents the upgrade not an extension | not applicable |

## 7. Implementation plan

1. Implementer: confirm `develop` contains the merged LNTN-401 PR (commits in section 9) and CI is
   green. 5 minutes.
2. Implementer: run the `lantern-sdk-release` Jenkins job on `develop` at tag `lantern-sdk-v3.0.0`
   (Node 14.21.3; `npm ci`, `npm run lint`, `npm test`, `npm run build`, `npm run verify:format`,
   `npm run publish:local` against Artifactory `npm-northgate`). Verify: job green, 10 minutes.
3. Implementer: `npm view @northgate/lantern-sdk@3.0.0 --registry <npm-northgate>` returns the
   manifest with `peerDependencies["@angular/core"] == ">=13.0.0 <14.0.0"` and no `metadata` entry;
   `npm view @northgate/lantern-sdk@2.4.1` still resolves. 5 minutes.
4. Implementer: in a clean checkout of retail-web at its current `develop`, `npm ci` then
   `npm install @northgate/lantern-sdk@3.0.0` (not committed), `npm run build:prod`, `npm run
   test:ci`. Verify: both green, as in `evidence/06-consumer-retail-web/`. 20 minutes.
5. Change owner: record the result in the CHG and hand the pin bump to the retail-web change
   (separate CHG). 5 minutes.

Estimated duration: 45 minutes. Bridge: TBC. Communications: not applicable (no customer facing
change; DAE posts in `#dae-lantern` when 3.0.0 is on the registry).

## 8. Rollback plan

| | |
|---|---|
| Rollback trigger | Step 3 or 4 fails; or a consumer reports a build/link failure or missing analytics events against 3.0.0 within hypercare. |
| Rollback steps | (1) Do not bump any consumer; retail-web keeps 2.4.1, which remains published and unchanged. (2) If 3.0.0 must be withdrawn: `npm deprecate @northgate/lantern-sdk@3.0.0 "withdrawn, see LNTN-401"` on `npm-northgate` (do not unpublish; DEPENDENCY_POLICY.md lockfiles may already reference it). (3) In this repository, revert the three LNTN-401 commits on `develop` with `git revert` (no data or schema migration exists). No Helm rollback applies. |
| Rollback duration | 15 minutes; executable by on-call with registry publisher rights, no implementer needed. |
| Point of no return | None for this change. The consumer pin bump (separate CHG) is where rollback becomes a consumer deploy. |
| Rollback tested in uat on | not applicable: no uat deploy; 2.4.1 coexistence verified on the estate Verdaccio (`evidence/05-publish-verdaccio/`, both versions present) |

## 9. AI-assisted changes

| | |
|---|---|
| AI-assisted content present | Yes |
| Tool(s) and approved-tool register entry | Devin (Cognition). Register entry AIT-014 — demo value, UNCONFIRMED against the TECH-POL-031 register; must be confirmed or corrected before submission. |
| Commits or PRs carrying the `AI-Assisted:` trailer | `a6d5826` LNTN-401 Record Angular 12 baseline and Angular 13 update preview; `0993454` LNTN-401 Upgrade Angular 12 to 13; `8cb51cb` LNTN-401 Migrate lint from TSLint to angular-eslint 13; `15793de` LNTN-401 Release 3.0.0 for the Angular 13 line; plus the governance/Jira commits on the same branch. PR URL: see `REPORT.md`. |
| Human reviewer(s) of the AI-assisted content (not the prompter) | TBC — must not be the requester of the session; CODEOWNERS requests `@northgate/digital-analytics-enablement`, `@northgate/cswt-architecture` (`/docs/adr/`). |
| Review evidence | TBC — PR review with the `PR_REVIEW_AI.md` checklist completed |
| Scanner results for AI-assisted files specifically | EVIDENCE MISSING (no Checkmarx/Sonar in the local estate); `npm audit` delta versus baseline: none (same 17 advisories, all in `@angular/*`) |

## 10. Post implementation

- Hypercare owner and duration: TBC (DAE); 48 hours from the first consumer taking 3.0.0, business
  hours (analytics is not a P1 service, `RISK-2019-118`).
- Success criteria: `@northgate/lantern-sdk@3.0.0` resolvable from `npm-northgate`; retail-web
  `build:prod` and `test:ci` green on 3.0.0 in its pipeline; after the consumer bump deploys, Lantern
  page-event volume in the vendor dashboard within +-10% of the prior week and Splunk shows
  `X-Analytics-Session` on BFF calls at the prior rate.
- Monitoring dashboards to watch: Lantern vendor dashboard (retail-web project), Splunk
  `X-Analytics-Session` join dashboard (links TBC, DAE runbook).
- PIR required: No (Low), unless rollback is triggered.

## 11. Approvals

| role | name | date |
|---|---|---|
| Change owner | TBC | |
| Technical approver (not on the requesting team) | TBC (`@northgate/cswt-architecture`) | |
| GIS approver *(if section 6 has accepted findings or GIS standards material changed)* | TBC (`@northgate/gis-appsec`) — required, section 6 carries accepted findings | |
| Business approver *(Medium and High)* | not applicable: Low | |
| CAB chair | TBC | |
