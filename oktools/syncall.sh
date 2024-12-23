#!/bin/bash

# syncall.sh
# Master script to synchronize OKai and OKai-S Ai frameworks with OKcash.

# Execute okaisync.sh and exit if it fails
./okaisync.sh
if [ $? -ne 0 ]; then
  echo "okaisync.sh failed. Exiting."
  exit 1
fi

# Execute okaissync.sh and exit if it fails
./okaissync.sh
if [ $? -ne 0 ]; then
  echo "okaissync.sh failed. Exiting."
  exit 1
fi

echo "Synchronizations completed successfully."
