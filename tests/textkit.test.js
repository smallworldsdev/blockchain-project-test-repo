// Protected test suite.
//
// These tests are committed by the repository owner *before* a bounty is
// opened, and they define what "done" means for issue #1. Contributors must not
// change anything in this directory: the CI pipeline and the on-chain oracle
// both reject pull requests that touch `tests/`.

import test from 'node:test';
import assert from 'node:assert/strict';

import { slugify, truncate, capitalize } from '../src/textkit.js';

// --- slugify ---------------------------------------------------------------

test('slugify: lower-cases and hyphenates words', () => {
  assert.equal(slugify('Hello World'), 'hello-world');
});

test('slugify: leaves an existing slug unchanged', () => {
  assert.equal(slugify('already-a-slug'), 'already-a-slug');
});

test('slugify: strips punctuation', () => {
  assert.equal(slugify('Hello, World!'), 'hello-world');
  assert.equal(slugify('Node.js & CI/CD'), 'node-js-ci-cd');
});

test('slugify: trims surrounding separators', () => {
  assert.equal(slugify('  spaced out  '), 'spaced-out');
  assert.equal(slugify('...leading and trailing...'), 'leading-and-trailing');
});

test('slugify: collapses runs of separators into one hyphen', () => {
  assert.equal(slugify('a  --  b'), 'a-b');
});

test('slugify: keeps digits', () => {
  assert.equal(slugify('Release 2.0 (final)'), 'release-2-0-final');
});

test('slugify: empty and separator-only input produce an empty slug', () => {
  assert.equal(slugify(''), '');
  assert.equal(slugify('   '), '');
  assert.equal(slugify('---'), '');
});

// --- truncate --------------------------------------------------------------

test('truncate: returns text that already fits unchanged', () => {
  assert.equal(truncate('hello', 10), 'hello');
});

test('truncate: shortens long text with the default suffix', () => {
  assert.equal(truncate('hello world', 8), 'hello w…');
});

test('truncate: honours a custom suffix', () => {
  assert.equal(truncate('hello world', 9, '...'), 'hello ...');
});

test('truncate: rejects an invalid maxLength', () => {
  assert.throws(() => truncate('hello', -1), RangeError);
});

// --- capitalize ------------------------------------------------------------

test('capitalize: upper-cases the first character only', () => {
  assert.equal(capitalize('hello world'), 'Hello world');
  assert.equal(capitalize(''), '');
});
