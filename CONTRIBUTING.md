# Contributing

Thanks for your interest in contributing! This repository is a demo target for a
CI-gated, trustless bounty payout system, so pull requests are verified
automatically rather than by hand.

## Workflow

1. Fork the repository.
2. Create a feature branch: `git checkout -b fix/<name>`.
3. Make your change and run the tests:

   ```bash
   npm test
   ```

4. Open a pull request against `main`.

## Rules

- **Never modify `tests/` or `.github/`.** They are protected. The CI pipeline and
  the verifier both reject pull requests that touch them. The tests define what
  "done" means for a bounty and must stay exactly as the owner committed them.
- **Never commit secrets or credentials.** A `gitleaks` scan runs on every pull
  request.
- **Keep dependencies clean.** A `trivy` scan fails the build on HIGH/CRITICAL
  vulnerabilities.

## Bounty pull requests

To be eligible for an on-chain payout, the pull request body must contain both of
these lines:

```text
Closes #<the bounty issue number>
Wallet: 0x<the address you call makeSubmission() from>
```

Wait for every CI job to go green before calling `makeSubmission()`. If CI was
still running when you submitted, the verification is rejected and you can simply
submit again.
