# Changelog

All notable changes to `@tari-project/ootle-indexer` are documented here.

## Unreleased

### BREAKING — `PendingTransaction.watch()` return type narrowed

`PendingTransaction.watch()` now returns `Promise<CommitOutcome>`
(`{ outcome: "Commit" }`) instead of `Promise<TransactionOutcome>`. It only ever
resolves on a successful commit; every other verdict throws —
`TransactionRejectedError` (Reject or FeeIntentCommit), `TransactionTimeoutError`,
or `OperationCancelledError`.

Callers that pattern-matched on the resolved value (e.g.
`if (outcome.outcome === "Reject")`) must move that handling into a `try/catch`
on `TransactionRejectedError`; those return-based branches are now dead.

### Fixed

- `openEventStream` (used by `TransactionWatcher`) no longer buffers an
  unterminated SSE event without limit or re-parses the whole buffer on every
  chunk. It now scans each chunk once and fails the stream (falling into the
  existing reconnect back-off) when a line exceeds `MAX_SSE_LINE_LENGTH` or one
  event's data exceeds `MAX_SSE_EVENT_DATA_LENGTH` (both 1 MiB), so a hostile
  indexer can no longer exhaust client memory or CPU.
  ([GHSA-j9gh-gmgx-hhp3](https://github.com/tari-project/tari-ootle/security/advisories/GHSA-j9gh-gmgx-hhp3))
- `parseSseChunk` is deprecated; it keeps the unbounded carry-forward behaviour.
- `restPollUntilFinal` no longer swallows transport errors. A 5xx / auth /
  network / parse failure during polling is remembered and surfaced as the
  `TransactionTimeoutError`'s `cause`, instead of masquerading as "still pending".
- The pure SSE-timeout path now polls a short dedicated grace window so a
  transaction that commits just after the SSE timeout is still caught, rather than
  spuriously timing out after a single poll.
