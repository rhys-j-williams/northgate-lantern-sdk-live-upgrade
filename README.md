# @northgate/lantern-sdk

Angular wrapper for the Lumenview Lantern web analytics script. Owned by **Digital Analytics
Enablement (DAE)**, Charlotte. Slack `#dae-lantern`, Jira `LNTN`. On-call is business hours only;
analytics is not a P1 service and nobody should be paged for it (see the SLO exemption in
`RISK-2019-118`).

Current release: **2.4.1** (H1 2024 train, Angular 12 / View Engine). In progress: **3.0.0**
(`LNTN-401`, Angular 13 / Ivy partial compilation, target train 2026.10.2, CAB TBC). Next hop after
that: Angular 13 -> 14 (`LNTN-401` epic), ahead of the estate's 14 -> 15 wave.

## What it does

- `LanternModule.forRoot(config)` loads the vendor script and wires everything below
- `LanternService` with `track`, `page`, `identify`, `reset`, `sessionId`
- page events on every router `NavigationEnd`, with ids and query strings masked
- `lanternTrack` attribute directive for click tracking
- `LanternSessionInterceptor` puts `X-Analytics-Session` on outbound `HttpClient` calls so BFF logs
  in Splunk can be joined to the vendor's session view

Consumers: retail-web (Northgate Online), business-web (Northgate Business), Beacon ops console
(read-only mode, `LNTN-302`). Iris does not use it; the Iris widget has its own vendor tagging.

## Installing

```
npm install @northgate/lantern-sdk@3.0.0 --save-exact
```

From Artifactory `npm-northgate`. Peer range is Angular `>=13.0.0 <14.0.0` for 3.0.0 (2.4.1 was
`>=12 <13`). If npm complains about peers on your application's Angular, put
`legacy-peer-deps=true` in the application's `.npmrc`; retail-web and business-web already have it.
An Angular 14 application can consume 3.0.0 (the partial-Ivy output is linked by its own CLI, see
`docs/upgrade/LNTN-401/CONSUMERS.md`); an Angular 12 application cannot, stay on 2.4.1 there.

```ts
// app.module.ts
import { LanternModule } from '@northgate/lantern-sdk';

@NgModule({
  imports: [
    HttpClientModule,
    RouterModule.forRoot(routes),
    LanternModule.forRoot({
      writeKey: environment.lantern.writeKey,
      appName: 'retail-web',
      appVersion: environment.version,
      sessionHeaderUrlPrefixes: ['/api/', environment.bffBaseUrl],
      disabled: environment.name === 'qa'
    })
  ]
})
export class AppModule {}
```

`forRoot()` once, in `AppModule`. A second `forRoot()` in a lazy module throws on purpose
(`LNTN-219`; two vendor instances double counted business-web page views for a quarter).

Write keys are per application per environment and are not secrets; they live in `environment.ts`.
Do not point UAT at the prod write key, it pollutes the dashboards and Finance notice (`LNTN-388`).

### Config

| key | default | notes |
| --- | --- | --- |
| `writeKey` | required | Lumenview project write key |
| `scriptUrl` | Northgate hosted copy, see below | override only in the analytics sandbox |
| `collectorUrl` | script default | the local estate points this at `lantern-collector-mock` on 4607 |
| `trackRouterEvents` | `true` | |
| `attachSessionHeader` | `true` | |
| `sessionHeaderUrlPrefixes` | `[]` | empty means every request. Set it. GIS-1471 finding 6. |
| `sessionHeaderName` | `X-Analytics-Session` | changing it needs a Splunk field extraction change (`PLAT-1660`) |
| `disabled` | `false` | everything becomes a no-op; e2e suites use this |
| `debug` | `false` | console.debug every call |
| `appName`, `appVersion` | none | sent as context on every event |

### The vendor script

`lantern.min.js` is **not** loaded from the vendor CDN. The egress proxy blocks it everywhere but
the analytics sandbox, and Third Party Risk wanted a copy we control after the 2021 supply chain
review (`GIS-1188`). The default `scriptUrl` is the Northgate hosted copy at
`static.northgatetrust.example/vendor/lantern/4/`. DAE refreshes it when the vendor cuts a release we
have tested; the current copy is Web SDK 4.11. The refresh procedure is in the DAE runbook, and
involves the CAB because it is technically a prod change to a static bucket.

The SDK installs the vendor's queue stub before the script arrives, so a `page` fired on the first
`NavigationEnd` is not lost if the network is slow. Same behaviour as the vendor snippet.

