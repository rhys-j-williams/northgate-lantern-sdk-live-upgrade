# GIS-STD-022 risk pack — `@northgate/lantern-sdk` (Lantern SDK wrapper)

<!-- Generated with AI assistance (AIT-014, register entry unconfirmed) on 2026-09-08; reviewed by TBC. -->

Draft for the DAE product owner and engineering manager to take to Technology Risk and GIS AppSec.
Nothing here has been submitted. No TR, GIS-RA or GIS-EX number is assigned; where one is needed it
is `TBC`.

## 1. Deployable and component

| | |
|---|---|
| Deployable | `@northgate/lantern-sdk` (shared library, in the build path of retail-web / Northgate Online, Tier 1) |
| Owner | Digital Analytics Enablement (DAE), Jira `LNTN` |
| Component out of support | Angular framework used to build and declared as peer |
| Current published line | 2.4.1 on Angular 12.2.17, View Engine. Angular 12 end of life **2022-11-12**. |
| Line proposed in this change | 3.0.0 on Angular 13.4.0, Ivy partial compilation. Angular 13 end of life **2023-05-04**. Still out of support. |
| Standard row | `FRAMEWORK_SUPPORT_STANDARD.md` section 6: "Lantern SDK wrapper (`@northgate/lantern-sdk` 2.x)", acceptance TR-1102, **expired 2025-11-12**, see GIS-2618 |

## 2. Acceptance status and the ceiling

- TR-1102 covered Angular 12 / View Engine and expired 2025-11-12. That date is thirty-six months
  after the Angular 12 end of life (2022-11-12), i.e. the section 5 ceiling. **Renewal is not
  possible.** The only path to compliance is the upgrade (section 5, last bullet).
- GIS-2618 is open as a High against the package.
- Angular 13 (this change) reached end of life on 2023-05-04. Thirty-six months from that date is
  2026-05-04, already past. An acceptance for Angular 13 is therefore also outside the ceiling.
  **This pack does not request an extension or a new acceptance for Angular 13.** It documents the
  upgrade and its order of operations so that GIS-2618 can be tracked to closure.

## 3. Compensating controls in force

From `SECURITY.md` (GIS-STD-014 rev 9) and the repository as it stands; these are the controls that
were accepted under TR-1102 and remain in place. They do not extend the ceiling.

| control | where | status |
|---|---|---|
| Vendor script served from the Northgate hosted copy, not the vendor CDN; egress proxy blocks the CDN (GIS-1188) | `README.md` "The vendor script"; `scriptUrl` default | unchanged |
| Identifier masking on router page paths and query strings (GIS-1471) | `maskPath`, `LanternRouterTracker`; specs `lantern-router.service.spec.ts` | unchanged, 18/18 specs pass on 3.0.0 |
| `X-Analytics-Session` header only on configured URL prefixes (GIS-1471 finding 6) | `LanternSessionInterceptor`, `sessionHeaderUrlPrefixes` | unchanged |
| No `bypassSecurityTrust*`, no inline scripts other than the vendor loader | source; angular-eslint rules | unchanged; lint pass |
| Internal registry only, exact pins, lockfile verified with `npm ci` (TECH-STD-044) | `.npmrc`, `package.json`, `package-lock.json` | unchanged policy; lockfile re-verified per gate |
| `npm audit --production` run and recorded per release | `docs/upgrade/LNTN-401/evidence/*/npm-audit-production.log` | run; 17 advisories, all in `@angular/*`, see `GIS_EXCEPTION_DRAFT.md` |
| Package format release gate | `scripts/verify-partial-ivy.js` (`npm run verify:format`) | replaces `verify:view-engine` |
| Data classification Synthetic — Non Restricted; no PII in the wrapper | `DATA_CLASSIFICATION.md` | unchanged |

Not in force / EVIDENCE MISSING: Checkmarx and Xray runs (no scanners in the local estate); Sonar
quality gate. The Jenkins job for this repository (`lantern-sdk-release`) is named in the README but
no `Jenkinsfile` is present in the repository.

## 4. Upgrade plan by ADR reference

| step | scope | ADR / ticket | state |
|---|---|---|---|
| 1 | Angular 12.2.17 -> 13.4.0, View Engine -> Ivy partial, publish 3.0.0 | `docs/adr/0001-angular-13-partial-ivy.md` (Proposed), LNTN-401, hop story TBC | this change; gates green, PR open (see `REPORT.md`) |
| 2 | Angular 13.4.0 -> 14.x, peer `>=14 <15`, publish 4.0.0 | LNTN-401 next hop (ADR addendum or ADR 0002) | not started; must land before retail-web begins 14 -> 15 |
| 3 | retail-web takes 3.0.0 then 4.0.0 (pin bumps, retail-web CAB records) | MOL-4471 / `[MOL]` verify task TBC | 3.0.0 verified in a scratch clone, `CONSUMERS.md` |
| 4 | Estate 14 -> 15 wave: Canopy 4 (CNPY-2140), retail-web (MOL-4471) | retail-web ADR 0014 item 3 unblocked by steps 1-2 | outside this repository |
| 5 | Lantern follows the estate to the current major (Architecture position, CSWT-ARCH 2026-01-15) | future ADR | not scheduled |

## 5. Requested expiry

**No expiry requested.** Both Angular 12 and Angular 13 are past the thirty-six month ceiling of
GIS-STD-022 section 5, so no acceptance can be granted for either. The request to Technology Risk
and GIS AppSec is instead:

1. Record against GIS-2618 that the Angular 12 / View Engine line is superseded by 3.0.0 on merge
   and publish, with the evidence in `docs/upgrade/LNTN-401/`.
2. Keep GIS-2618 open until step 2 (Angular 14) is published, then reassess against the estate
   version map (Angular 14 is itself at its ceiling on 2026-11-18 for retail-web, TR-1188).
3. Assess the dependency exception request for the `npm audit` advisories in `@angular/*` 13.4.0
   (`GIS_EXCEPTION_DRAFT.md`, six months maximum per DEPENDENCY_POLICY.md section 5).

## 6. Signatories (TBC)

| role | name | date |
|---|---|---|
| Product owner (DAE) | TBC | |
| CSWT CIO delegate | TBC | |
| GIS AppSec reviewer | TBC (`@northgate/gis-appsec`) | |
