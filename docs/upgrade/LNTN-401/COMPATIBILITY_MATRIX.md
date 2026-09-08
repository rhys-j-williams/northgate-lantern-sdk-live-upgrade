# LNTN-401 Compatibility matrix: Angular 12.2.17 -> 13.4.0

<!-- Generated with AI assistance (AIT-014, register entry unconfirmed) on 2026-09-08; reviewed by TBC. -->

Scope: **one hop only**, Angular 12 -> 13, for `@northgate/lantern-sdk` (workspace
`rhys-j-williams/northgate-lantern-sdk-live-upgrade`, branch `feature/LNTN-401-angular-12-to-13`).
Angular 13 -> 14 is the next hop and is not assessed here. Every version below is an exact pin
(TECH-STD-044; `.npmrc` has `save-exact=true`). Sources: `ng update` preview
(`evidence/01-ng-update-preview/ng-update-list.log`), the real update run
(`evidence/02-angular-13/ng-update.log`), registry `peerDependencies` / `engines` metadata read with
`npm view` on 2026-09-08, and the Angular version compatibility table (angular.io/guide/versions,
Angular 13 row).

Verdict: **SUPPORTED** for the hop. No package needs a version outside Angular 13's matrix; Node
14.21.3 stays; the only items that cannot be resolved inside Angular 13 are the `npm audit`
advisories in Angular itself (section 7) which go to a GIS exception draft, not a fix.

## 1. Framework and tooling

| Package | 12.x (baseline) | 13.x (target) | Constraint checked | Result |
|---|---|---|---|---|
| `@angular/core` | 12.2.17 | 13.4.0 | latest 13.x patch on the registry | ok |
| `@angular/common` | 12.2.17 | 13.4.0 | same version as core | ok |
| `@angular/compiler` | 12.2.17 | 13.4.0 | same version as core | ok |
| `@angular/compiler-cli` | 12.2.17 | 13.4.0 | same version as core; peers `typescript >=4.4.2 <4.7` | ok |
| `@angular/router` | 12.2.17 | 13.4.0 | same version as core | ok |
| `@angular/forms` | 12.2.17 | 13.4.0 | same version as core (dev only, specs) | ok |
| `@angular/animations` | 12.2.17 | 13.4.0 | same version as core (dev only) | ok |
| `@angular/platform-browser` | 12.2.17 | 13.4.0 | same version as core (dev only, Karma) | ok |
| `@angular/platform-browser-dynamic` | 12.2.17 | 13.4.0 | same version as core (dev only, Karma) | ok |
| `@angular/cli` | 12.2.18 | 13.3.11 | latest 13.x; `engines.node ^12.20.0 || ^14.15.0 || >=16.10.0`, `npm ^6.11.0 || ^7.5.6 || >=8.0.0` | ok (Node 14.21.3, npm 6.14.18) |
| `@angular-devkit/build-angular` | 12.2.18 | 13.3.11 | same as CLI; peers `typescript >=4.4.3 <4.7`, `ng-packagr ^13.0.0` | ok |
| `ng-packagr` | 12.2.7 | 13.3.1 | latest 13.x; peers `@angular/compiler-cli ^13.0.0`, `typescript >=4.4.0 <4.7`, `tslib ^2.3.0` | ok |
| `typescript` | 4.3.5 | 4.6.4 | intersection of the three ranges above is `>=4.4.3 <4.7`; 4.6.4 is the last 4.6 patch | ok |
| `tslib` | 2.3.1 | 2.3.1 (unchanged) | ng-packagr 13 needs `^2.3.0`; Angular 13 packages depend on `^2.3.0` | ok |
| `rxjs` | 6.6.7 | 6.6.7 (unchanged) | Angular 13 peers `^6.5.3 || ^7.4.0` | ok, RxJS 7 not required for this hop |
| `zone.js` | 0.11.4 | 0.11.4 (unchanged) | Angular 13 peers `~0.11.4` | ok |
| `@types/node` | 16.18.11 | 16.18.11 (unchanged) | TS 4.6 parses it | ok |
| `@types/jasmine` / `jasmine-core` | 3.8.2 / 3.8.0 | unchanged | Angular 13 test schematics target jasmine 3.10; 3.8 still runs under `@angular-devkit/build-angular:karma` 13 | ok (18/18) |
| `karma` 6.3.x, `karma-chrome-launcher`, `karma-coverage`, `karma-jasmine` | unchanged | unchanged | Karma 6 supported by build-angular 13 | ok |
| Node | 14.21.3 (`.nvmrc`, `engines`) | 14.21.3 | CLI 13 supports `^14.15.0` | ok, stays per the run rules |
| npm | 6.14.18 | 6.14.18 | CLI 13 supports `^6.11.0` | ok |

`ng update` changed exactly the rows marked with a new value; everything else is pinned as before.
`npm ls @angular/core` after the update: one top-level 13.4.0 plus a nested `@angular/core@9.0.0`
under `codelyzer@6.0.2` (unmet peer) — pre-existing at baseline and removed by the
TSLint -> angular-eslint commit (section 4).

## 2. Package format: View Engine -> Ivy partial compilation

