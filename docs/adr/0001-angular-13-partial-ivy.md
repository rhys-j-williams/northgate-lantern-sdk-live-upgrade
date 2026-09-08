# ADR 0001: Angular 13 and Ivy partial compilation for `@northgate/lantern-sdk` 3.x

<!-- Generated with AI assistance (AIT-014, register entry unconfirmed) on 2026-09-08; reviewed by TBC (@northgate/cswt-architecture via CODEOWNERS). -->

Status: Proposed
Date: 2026-09-08
Deciders: TBC — CSWT Architecture (`@northgate/cswt-architecture`), DAE product owner (TBC), GIS AppSec (`@northgate/gis-appsec`, TBC)
Tickets: LNTN-401 (epic), Jira keys TBC (see `docs/upgrade/LNTN-401/jira/TICKET_PLAN.md`); related LNTN-140, LNTN-361, GIS-2618, TR-1102
Supersedes: none (first ADR in this repository; the View Engine decision was recorded only in the README under LNTN-361)
Superseded by: none

## Context

`@northgate/lantern-sdk` 2.4.1 is built with Angular 12.2.17 in View Engine mode
(`enableIvy: false`, `verify:view-engine` release gate). Angular 12 reached end of life on
2022-11-12. The GIS-STD-022 acceptance for the line, TR-1102, expired on 2025-11-12 and GIS-2618 is
open as a High against the package (`northgate-platform-tooling/governance/FRAMEWORK_SUPPORT_STANDARD.md`
section 6). Section 5 of that standard puts the thirty-six month ceiling at 2025-11-12, so no
renewal is possible: the only path to compliance is the upgrade.

The only live consumer is retail-web (Northgate Online, Angular 14.3.0, `legacy-peer-deps=true`,
`ngcc` in `postinstall`). Its own acceptance TR-1188 reaches the ceiling on 2026-11-18 and its
deferral ADR (retail-web ADR 0014, item 3) names this package's View Engine output as a blocker for
anything past Angular 15, because Angular 16 removes `ngcc`. Business-web does not currently pin the
package; the Beacon console consumer named in the README is not in the estate workspace.

The View Engine format was retained under LNTN-361 (README, 2.x line) because moving to Ivy was
believed to need the vendor script type contract re-signed and an updated Third Party Risk
assessment. Those two items sit with the Vendor Relationship team. Nothing in this hop changes the
vendor script, its URL, the data sent to the collector, or the SDK's public API; this ADR records
the two items as open governance questions for the architecture review rather than treating them
as resolved.

Angular's supported library format since v13 is Ivy partial compilation (Angular Package Format
v13). Angular 13 removed View Engine library output from ng-packagr; a library built on Angular 13
is either partial-Ivy or full-Ivy, and full-Ivy output is only consumable by the exact compiler
version that produced it.

## Options considered

1. **Do nothing.** Not available. TR-1102 is at the ceiling, GIS-2618 is open, and the package is in
   the build path of a Tier 1 customer-facing deployable whose own acceptance expires in the 2026.11
   train.
2. **Angular 13, full Ivy (`compilationMode: "full"`).** Rejected. Output is tied to the compiler
   version; an Angular 14 consumer cannot link it. Fails the shared-library obligation in
   GIS-STD-022 section 3.
3. **Angular 13, Ivy partial compilation (`compilationMode: "partial"`).** Chosen. Standard library
   format; the consumer's own compiler links the `ɵɵngDeclare*` declarations at build time, so an
   Angular 14 consumer can use a 13-built package and no `ngcc` step is needed for this package.
4. **Skip to Angular 14 or the current major in one step.** Rejected for this change. The estate
   upgrade playbook and DEPENDENCY_POLICY.md section 4 require one major per hop with a gate at
   each step, so that every migration schematic runs against the version it was written for. The
   next hop (13 -> 14) is the same epic and is scheduled immediately after. Architecture's standing
   position (CSWT-ARCH minutes 2026-01-15) that the target is the current major applies to the
   line, not to a single hop: this ADR does not propose stopping at 13.
5. **Replace Lantern.** Out of scope; a procurement conversation (retail-web ADR 0014).

