#!/bin/bash

set -e

cd ..
git remote add okai-s https://github.com/okcashpro/okai-s.git 2>/dev/null || echo "Remote 'okai-s' already exists."

git fetch okai-s main

git subtree pull --prefix=okai-s okai-s main -m oksyncais

git push origin master

echo "Sync from okai-s to ok completed successfully."
