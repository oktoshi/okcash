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

function main() {
  // @ts-expect-error - Node.js process
  const type = process.argv[2];
  
  if (!TYPES[type]) {
    throw new Error(`Invalid release type. Use: ${Object.keys(TYPES).join(', ')}`);
  }
  
  try {
    buildProject();
    const newVersion = updateVersion(type);
    generateChangelog();
    createGitTag(newVersion);
    
    // Use stdout/stderr directly
    const messages = [
      '\nRelease completed successfully!',
      `\nVersion: v${newVersion}`,
      '\nNext steps:',
      '1. Push changes: git push origin main',
      `2. Push tag: git push origin v${newVersion}`,
      '3. Create GitHub release with the generated changelog'
    ];
    
    // @ts-expect-error - Node.js process
    messages.forEach(msg => process.stdout.write(`${msg}\n`));
    
  } catch (error) {
    // @ts-expect-error - Node.js process
    process.stderr.write(`Release failed: ${error}\n`);
    throw error;
  }
}

main();