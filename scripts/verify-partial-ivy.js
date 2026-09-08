#!/usr/bin/env node
/*
 * Post-build gate, LNTN-401 (replaces verify-view-engine.js, LNTN-412). Confirms dist/lantern-sdk
 * is in the format the consuming teams expect from an Angular 13 library: Ivy partial compilation
 * (Angular Package Format v13) that the consumer's linker processes at build time, no View Engine
 * metadata, no fully compiled Ivy output, and the public API surface intact.
 *
 * Runs against dist/ by default; pass a tarball path to inspect a packed .tgz instead (that is what
 * the release checklist does before `npm publish`).
 *
 * Exit 0 = good, 1 = wrong format, 2 = could not find the build.
 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const PACKAGE_NAME = '@northgate/lantern-sdk';
const PEER_MAJOR = 13;
const PARTIAL_MARKER = '\u0275\u0275ngDeclare';
const FULL_IVY_MARKERS = [
  '\u0275\u0275defineComponent',
  '\u0275\u0275defineDirective',
  '\u0275\u0275defineNgModule',
  '\u0275\u0275defineInjector',
  '\u0275\u0275defineInjectable',
  '\u0275\u0275definePipe'
];
const PUBLIC_API = [
  'LANTERN_CONFIG',
  'LanternModule',
  'LanternRouterTracker',
  'LanternService',
  'LanternSessionInterceptor',
  'LanternTrackDirective',
  'maskPath'
];
const DECLARATIONS = {
  'lib/lantern.module.d.ts': ['\u0275\u0275NgModuleDeclaration', '\u0275\u0275InjectorDeclaration'],
  'lib/lantern.service.d.ts': ['\u0275\u0275InjectableDeclaration'],
  'lib/lantern-router.service.d.ts': ['\u0275\u0275InjectableDeclaration'],
  'lib/lantern-session.interceptor.d.ts': ['\u0275\u0275InjectableDeclaration'],
  'lib/lantern-track.directive.d.ts': ['\u0275\u0275DirectiveDeclaration']
};

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(p, out);
    } else {
      out.push(p);
    }
  }
  return out;
}

function unpack(tgz) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lantern-verify-'));
  execFileSync('tar', ['-xzf', tgz, '-C', tmp]);
  return path.join(tmp, 'package');
}

function peerLowerMajor(range) {
  const m = /^>=\s*(\d+)\./.exec(range || '');
  return m ? Number(m[1]) : NaN;
}

function main() {
  const arg = process.argv[2];
  let root = path.resolve(__dirname, '..', 'dist', 'lantern-sdk');
  if (arg) {
    root = arg.endsWith('.tgz') ? unpack(path.resolve(arg)) : path.resolve(arg);
  }
  if (!fs.existsSync(path.join(root, 'package.json'))) {
    console.error(`verify-partial-ivy: no package at ${root}; run npm run build first`);
    process.exit(2);
  }

  const files = walk(root, []);
  const problems = [];

  const metadata = files.filter((f) => f.endsWith('.metadata.json'));
  for (const m of metadata) {
    problems.push(`${path.relative(root, m)} is View Engine metadata; check compilationMode in tsconfig.lib.prod.json`);
  }

  const js = files.filter((f) => f.endsWith('.js') || f.endsWith('.mjs'));
  const declared = new Set();
  const versions = new Set();
  for (const f of js) {
    const src = fs.readFileSync(f, 'utf8');
    for (const marker of FULL_IVY_MARKERS) {
      if (src.includes(marker)) {
        problems.push(`${path.relative(root, f)} contains full Ivy marker ${marker}; the build is not partial`);
        break;
      }
    }
    for (const m of src.matchAll(/\u0275\u0275ngDeclare(\w+)\(\{\s*minVersion:\s*"([\d.]+)",\s*version:\s*"([\d.]+)"/g)) {
      declared.add(m[1]);
      versions.add(m[3]);
    }
  }
  if (declared.size === 0) {
    problems.push(`no ${PARTIAL_MARKER}* declarations emitted; this is not an Ivy partial build`);
  }
  for (const want of ['NgModule', 'Injectable', 'Directive', 'Factory']) {
    if (!declared.has(want)) {
      problems.push(`no ${PARTIAL_MARKER}${want} declaration found`);
    }
  }
  for (const v of versions) {
    if (!v.startsWith(`${PEER_MAJOR}.`)) {
      problems.push(`partial declarations were emitted by Angular ${v}, expected ${PEER_MAJOR}.x`);
    }
  }

  for (const [rel, markers] of Object.entries(DECLARATIONS)) {
    const f = path.join(root, rel);
    if (!fs.existsSync(f)) {
      problems.push(`${rel} missing from the package`);
      continue;
    }
    const src = fs.readFileSync(f, 'utf8');
    for (const marker of markers) {
      if (!src.includes(marker)) {
        problems.push(`${rel} lacks Ivy type declaration ${marker}`);
      }
    }
  }

  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  if (pkg.name !== PACKAGE_NAME) {
    problems.push(`unexpected package name ${pkg.name}`);
  }
  if (pkg.metadata) {
    problems.push('package.json still has a View Engine "metadata" entry point');
  }
  for (const field of ['module', 'typings', 'fesm2015']) {
    if (!pkg[field]) {
      problems.push(`package.json has no "${field}" entry (Angular Package Format v13)`);
    }
  }
  if (!pkg.exports || !pkg.exports['.']) {
    problems.push('package.json has no "exports" map (Angular Package Format v13)');
  }
  const peers = pkg.peerDependencies || {};
  for (const peer of ['@angular/core', '@angular/common', '@angular/router']) {
    if (peerLowerMajor(peers[peer]) !== PEER_MAJOR) {
      problems.push(`peerDependencies.${peer} is "${peers[peer]}", expected a range starting at ${PEER_MAJOR}`);
    }
  }

  const entry = path.join(root, pkg.module || '');
  const exported = new Set();
  if (fs.existsSync(entry)) {
    const src = fs.readFileSync(entry, 'utf8');
    for (const m of src.matchAll(/^export \{([^}]*)\}/gm)) {
      m[1].split(',').map((s) => s.trim().split(/\s+as\s+/).pop()).filter(Boolean).forEach((s) => exported.add(s));
    }
  }
  for (const symbol of PUBLIC_API) {
    if (!exported.has(symbol)) {
      problems.push(`public API symbol ${symbol} is not exported from ${pkg.module}`);
    }
  }

  const dts = files.filter((f) => f.endsWith('.d.ts'));
  console.log(`verify-partial-ivy: ${pkg.name}@${pkg.version} at ${root}`);
  console.log(`  metadata files : ${metadata.length}`);
  console.log(`  js/mjs files   : ${js.length}`);
  console.log(`  d.ts files     : ${dts.length}`);
  console.log(`  declarations   : ${[...declared].sort().join(', ')} (compiler ${[...versions].join(', ')})`);
  console.log(`  peer @angular  : ${peers['@angular/core']}`);
  console.log(`  public API     : ${PUBLIC_API.length} symbols exported`);
  if (problems.length) {
    console.error('  FAIL');
    for (const p of problems) {
      console.error('   - ' + p);
    }
    process.exit(1);
  }
  console.log('  OK: Ivy partial compilation (APF v13), no View Engine output');
}

main();
