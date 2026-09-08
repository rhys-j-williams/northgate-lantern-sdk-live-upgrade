# Architecture review ticket — body

<!-- Generated with AI assistance (AIT-014, register entry unconfirmed) on 2026-09-08; reviewed by TBC. -->

Intended: Jira Task in `LNTN`, `Architecture review: ADR 0001 Angular 13 and Ivy partial compilation`,
linked `relates to` the hop story and LNTN-401, labels `architecture-review`, `ai-assisted`.
On the connected site this was created 2026-09-08 as **KAN-4**
(https://rjwills92.atlassian.net/browse/KAN-4), summary `[LNTN] Architecture review: ADR 0001 Angular 13
partial-Ivy build`, labels `estate-LNTN`, `architecture-review`, `ai-assisted`, parent KAN-1, `relates to`
KAN-2 (hop story), due date 2026-09-23 (row R1 of `../jira/TICKET_PLAN.md`). Unassigned; no reviewer was named.

---

h2. Decision needed

Approve (or return) ADR 0001: build `@northgate/lantern-sdk` 3.x on Angular 13.4.0 as Ivy partial
compilation with peer `@angular/* >=13.0.0 <14.0.0`, retiring the View Engine 2.x line; next hop
13 -> 14 under the same epic before the estate's 14 -> 15 wave. Architecture's standing position
(CSWT-ARCH 2026-01-15) prefers the current major; the ADR argues one-major-per-hop for a package
whose consumer is on Angular 14, and asks for that to be accepted for this hop.

h2. Where to read

* ADR (branch): https://github.com/rhys-j-williams/northgate-lantern-sdk-live-upgrade/blob/feature/LNTN-401-angular-12-to-13/docs/adr/0001-angular-13-partial-ivy.md
* PR: https://github.com/rhys-j-williams/northgate-lantern-sdk-live-upgrade/pull/1 ; CODEOWNERS routes `docs/adr/**` to
  `@northgate/cswt-architecture`, whose PR approval is the record
* Confluence decision page: not created (no Confluence on the connected Atlassian site); paste-ready
  text at `docs/upgrade/LNTN-401/governance/CONFLUENCE_PAGE.md`
* CAB record: `docs/upgrade/LNTN-401/CAB_RECORD.md` (+ `CAB_ITSM_FIELDS.md`)
* GIS-STD-022 pack: `docs/upgrade/LNTN-401/governance/TR_PACK.md`; dependency exception draft
  `governance/GIS_EXCEPTION_DRAFT.md`
* Evidence: `docs/upgrade/LNTN-401/00-baseline/`, `evidence/02-angular-13/`, `evidence/03-angular-eslint/`,
  `evidence/04-release-3.0.0/`, `evidence/05-publish-verdaccio/`, `evidence/06-consumer-retail-web/`
* Consumer result: `docs/upgrade/LNTN-401/CONSUMERS.md` (retail-web Angular 14.3.0: supported)

h2. Needed by

Target train 2026.10.2 (RELEASE_CALENDAR.md: code freeze Fri 2026-10-02, CAB Tue 2026-10-06 10:00 ET,
submission deadline Mon 2026-10-05 17:00 ET, prod Thu 2026-10-08). The train before it (2026.09.4)
is skipped for the Q3 freeze (Thu 2026-09-24 17:00 ET to Mon 2026-10-05 09:00 ET), so "one train
earlier" is 2026.09.2, whose CAB was 2026-09-08. Review therefore needed **by Wed 2026-09-23**, the
last working day before the freeze, so the CAB record can cite an accepted ADR on submission.

h2. Questions for architecture

# Accept the 12 -> 13 -> 14 sequence for this package (ADR 0001 "Order of operations") rather than a
  single jump, given retail-web on 14.
# Confirm partial compilation (not full Ivy) as the estate library format from Angular 13 on; Canopy
  already ships partial.
# LNTN-361 items (vendor type contract, Third Party Risk) are outside this ADR; confirm they stay
  with Vendor Relationship.

h2. Reviewers

`@northgate/cswt-architecture` (mention if the instance supports groups); GIS AppSec
(`@northgate/gis-appsec`) for the TR pack and exception draft; DAE product owner (TBC).

----
Drafted with AI assistance (AIT-014, register entry unconfirmed) on 2026-09-08; to be reviewed by TBC.