## Decision

- `@northgate/lantern-sdk` 3.0.0 is built with Angular 13.4.0 (CLI 13.3.11, ng-packagr 13.3.1,
  TypeScript 4.6.4, RxJS 6.6.7, Node 14.21.3) and published in Ivy partial compilation mode
  (`compilationMode: "partial"` in `projects/lantern-sdk/tsconfig.lib.prod.json`), APF v13.
- Peer range `@angular/{core,common,router} >=13.0.0 <14.0.0`; `rxjs >=6.5.0 <7.0.0` unchanged.
- The release gate `verify:view-engine` is replaced by `verify:format`
  (`scripts/verify-partial-ivy.js`): no `*.metadata.json`, no full-Ivy `ɵɵdefine*` markers,
  `ɵɵngDeclare*` present for module, injector, service, router tracker, interceptor and directive,
  compiler 13.x, APF v13 manifest with `exports` map, peer lower bound 13, all seven public API
  symbols exported. It runs on the build output and on the packed tarball in `scripts/publish.sh`.
- Lint moves from TSLint/codelyzer to angular-eslint 13.5.0 in the same release (TSLint is
  unsupported on Angular 13; codelyzer pulled a nested Angular 9 into the tree).
- The public API (`LanternModule.forRoot`, `LanternService`, `LanternRouterTracker`, `lanternTrack`,
  `LanternSessionInterceptor`, `LANTERN_CONFIG`, `maskPath`), identifier masking and the
  `X-Analytics-Session` header are unchanged. The `sdk` context string and `data-lantern-sdk`
  attribute report `3.0.0`.
- Semver major (3.0.0) because the peer range excludes Angular 12 consumers. 2.4.1 stays published
  for them under the ninety-day rule in GIS-STD-022 section 3.
- Order of operations fixed by this ADR: 12 -> 13 (this change) -> 14 (LNTN-401, next hop) before
  the estate's 14 -> 15 wave (Canopy 4 / CNPY-2140, retail-web MOL-4471). The package must be on
  Angular 14 before retail-web starts its 14 -> 15 hop.

## Consequences

Good:

- The Angular 12 EOL finding on the package is retired once 3.0.0 is consumed; GIS-2618 can be
  closed or narrowed by GIS on the next hop's evidence.
- Retail-web's ADR 0014 item 3 (View Engine, `ngcc`) is unblocked for this package.
- Angular 14 consumer verified against the published 3.0.0 on the estate registry
  (`docs/upgrade/LNTN-401/CONSUMERS.md`).
- Migration schematics ran against the exact versions they target; the evidence is per gate under
  `docs/upgrade/LNTN-401/evidence/`.

Bad / open:

- Angular 13 is itself out of vendor support (EOL 2023-05-04). Until the 13 -> 14 hop lands the
  package remains non-compliant with GIS-STD-022; the TR pack
  (`docs/upgrade/LNTN-401/governance/TR_PACK.md`) documents the upgrade, not an extension.
- `npm audit --production` reports 17 advisories (13 High, 4 Moderate), all in `@angular/*` 13.4.0,
  with fixes only at Angular 19.2.16 or none below 19. They are recorded as a GIS dependency
  exception request (`docs/upgrade/LNTN-401/governance/GIS_EXCEPTION_DRAFT.md`), not fixed by
  skipping majors.
- The LNTN-361 items (vendor script type contract, Third Party Risk assessment) are not resolved by
  this change; whether they apply to a partial-Ivy build of unchanged wrapper code is a question for
  the architecture review and Vendor Relationship.
- Angular 12 consumers cannot take 3.x. None are known in the estate.
- Formal peer ranges do not admit Angular 14 or RxJS 7; retail-web relies on its existing
  `legacy-peer-deps=true` policy (MOL-3611). The next hop moves the Angular peer to 14.

## Addenda

- 2026-09-08: proposed with the LNTN-401 hop PR into `develop`. Evidence:
  `docs/upgrade/LNTN-401/REPORT.md`, `COMPATIBILITY_MATRIX.md`, `CONSUMERS.md`, `CAB_RECORD.md`.
