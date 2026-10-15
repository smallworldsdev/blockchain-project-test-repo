# Demo runbook

End-to-end walkthrough of the CI-gated bounty flow on this repository. Steps 1–4
set the stage; steps 5–9 are the part the main project automates.

## Prerequisites

- Node.js 20+ (for the local test run).
- Docker (optional, only if you want to reproduce the network-isolated test job
  locally).
- A funded bounty on this repo, created through the main project's
  `BountyEscrow` contract (`makeBounty("smallworldsdev/blockchain-project-test-repo", <issue>)`).
- For the relayer path: the main project's `oracle/relayer.js` running with a
  GitHub token.

## 1. Confirm the seed is red

On `main` the protected suite fails on purpose — the bug is what the bounty pays
for.

```bash
npm test
# ok: the slugify tests fail; truncate/capitalize tests pass
```

## 2. Create the bounty issue

Either run:

```bash
scripts/open-bounty-issue.sh
```

or open a new issue in the GitHub UI and paste `docs/bounty-issue-01.md`. Note the
issue number you get (the runbook assumes **#1**).

## 3. Fund the bounty on-chain

Call `makeBounty("smallworldsdev/blockchain-project-test-repo", 1)` with ETH from
the repository owner's wallet. The escrow now holds the funds.

## 4. (This repo) nothing to change

The tests for issue #1 already live in `tests/textkit.test.js`. This is
deliberate: the "done" definition is fixed before anyone can submit work.

## 5. As the developer: fork and fix

```bash
git clone https://github.com/<you>/blockchain-project-test-repo.git
cd blockchain-project-test-repo
git checkout -b fix/slugify

# Apply the reference fix (or write your own equivalent):
git apply docs/reference-fix.patch

npm test   # now fully green
```

## 6. Open the pull request

Push the branch and open a PR against `main` whose body contains:

```text
Closes #1
Wallet: 0x<the address you will call makeSubmission() from>
```

Do not touch `tests/` or `.github/`.

## 7. Watch CI

The `bounty-verification` workflow runs four jobs:

| Job | What it proves |
|---|---|
| `protect-tests` | The PR did not change `tests/` or `.github/`. |
| `gitleaks` | No secrets were introduced. |
| `trivy` | No HIGH/CRITICAL vulnerabilities were introduced. |
| `tests` | The protected suite passes, with networking disabled. |

All four must be green. Fork PRs need a maintainer to approve the first run.

## 8. Submit on-chain

From the wallet named in the PR body:

```js
await escrow.makeSubmission(bountyId, prNumber);
```

## 9. Verify and pay out

- **Relayer path:** `oracle/relayer.js` fetches the PR metadata and check-runs,
  runs the same checks as the DON, and calls `verifySubmission(submissionId, true)`.
- **Chainlink path:** the DON returns the 6-bit check mask to `fulfillRequest`.

When every check passes, the contract pays the escrowed ETH straight to the
developer's wallet.

## Negative demos (nice for a live presentation)

1. **Test tampering** — change a value in `tests/textkit.test.js` in a throwaway
   PR. The `protect-tests` job fails, and the oracle's `0x20` check rejects the
   submission even if CI were green.
2. **Secret leak** — commit a file containing a fake, pattern-matching
   credential (for example a placeholder GitHub personal access token). The
   `gitleaks` job fails. Construct the value by hand when you run this demo; do
   not commit a real-looking literal to the repository, or `gitleaks` will
   (correctly) fail on the base branch itself.
3. **Vulnerable dependency** — add a dependency pinned to a version with a known
   HIGH/CRITICAL CVE. The `trivy` job fails.
