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

// Use global process from Node.js environment
/* global process */
function main() {
  const type = process.argv[2];
  
  if (!TYPES[type]) {
    throw new Error(`Invalid release type. Use: ${Object.keys(TYPES).join(', ')}`);
  }
  
  try {
    buildProject();
    const newVersion = updateVersion(type);
    generateChangelog();
    createGitTag(newVersion);
    
    // Use logger instead of console
    const logger = {
      info: (msg) => process.stdout.write(`${msg}\n`)
    };
    
    logger.info('\nRelease completed successfully!');
    logger.info(`\nVersion: v${newVersion}`);
    logger.info('\nNext steps:');
    logger.info('1. Push changes: git push origin main');
    logger.info(`2. Push tag: git push origin v${newVersion}`);
    logger.info('3. Create GitHub release with the generated changelog');
    
  } catch (error) {
    process.stderr.write(`Release failed: ${error}\n`);
    throw error;
  }
}

main();