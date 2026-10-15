<!-- Title: slugify() leaves punctuation and surrounding separators in slugs -->

## Description

`slugify()` in [`src/textkit.js`](../src/textkit.js) is supposed to turn arbitrary
text into a clean, lower-case, URL-friendly slug, but it only replaces
whitespace. Punctuation survives and leading/trailing separators are kept, so the
result is frequently not a valid slug.

```js
slugify('Hello, World!');        // -> 'hello,-world!'      expected 'hello-world'
slugify('  Node.js & CI/CD  ');  // -> '  node.js-&-ci/cd  ' expected 'node-js-ci-cd'
slugify('---');                  // -> '---'                expected ''
```

## Expected behaviour

`slugify(text)` must:

1. lower-case the input,
2. replace **every run of non-alphanumeric characters** with a single `-`,
3. remove any leading or trailing `-`,
4. return `''` when the input contains no alphanumeric characters.

## Definition of done

The tests committed in `tests/textkit.test.js` define "done". The CI pipeline runs
exactly that suite (the `/tests` folder is protected), so this issue is solved
when the whole suite passes.

## Ground rules

- Do **not** modify anything under `tests/` or `.github/`; the oracle rejects any
  pull request that does.
- Open the pull request with these two lines in its body:

  ```text
  Closes #<this issue number>
  Wallet: 0x<the address you call makeSubmission() from>
  ```

## Bounty

This issue is funded by an on-chain escrow. Once CI is green and the oracle
verifies the pull request, the bounty is paid out automatically to the wallet
address written in the pull request.
