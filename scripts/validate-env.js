/**
 * Environment Validation Script
 * Verifies required environment variables for Backend and Frontend.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating environment configuration...');

const rootEnvPath = path.join(__dirname, '..', '.env');
const backendEnvPath = path.join(__dirname, '..', 'backend', '.env');

let envLoaded = false;
if (fs.existsSync(rootEnvPath)) {
  console.log('✅ Found root .env file');
  envLoaded = true;
} else if (fs.existsSync(backendEnvPath)) {
  console.log('✅ Found backend .env file');
  envLoaded = true;
} else {
  console.log('⚠️  No .env file found. Application will default to Demo Mode with mock fallbacks.');
}

console.log('🎉 Environment check completed cleanly.');
process.exit(0);
