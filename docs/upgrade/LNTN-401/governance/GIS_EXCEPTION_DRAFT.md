# GIS dependency exception request — DRAFT, not raised

<!-- Generated with AI assistance (AIT-014, register entry unconfirmed) on 2026-09-08; reviewed by TBC. -->

DEPENDENCY_POLICY.md (TECH-STD-044) section 5: raised as a GIS ticket of type `Dependency exception`
by the requesting team's engineering manager. This file is the text for that ticket. It was not
created in `GIS` and carries no GIS, GIS-EX or Xray identifier.

| field | value |
|---|---|
| Requesting team | Digital Analytics Enablement (DAE) |
| Raised by | TBC (DAE engineering manager) |
| Component | `@northgate/lantern-sdk` 3.0.0 (build and peer dependencies) |
| Package and exact version | `@angular/core` 13.4.0, `@angular/common` 13.4.0, `@angular/compiler` 13.4.0 (and the other `@angular/*` 13.4.0 packages that share the advisories) |
| Related | LNTN-401, GIS-2618, TR-1102 (expired), ADR `docs/adr/0001-angular-13-partial-ivy.md` |

## Reason the version is needed

The package is being moved off Angular 12 (EOL 2022-11-12, acceptance at the ceiling) one major at
a time as the estate upgrade playbook requires, so that each official migration schematic runs
against the version it was written for. Angular 13.4.0 is the last 13.x patch. The advisories below
have no fix inside Angular 13.

## Advisories (from `npm audit --production`, Node 14.21.3 / npm 6.14.18)

Source: `docs/upgrade/LNTN-401/evidence/04-release-3.0.0/npm-audit-production.log`; the same 17
were present at baseline on 12.2.17 (`00-baseline/npm-audit-production-summary.tsv`). Delta versus
baseline: none.

| severity | package | vulnerable range | fix | title |
|---|---|---|---|---|
| high | @angular/common | <19.2.16 | >=19.2.16 | XSRF token leakage via protocol-relative URLs in HttpClient |
| high | @angular/common | <=18.2.14 | none below 19 | DoS via OOM in number formatting (digitsInfo) |
| high | @angular/common | <=18.2.14 | none below 19 | Information leak via default caching of credentialed requests in HttpTransferCache |
| high | @angular/common | <=19.2.25 | none below 19 | DoS via OOM in date formatting (formatDate) |
| high | @angular/common | <=19.2.25 | none below 19 | Weak 32-bit cache key hashing in HttpTransferCache |
| high | @angular/common | <=19.2.25 | none below 19 | Cache-key ambiguity in HttpTransferCache |
| high | @angular/compiler | <=18.2.14 | none below 19 | Stored XSS via SVG animation, SVG URL and MathML attributes |
| high | @angular/compiler | <=18.2.14 | none below 19 | XSS via unsanitised SVG script attributes |
| high | @angular/compiler | <=19.2.25 | none below 19 | i18n XSS via event-handler attributes |
| high | @angular/core | <=18.2.14 | none below 19 | XSS via unsanitised SVG script attributes |
| high | @angular/core | <=18.2.14 | none below 19 | i18n XSS |
| high | @angular/core | <=19.2.25 | none below 19 | Client hydration DOM clobbering and response-cache poisoning |
| high | @angular/core | <=19.2.25 | none below 19 | i18n XSS via event-handler attributes |
| moderate | @angular/compiler | <=18.2.14 | none below 19 | Template and attribute namespace sanitisation bypass (XSS) |
| moderate | @angular/compiler | <=19.2.25 | none below 19 | Two-way property binding sanitisation bypass (XSS) |
| moderate | @angular/core | <=18.2.14 | none below 19 | Template and dynamic component namespace bypass (XSS) |
| moderate | @angular/core | <=18.2.14 | none below 19 | Template and attribute namespace sanitisation bypass (XSS) |

## Why the alternatives were rejected

- **Different version.** The lowest fixed version for any of these is 19.2.16; most have no fix
  below 19. Skipping from 12 to 19 in one change is outside the one-major-per-hop rule and would
  bypass six sets of migration schematics. Not fixed by skipping majors.
- **`npm audit fix --force`.** Prohibited by DEPENDENCY_POLICY.md section 4.
- **`overrides`.** Cannot override the framework the package is compiled against.
- **Doing without.** The package exists to wrap the vendor script for Angular consumers.

## How the package is exposed (for the AppSec read of the advisories)

`@angular/*` are `peerDependencies` of the published package; the consumer's own Angular version
(retail-web: 14.3.0) is what runs in the browser, not 13.4.0. The 13.4.0 packages are used at build
time in this repository (compiler, test host). The wrapper has no templates beyond an attribute
directive, no i18n, no HttpTransferCache / hydration, no SVG or MathML, and does not use `formatDate`
or `formatNumber` (`projects/lantern-sdk/src/lib/`). The `HttpClient` interceptor adds one header
to configured URL prefixes; XSRF handling belongs to the consumer. Code references for the "we do
not call the vulnerable function" test are the seven source files under `projects/lantern-sdk/src/lib/`;
no unit test currently asserts the absence of those APIs (EVIDENCE MISSING if GIS requires one).

## Compensating controls

See `TR_PACK.md` section 3: hosted vendor script, path masking, header prefix allow-list, no
sanitisation bypass, internal registry with exact pins, per-release `npm audit` recorded.

## Requested expiry

Six months from approval (the section 5 maximum), or the publish of the Angular 14 line of this
package (LNTN-401 next hop), whichever is earlier. Note for the assessor: Angular 14 carries the
same advisory set; the exception will need re-raising at that hop unless the estate moves further.
