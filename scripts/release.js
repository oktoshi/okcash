#!/usr/bin/env node
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import semver from 'semver';

const TYPES = {
  major: 'major',
  minor: 'minor',
  patch: 'patch'
};

function getCurrentVersion() {
  const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
  return pkg.version;
}

function updateVersion(type) {
  const currentVersion = getCurrentVersion();
  const newVersion = semver.inc(currentVersion, type);
  
  // Update package.json
  const pkgPath = resolve('./package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  pkg.version = newVersion;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  
  return newVersion;
}

function generateChangelog() {
  execSync(`npm run changelog -- --release-count 1`, { stdio: 'inherit' });
}

function createGitTag(version) {
  execSync(`git add .`);
  execSync(`git commit -m "chore(release): v${version}"`);
  execSync(`git tag -a v${version} -m "Release v${version}"`);
}

function buildProject() {
  execSync('npm run build', { stdio: 'inherit' });
}

// @ts-expect-error - Node.js globals
// eslint-disable-next-line no-undef
const args = process.argv.slice(2);
const type = args[0];

if (!TYPES[type]) {
  console.error(`Invalid release type. Use: ${Object.keys(TYPES).join(', ')}`);
  // @ts-expect-error - Node.js globals
  // eslint-disable-next-line no-undef
  process.exit(1);
}

try {
  buildProject();
  const newVersion = updateVersion(type);
  generateChangelog();
  createGitTag(newVersion);
  
  console.log('\nRelease completed successfully!');
  console.log(`\nVersion: v${newVersion}`);
  console.log('\nNext steps:');
  console.log('1. Push changes: git push origin main');
  console.log(`2. Push tag: git push origin v${newVersion}`);
  console.log('3. Create GitHub release with the generated changelog');
  
} catch (error) {
  console.error('Release failed:', error);
  // @ts-expect-error - Node.js globals
  // eslint-disable-next-line no-undef
  process.exit(1);
}