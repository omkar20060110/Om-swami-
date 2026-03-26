#!/usr/bin/env bash
# exit on error
set -o errexit

# 1. Build Frontend
echo "Building React Frontend..."
cd frontend
npm install
npm run build
cd ..

# 2. Setup Backend
echo "Installing Python Dependencies..."
cd backend
pip install -r requirements.txt