| Item | 12.x | 13.x | Notes |
|---|---|---|---|
| `angularCompilerOptions.enableIvy` | `false` | removed | View Engine is not available in Angular 13 (`ng update` migration "Update library projects to be published in partial mode"). |
| `compilationMode` | n/a | `"partial"` | Required by the run rules; consumers' Angular linker (`@angular/compiler-cli/linker`, built into the CLI from v12) finalises the declarations at build time. |
| `skipTemplateCodegen`, `strictMetadataEmit` | `true` | removed | View Engine metadata-collector options; no effect in Ivy. |
| `*.metadata.json` files | emitted | none | ngcc no longer needed for this package. |
| Angular Package Format | APF v12 (UMD + FESM2015 + ESM2015 + metadata) | APF v13 (FESM2020/FESM2015/ESM2020 `.mjs`, `exports` map, no UMD) | Consumers must be Angular CLI >= 13 style builders; Angular 14 retail-web qualifies. |
| Partial declaration `minVersion` | n/a | `12.0.0` (compiler `13.4.0`) | Any consumer linker >= 12.0.0 can process the output; Angular 14 linker accepts it. |
| Release gate | `scripts/verify-view-engine.js` (`verify:view-engine`) | `scripts/verify-partial-ivy.js` (`verify:format`) | Asserts no metadata, `ɵɵngDeclare*` present from a 13.x compiler, no `ɵɵdefine*` (full Ivy), APF v13 manifest, peer range, seven public API symbols exported. |

## 3. Library peer dependencies (`projects/lantern-sdk/package.json`)

| Peer | 2.4.1 | 3.0.0 | Reason |
|---|---|---|---|
| `@angular/core` | `>=12.0.0 <13.0.0` | `>=13.0.0 <14.0.0` | Run rule: `>=13 <14`. Semver major of the package (2.4.1 -> 3.0.0). |
| `@angular/common` | `>=12.0.0 <13.0.0` | `>=13.0.0 <14.0.0` | same |
| `@angular/router` | `>=12.0.0 <13.0.0` | `>=13.0.0 <14.0.0` | same |
| `rxjs` | `>=6.5.0 <7.0.0` | unchanged | Not part of the hop. The library uses only `Observable`, `Subscription`, `filter`, which exist unchanged in RxJS 7; widening is a 13 -> 14 hop decision. See CONSUMERS.md for the retail-web consequence. |

## 4. Lint toolchain

| Item | 12.x | 13.x | Result |
|---|---|---|---|
| `tslint` 6.1.3 + `codelyzer` 6.0.2 | in use | removed | Angular 13 CLI has no `tslint` builder (`ng update` deleted the `lint` architect target); codelyzer pins `@angular/core <13`. |
| `@angular-eslint/*` | n/a | 13.5.0 (builder, eslint-plugin, eslint-plugin-template, template-parser, schematics) | Angular 13 line of angular-eslint. Separate commit. |
| `eslint` | n/a | 8.x within angular-eslint 13's peer range | exact pin recorded in the lint commit |
| `@typescript-eslint/*` | n/a | 5.x within angular-eslint 13's peer range | exact pin recorded in the lint commit |

## 5. Consumers

| Consumer | Angular | Node / npm | Lantern pin today | Can consume a 13-built partial-Ivy 3.0.0? | Notes |
|---|---|---|---|---|---|
| `northgate-retail-web` (MOL) | 14.3.0 | 16.20.2 / npm 8 | 2.4.1 | Yes, format-wise (linker >= 12 required, CLI 14 has it) | Declared peer `<14.0.0` does not match 14.3.0; retail-web's own `.npmrc` already sets `legacy-peer-deps=true` (MOL-3611), so install proceeds without any new flag. RxJS peer `<7` vs retail-web's 7.5.7 is likewise pre-existing. Verified result in `CONSUMERS.md`. |
| `northgate-business-web` (MBZ) | 12.2.17 | 14 | no current pin | Not a live consumer | Would need Angular >= 13 first. |
| Beacon ops console | named in README only | unknown | unknown | not assessed | EVIDENCE MISSING: no repository or pin found in the estate. |

## 6. Angular 13 breaking changes checked against this library

| Change (Angular 13) | Affects Lantern? | Action |
|---|---|---|
| View Engine removed for libraries | yes | `compilationMode: "partial"` (section 2). |
| IE11 support removed, differential loading gone | no | library only; no polyfills or browserslist consumer impact. |
| `TestBed` teardown `destroyAfterEach` default | no change needed | `test.ts` already passed `teardown: { destroyAfterEach: true }`; the migration made no spec edits. |
| `entryComponents` removed | no | none declared. |
| Router: `routerLink` accepts `null`/`undefined` | no | library does not use `routerLink`. |
| `@angular/forms` typed-forms | n/a | forms only used in specs indirectly (not at all in source). |
| Node 12 dropped for CLI 13 (needs >= 12.20) | no | 14.21.3. |

## 7. Not resolvable inside Angular 13 (goes to GIS exception draft, not fixed here)

`npm audit --production` (evidence `evidence/02-angular-13/npm-audit-production.log`): 17 advisories
(13 High, 4 Moderate), all in `@angular/core`, `@angular/common`, `@angular/compiler` 13.4.0, same
count as at baseline on 12.2.17. Patched versions are `>=19.2.16` or "no patch available" for the
13.x line. Skipping majors is forbidden by the run rules; recorded in
`governance/GIS_EXCEPTION_DRAFT.md`.

## 8. Decision

Proceed with Angular 13.4.0 / CLI 13.3.11 / ng-packagr 13.3.1 / TypeScript 4.6.4 on Node 14.21.3.
No blocking row. ADR: `docs/adr/0001-angular-13-partial-ivy.md`.
