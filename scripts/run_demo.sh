#!/usr/bin/env bash
# Simple helper to run the demo. Make sure node and llama binary are available.
set -e
echo "Installing npm deps..."
npm install
echo "Starting server..."
npm start
