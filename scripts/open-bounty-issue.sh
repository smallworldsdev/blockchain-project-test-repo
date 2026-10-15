#!/usr/bin/env bash
#
# Create the bounty issue for this demo repo from docs/bounty-issue-01.md.
#
# Usage:
#   scripts/open-bounty-issue.sh [owner/repo]
#
# Requires the GitHub CLI (https://cli.github.com/) authenticated with access to
# the repository. If you would rather not use the CLI, open a new issue in the
# GitHub UI and paste the body from docs/bounty-issue-01.md.

set -euo pipefail

REPO="${1:-smallworldsdev/blockchain-project-test-repo}"
TITLE="slugify() leaves punctuation and surrounding separators in slugs"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BODY_FILE="${REPO_ROOT}/docs/bounty-issue-01.md"

if ! command -v gh >/dev/null 2>&1; then
  echo "error: the GitHub CLI (gh) is required. Install it from https://cli.github.com/" >&2
  exit 1
fi

if [[ ! -f "$BODY_FILE" ]]; then
  echo "error: issue body not found at ${BODY_FILE}" >&2
  exit 1
fi

gh issue create \
  --repo "$REPO" \
  --title "$TITLE" \
  --body-file "$BODY_FILE"
