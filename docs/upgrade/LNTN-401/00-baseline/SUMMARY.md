<!-- Generated with AI assistance (AIT-014, register entry unconfirmed) on 2026-09-08; reviewed by TBC. -->
# LNTN-401 baseline: `@northgate/lantern-sdk` 2.4.1 on Angular 12.2.17

Taken on branch `feature/LNTN-401-angular-12-to-13` at the `develop` head, before any file was changed.
Every command below was run from the repository root with the toolchain in `.nvmrc`.

| Item | Value | Evidence |
|---|---|---|
| Node / npm | v14.21.3 / 6.14.18 | `node-npm-version.txt` |
| `npm ci` | 1358 packages, exit 0, no peer warnings | `npm-ci.log` |
| `npm run lint` (TSLint 6.1.3 + codelyzer 6.0.2) | exit 0, no findings | `lint.log` |
| `npm test` (Karma, ChromeHeadlessCI) | 18 of 18 specs SUCCESS, 0 skipped, no `xit`/`fit` | `test.log` |
| Coverage (`ng test --code-coverage`) | Statements 93.86 %, Branches 79.57 %, Functions 97.56 %, Lines 93.42 % | `test-coverage.log` |
| `npm run build` (production, ng-packagr 12.2.7) | exit 0, **View Engine** (`enableIvy: false`), 0 warnings | `build.log` |
| `npm run verify:view-engine` | OK: View Engine format, 1 metadata file, 11 js, 9 d.ts | `verify-view-engine.log` |
| `DRY_RUN=1 npm run publish:local` | exit 0, tarball `northgate-lantern-sdk-2.4.1.tgz` | `publish-dry-run.log` |
| `npm audit --production` | **17 advisories (13 high, 4 moderate), all in `@angular/{core,common,compiler}` 12.2.17** | `npm-audit-production.log`, `npm-audit-production-summary.tsv` |
| `npm ls @angular/core` | 12.2.17 (plus a nested 9.0.0 pulled in by `codelyzer` dev dependency) | `npm-ls-angular-core.log` |
| `npm outdated` | recorded for the matrix | `npm-outdated.log` |

## Notes for the hop

- The gate the run instructions call `npm run verify:format` exists in this repository as
  `verify:view-engine`. The framework commit replaces the View Engine verifier with a partial-Ivy
  verifier exposed as `verify:format` (see `../COMPATIBILITY_MATRIX.md`).
- Coverage gate: this repository has no `Jenkinsfile` (EVIDENCE MISSING: pipeline coverage threshold);
  the estate default of 30 % applies. Baseline is 93.86 % statements, which the hop must not fall below.
- All 17 `npm audit --production` advisories are against Angular itself and the vendor patched
  versions are `>=19.2.16` (XSRF leak) or none below 19.x. Nothing in Angular 13 closes them, so
  they are carried as a GIS exception request draft (`../governance/GIS_EXCEPTION_DRAFT.md`), not
  fixed by skipping majors.
- `*.log` is ignored by the repository `.gitignore`; the hop adds a negation for
  `docs/upgrade/**/*.log` so the evidence can be committed.
