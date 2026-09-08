# CAB record — ITSM section-1 fields

<!-- Generated with AI assistance (AIT-014, register entry unconfirmed) on 2026-09-08; reviewed by TBC. -->

Key/value pairs for the ITSM change form, in the order the form asks (CAB_TEMPLATE.md v4.2
section 1). The record body is `CAB_RECORD.md`. `TBC` values must be typed by the submitter; none
may be guessed.

| ITSM field | value |
|---|---|
| CHG number | assigned on save; no `E` suffix |
| Change type | Normal |
| Release train | 2026.10.2 (2026.09.x not available: 09.2 frozen 2026-09-04, 09.4 skipped for Q3 freeze) |
| Submission deadline | Mon 2026-10-05 17:00 ET (CAB Tue 2026-10-06 10:00 ET) |
| Requested implementation window | Thu 2026-10-08 20:00 to 23:00 ET |
| Requesting team | Digital Analytics Enablement (DAE) |
| Change owner (accountable) | TBC — permanent employee, M2 or above |
| Implementer | TBC |
| Business sponsor | TBC — DAE product owner |
| Application(s) | `@northgate/lantern-sdk` 3.0.0 (shared library) |
| CMDB app-id(s) | TBC — not recorded in the repository |
| Environment(s) | Artifactory `npm-northgate` (publish only; no prod-east / prod-west deploy) |
| Jira release version | none (KAN has no fix versions); Jira keys per `jira/TICKET_PLAN.md` |
| Jira epic | LNTN-401 |
| Evidence bundle | `docs/upgrade/LNTN-401/` on `feature/LNTN-401-angular-12-to-13` (no `Jenkinsfile.release` bundle exists for this repository) |
| Risk rating | Low (library publish; consumer bump is a separate Medium record) |
| AI-assisted content | Yes — AIT-014 (unconfirmed), reviewer TBC |