For the local estate, `mock-external/lantern-collector-mock` serves a stand-in `lantern.min.js`
on port 4607 and stores whatever you send it; `estate-up.sh` publishes this package to the local
Verdaccio so the apps resolve it the same way they would from Artifactory.

## Privacy rules baked in

Most of this came out of `GIS-1471` (Q3 2022 privacy review of analytics traffic). Do not undo
them in application code.

- page paths are masked: query string and fragment dropped, segments that look like a customer,
  account, card, payment, transaction or statement id become `:id`. Numeric segments of six or
  more digits too. Use `data: { lanternPage: 'account-detail' }` on a route if you want a name
  instead of a path.
- `identify()` takes the opaque `CUS-` id. Never the login name, never the email address.
- the click directive sends the element's text with digits replaced by `#` and capped at 40
  characters. A masked card number on a button label was finding 5.
- the session header goes to the URL prefixes you list and nowhere else.

## Build and release

Node **14.21.3** (`.nvmrc`), Angular **13.4.0**, Angular CLI 13.3.11, ng-packagr **13.3.1**,
TypeScript 4.6.4, angular-eslint 13.5.0.

```
nvm use
npm ci
npm run lint        # ng lint (angular-eslint)
npm test            # Karma, ChromeHeadless; CHROME_BIN if Chrome is somewhere odd
npm run build       # ng-packagr, production config
npm run verify:format
npm run publish:local   # build, verify, pack, publish to the registry in .npmrc
```

### Build format

From 3.0.0 the library is built with **Angular 13 and Ivy partial compilation**
(`compilationMode: "partial"` in `tsconfig.lib.prod.json`, Angular Package Format v13: `.mjs`
FESM2020/FESM2015 bundles, an `exports` map, no UMD, no `*.metadata.json`). The consuming
application's own Angular compiler links the `ɵɵngDeclare*` declarations at build time, so `ngcc`
is no longer needed for this package (retail-web's `postinstall` ngcc run is harmless and stays for
its other dependencies). `npm run verify:format` (`scripts/verify-partial-ivy.js`) is the release
gate and fails the publish if the output is View Engine, fully compiled Ivy, built by a compiler
outside 13.x, or missing any of the seven public API symbols. Decision record:
`docs/adr/0001-angular-13-partial-ivy.md`; the View Engine deferral (`LNTN-361`, vendor script type
contract and Third Party Risk assessment) is recorded there as an open item for the architecture
review, not as resolved.

2.4.1 and earlier were Angular 12 / View Engine (`enableIvy: false`, `verify:view-engine`) and
remain published for Angular 12 consumers.

`@types/node` is pinned to 16.18.11. It was originally held there because newer `@types/node`
declare `Disposable`, which TS 4.3 could not parse; TS 4.6 can, but the pin stays exact per
TECH-STD-044 until a ticket moves it. Do not let Renovate move it (there is a rule, check
`renovate.json` in platform-tooling if it starts bumping again).

### Release cadence

Twice a year with the H1 and H2 trains. Patch releases as needed for defects, published from the
`lantern-sdk-release` Jenkins job (or a laptop for a patch, with a CAB standard change). Tag as
`lantern-sdk-vX.Y.Z`. Consumers pin exact versions; DAE raises the bump PRs in the app repos
during the release window, app teams merge them. History in `CHANGELOG.md`.

## Known issues

- `LNTN-441` the interceptor adds the header to `HttpClient` calls only. Anything going through
  `fetch` or the old `$http` shim in business-web is not tagged.
- `LNTN-377` the queue stub caps at whatever the vendor script does on drain; we have seen the
  first `identify` dropped on very slow 3G profiles. Not reproducible in Chrome devtools throttling.
- SSR: the service is a no-op outside the browser platform. Nobody renders server side today; it
  is there because business-web tried it once (`MBZ-2077`, reverted).
- The Beacon console loads the module with `disabled: true` and still gets the directive so that
  the templates compile. Fine, just odd to read.

## History

Started 2020 as an inline snippet in retail-web, extracted to a library in early 2021 after
business-web copied the snippet and diverged (`LNTN-101`). 1.x was the un-scoped `lantern-angular`
package; 2.0 (Nov 2021) renamed it to `@northgate/lantern-sdk` and moved to Angular 12. 2.2 added the
router masking after GIS-1471. 2.4 is the current published line. 3.0 (`LNTN-401`, in progress) moves
to Angular 13 and Ivy partial compilation; the upgrade evidence is under `docs/upgrade/LNTN-401/`.
