# Consumers of `@northgate/lantern-sdk` and the 3.0.0 (Angular 13, partial Ivy) verification

<!-- Generated with AI assistance (AIT-014, register entry unconfirmed) on 2026-09-08; reviewed by TBC. -->

## Consumer inventory

| consumer | repo | Angular | Node | current pin | live? | 3.0.0 result |
|---|---|---|---|---|---|---|
| retail-web (Northgate Online) | `northgate-retail-web` | 14.3.0 | 16.20.2 | `2.4.1` | yes, the only pinned consumer in the estate (cswt-workspace README, CNPY-2140 pin table) | **supported**: `build:prod` and `test:ci` green on 3.0.0, see below |
| business-web | `northgate-business-web` | 14.3.0 | 16.20.2 | none | named in this README, not pinned in its `package.json` | not applicable, no pin |
| Beacon ops console | not in the estate repositories | ? | ? | ? | named in this README only | not verifiable from this estate: EVIDENCE MISSING |

Angular 12 consumers: none in the estate. Per GIS-STD-022 section 3 the 2.4.1 line stays published
for 90 days after 3.0.0 is released; no fix is planned on 2.x.

## retail-web on 3.0.0

Method: read-only. Fresh `git clone` of the local `northgate-retail-web` checkout (develop,
`cdde0d2`) into a scratch directory outside both repositories; Node 16.20.2 / npm 8.19.4 from
retail-web's `.nvmrc`; retail-web's own `.npmrc` (`@northgate:registry=http://localhost:4873`,
`legacy-peer-deps=true` per MOL-3611, not passed on the command line). `@northgate/lantern-sdk@3.0.0`
was published to the estate Verdaccio by `npm run publish:local` from this repository
(`evidence/05-publish-verdaccio/publish-local.log`). The canonical retail-web checkout and its
`package.json` pin were not modified; `git status` on it is clean. Nothing was committed or pushed to
retail-web. Script and logs: `evidence/06-consumer-retail-web/`.

One deviation from a pure `npm ci`: the retail-web lockfile pins the integrity hash of the
`@northgate/*` tarballs as published to the bank Artifactory, and a locally republished tarball does
not hash identically (PLAT-2718; canopy-ui's `scripts/publish-local-versions.sh` carries the same
workaround). In the scratch clone only, the three `@northgate/*` lock entries were re-resolved at
their **pinned** versions (`npm install --package-lock-only @northgate/canopy-ui@3.7.2
@northgate/domain-fixtures@1.6.0 @northgate/lantern-sdk@2.4.1`) before `npm ci`. The resulting
`package.json` diff is key reordering only, no version changes
(`a-refresh-northgate-lock-entries.log`). Without this step `npm ci` fails with `EINTEGRITY` on
`lantern-sdk@2.4.1` and `canopy-ui@3.7.2` regardless of this change.

| step | phase A: pin `2.4.1` (baseline) | phase B: `3.0.0` in the scratch clone | log |
|---|---|---|---|
| install | `npm ci` exit 0 | `npm install @northgate/lantern-sdk@3.0.0` exit 0 (`removed 1 package, changed 1 package`) | `a-npm-ci.log`, `b-npm-install.log` |
| `npm ls @northgate/lantern-sdk @angular/core` | exit 1: `@angular/core@14.3.0 invalid: ">=12.0.0 <13.0.0" from @northgate/lantern-sdk` | exit 1: `@angular/core@14.3.0 invalid: ">=13.0.0 <14.0.0" from @northgate/lantern-sdk` | `a-npm-ls-lantern.log`, `b-npm-ls-lantern.log` |
| installed package | 2.4.1 View Engine, `*.metadata.json`, processed by the `postinstall` `ngcc` | 3.0.0, `fesm2020/fesm2015/esm2020` `.mjs`, no `*.metadata.json`, 16 `ɵɵngDeclare*` calls in the FESM2020 bundle, peers `>=13.0.0 <14.0.0` | `b-lantern-manifest.log`, `b-lantern-no-metadata.log` |
| `npm run build:prod` (`ng build --configuration production`) | exit 0; initial bundle 2.05 MB, budget warning 54.00 kB over the 2.00 MB `maximumWarning` | exit 0; initial bundle 2.05 MB, budget warning 53.81 kB over (0.19 kB smaller than baseline); no other warnings, no errors | `a-build-prod.log`, `b-build-prod.log` |
| `npm run test:ci` (Karma, ChromeHeadlessCI, coverage) | `Executed 196 of 198 (skipped 2) SUCCESS` | `Executed 196 of 198 (skipped 2) SUCCESS` | `a-test-ci.log`, `b-test-ci.log` |
| pin change in retail-web | none | scratch working tree only, not committed; diff kept as `b-pin-diff.patch` | `b-git-diff.log` |

The two skipped specs and the initial-bundle budget warning are pre-existing in retail-web (identical
in phase A) and are not caused by this package.

### Verdict

**Supported.** The Angular 13 partial-Ivy build of `@northgate/lantern-sdk` 3.0.0 links and runs in
retail-web on Angular 14.3.0: the consumer's Angular 14 compiler linked the `ɵɵngDeclare*` partial
declarations at build time, `LanternModule.forRoot`, the router tracker, the interceptor and the
`lanternTrack` directive compiled into the production bundle, and the retail-web spec suite that
exercises them passed with no change to retail-web source or specs.

Caveats to carry into retail-web's own pin bump (MOL, `[MOL]` verify task in
`jira/TICKET_PLAN.md`):

1. **Peer range.** 3.0.0 declares `@angular/{core,common,router} >=13.0.0 <14.0.0`. On Angular
   14.3.0 npm reports the peer as `invalid`, exactly as it does today for 2.4.1's `>=12 <13`.
   Installation succeeds only because retail-web already runs with `legacy-peer-deps=true`
   (`.npmrc`, MOL-3611). The peer moves to `>=14 <15` at the next Lantern hop (13 -> 14, 4.0.0).
2. **RxJS.** 3.0.0 keeps the `rxjs >=6.5.0 <7.0.0` peer; retail-web is on RxJS 7.5.7. Same
   `legacy-peer-deps` condition as today; the package only uses `Observable`, `Subscription` and the
   `filter` operator, which behave the same on RxJS 7, and the retail-web specs cover the router
   tracker and interceptor paths.
3. **`ngcc`.** retail-web's `postinstall` `ngcc` no longer processes this package (no View Engine
   metadata to convert). The `postinstall` stays for other packages; nothing to change for Lantern.
4. **Bundle size.** No material change (−0.19 kB initial). retail-web's budget warning predates this.
5. **`npm audit`.** retail-web's own audit (62 advisories at baseline in the scratch clone) is
   unchanged by this package; the `@angular/*` 13.4.0 advisories in this repository are peers and
   do not enter retail-web's tree (`governance/GIS_EXCEPTION_DRAFT.md`).

Not verified here (EVIDENCE MISSING, for retail-web's own CAB): retail-web `smoke.sh` /
`verify-estate.sh retail-web` against the running estate, and a browser check that the hosted
vendor script still loads with the `data-lantern-sdk="3.0.0"` attribute. Those need the estate up
(`mock-external/scripts/estate-up.sh`) and belong to the `[MOL]` verify task.
