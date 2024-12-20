import { execSync } from 'child_process';

const config = {
  preset: 'conventionalcommits',
  releaseCount: 0,
  outputUnreleased: true,
  skipUnstable: false
};

execSync(
  `conventional-changelog -p ${config.preset} -i CHANGELOG.md -s -r ${config.releaseCount}`,
  { stdio: 'inherit' }
);