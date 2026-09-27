/**
 * Identifies the currently deployed code. Every login token carries this value,
 * so deploying a new commit logs everyone out (old tokens/cookies are rejected).
 *
 * Order: DEPLOY_VERSION env var → current git commit → server start time (fallback).
 */
const { execSync } = require('child_process');
const logger = require('./logger');

let version = process.env.DEPLOY_VERSION;

if (!version) {
  try {
    version = execSync('git rev-parse --short HEAD', { cwd: __dirname, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    // Not a git checkout — fall back below
  }
}

if (!version) {
  version = `start-${Date.now()}`;
  logger.warn('Deploy version: git not available, using server start time (sessions reset on every restart)');
}

module.exports = version;
