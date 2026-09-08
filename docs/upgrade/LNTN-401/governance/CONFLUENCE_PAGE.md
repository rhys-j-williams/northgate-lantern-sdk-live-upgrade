# Confluence decision page — paste-ready fallback

<!-- Generated with AI assistance (AIT-014, register entry unconfirmed) on 2026-09-08; reviewed by TBC. -->

The connected Atlassian MCP (`rjwills92.atlassian.net`) has Jira scopes only and no Confluence site,
so this page could not be created in `CSWT-ARCH`. Paste it there under the Lantern SDK ADR index
(create the index under the space home if none exists). Use native table macros for the tables.
Labels: `adr`, `lantern-sdk`, `ai-assisted`. One page per ADR number; update, do not duplicate.

---

**Title:** ADR 0001: Angular 13 and Ivy partial compilation for `@northgate/lantern-sdk` 3.x (northgate-lantern-sdk)

**Status:** Proposed

**Decision summary**

1. `@northgate/lantern-sdk` 3.0.0 is built on Angular 13.4.0 and published as Ivy partial compilation (APF v13), peer `@angular/* >=13.0.0 <14.0.0`.
2. View Engine output and the `verify:view-engine` gate are retired; `verify:format` (`scripts/verify-partial-ivy.js`) is the release gate.
3. Public API, identifier masking and the `X-Analytics-Session` header are unchanged; TSLint is replaced by angular-eslint 13.
4. One major per hop: 12 -> 13 now, 13 -> 14 next under LNTN-401, before the estate 14 -> 15 wave.
5. Angular 13 is out of support; no acceptance is requested (ceiling reached), the TR pack documents the upgrade.

**Link to the ADR in the repo**

- Branch: `https://github.com/rhys-j-williams/northgate-lantern-sdk-live-upgrade/blob/feature/LNTN-401-angular-12-to-13/docs/adr/0001-angular-13-partial-ivy.md`
- After merge: `https://github.com/rhys-j-williams/northgate-lantern-sdk-live-upgrade/blob/develop/docs/adr/0001-angular-13-partial-ivy.md`

**Compliance mapping**

| Standard | Item | How this decision maps |
|---|---|---|
| GIS-STD-022 (Framework support) | Section 6 row "Lantern SDK wrapper 2.x": Angular 12 EOL 2022-11-12, TR-1102 expired 2025-11-12, GIS-2618 open | Retires the Angular 12 line. Angular 13 is also past the section 5 ceiling; no acceptance requested, `governance/TR_PACK.md` |
| GIS-STD-022 section 3 (shared library owners) | Supported version for the consumer's major; 2.x kept for 90 days | 3.0.0 verified on the Angular 14 consumer (`CONSUMERS.md`); 2.4.1 stays published |
| TECH-STD-044 (Dependency policy) | Exact pins, lockfile, version map move via ADR, no `audit fix --force` | Exact pins, `npm ci` per gate; this ADR is the version-map move; `npm audit` advisories -> `governance/GIS_EXCEPTION_DRAFT.md` |
| TECH-POL-031 (AI-assisted code) | Register entry, trailers, non-prompter reviewer | AIT-014 (unconfirmed) on every commit; reviewer TBC; CAB record section 9 |
| GIS-STD-014 (AppSec) | No sanitisation bypass, internal registry, CSP vendor origin | Unchanged; `SECURITY.md` not modified |
| GIS-STD-021 (Session storage) | Not touched | `sessionId()` behaviour unchanged, spec-covered |

**Options considered**

| Option | Outcome | Why |
|---|---|---|
| Do nothing | Not available | Acceptance at ceiling, GIS-2618 open, Tier 1 consumer in the build path |
| Angular 13 full Ivy | Rejected | Output tied to compiler version; Angular 14 consumer cannot link it |
| Angular 13 partial Ivy | Chosen | Standard library format from v13; consumer links at build time; no `ngcc` for this package |
| Skip to 14 or current major in one change | Rejected for this change | One major per hop; 13 -> 14 is the next scheduled hop in the same epic |
| Replace Lantern | Out of scope | Procurement conversation (retail-web ADR 0014) |

**Risks and mitigations**

| Risk | Mitigation |
|---|---|
| Partial-Ivy output does not link in the Angular 14 consumer | Published 3.0.0 to the estate Verdaccio and ran retail-web `build:prod` + `test:ci` in a read-only scratch clone; result in `CONSUMERS.md` |
| Angular 13 remains out of support | Next hop (13 -> 14) scheduled in LNTN-401; TR pack states the ceiling; GIS-2618 stays open until then |
| `npm audit` High advisories in `@angular/*` 13.4.0 with no fix below 19 | GIS dependency exception request drafted; peers, not runtime, for consumers; AppSec read in the draft |
| Peer range formally excludes Angular 14 / RxJS 7 | Consumer relies on its existing `legacy-peer-deps=true` (MOL-3611); next hop moves the Angular peer to 14 |
| LNTN-361 vendor items (type contract, Third Party Risk) | Flagged as open questions in the ADR for architecture and Vendor Relationship; vendor script unchanged |

**Approvals**

| Role | Name | Date | Outcome |
|---|---|---|---|
| Architecture (`@northgate/cswt-architecture`) | | | |
| Product owner (DAE) | | | |
| GIS AppSec (`@northgate/gis-appsec`) | | | |

**Related Jira keys**

LNTN-401 (epic, bank instance). Connected-site (KAN, `rjwills92.atlassian.net`) keys: KAN-1 (epic stand-in),
KAN-2 (hop story), KAN-4 (architecture review of this ADR, due 2026-09-23), KAN-3 (retail-web verification);
full index in `docs/upgrade/LNTN-401/jira/TICKET_PLAN.md`. Related: LNTN-140, LNTN-361, GIS-2618, TR-1102, MOL-4471.
