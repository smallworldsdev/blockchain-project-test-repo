# textkit

A tiny, dependency-free text utility library — and the **demo target repository**
for a CI-gated, trustless open-source bounty payout system.

An external contributor fixes a bug described in a GitHub issue, opens a pull
request that includes their wallet address, and — once an automated
security pipeline goes green — an on-chain escrow pays them in ETH seconds after
verification. No manual approval, no centralized intermediary.

> The escrow contract, oracle and frontend live in the main project. This
> repository only plays the role of the **target repo**: the code that gets
> fixed and the CI pipeline that verifies it.

## The library

`src/textkit.js` exports three small helpers:

| Function | Purpose |
|---|---|
| `slugify(text)` | Turn arbitrary text into a URL-friendly slug. |
| `truncate(text, maxLength, suffix?)` | Shorten text to a maximum length. |
| `capitalize(text)` | Upper-case the first character. |

```js
import { slugify } from './src/textkit.js';

slugify('Hello, World!'); // 'hello-world'
```

## The open bounty

`slugify()` does not yet meet its spec: it only replaces whitespace, so
punctuation and surrounding separators leak into the output. The failing tests
that define "done" are committed in `tests/textkit.test.js`. See
[`docs/bounty-issue-01.md`](docs/bounty-issue-01.md) for the full issue.

```bash
npm test              # the slugify tests fail on main — that is the bug to fix
git apply docs/reference-fix.patch   # reference solution, for a repeatable demo
```

## Verification pipeline

Every pull request runs `.github/workflows/bounty-verification.yml`, which
produces four check-runs. A payout is only authorised when **all four** succeed:

| Job | Tool | Purpose |
|---|---|---|
| `protect-tests` | git | Fail if the PR changes `tests/` or `.github/`. |
| `gitleaks` | [Gitleaks](https://github.com/gitleaks/gitleaks) | Detect leaked secrets and credentials. |
| `trivy` | [Trivy](https://github.com/aquasecurity/trivy) | Detect HIGH/CRITICAL vulnerabilities. |
| `tests` | `node --test` in `--network none` | Run the protected suite with no outbound network. |

The job names must match `REQUIRED_JOBS` in the main project's `oracle/source.js`.

### The real security boundary

The workflow is triggered by `pull_request`, so it runs the workflow file from the
pull request's merge commit and can technically be edited by a PR. The actual
guarantee comes from the **on-chain oracle**, which refuses to pay any PR that
touches `tests/` or `.github/` (verification bit `0x20`). `CODEOWNERS` and branch
protection add a third layer.

## Submitting a pull request for a bounty

1. Fork the repo and fix the issue **without** touching `tests/` or `.github/`.
2. Open a PR whose body contains:

   ```text
   Closes #<issue number>
   Wallet: 0x<the address you call makeSubmission() from>
   ```

3. Wait for all four jobs to be green, then call `makeSubmission(bountyId, prNumber)`.

## Local development

```bash
npm test    # run the suite with Node's built-in test runner
```

No `npm install` is required: the library has zero dependencies, which is what
lets the CI test job run inside a network-less container.

## Repository layout

```text
.
├── .github/
│   ├── CODEOWNERS
│   ├── pull_request_template.md
│   └── workflows/bounty-verification.yml
├── docs/
│   ├── bounty-issue-01.md        # the issue to solve
│   ├── demo-runbook.md           # end-to-end walkthrough
│   └── reference-fix.patch       # reference solution (not applied to main)
├── scripts/open-bounty-issue.sh  # create the issue with gh
├── src/textkit.js
├── tests/textkit.test.js         # protected test suite
└── package.json
```

See [`docs/demo-runbook.md`](docs/demo-runbook.md) for the full demo script.

## License

[MIT](LICENSE)
