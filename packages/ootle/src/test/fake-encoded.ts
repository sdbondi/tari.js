//   Copyright 2026 The Tari Project
//   SPDX-License-Identifier: BSD-3-Clause

// Test-only stand-in for the indexer's CBOR encoding, for fixtures built in JS (e.g. UTXOs
// sealed by the fake crypto) that no CBOR encoder here can produce. A test file swaps the
// WASM decoders for these with
//
//   vi.mock("@tari-project/ootle-wasm-bor", async () => (await import("../test/fake-encoded")).fakeOotleWasmBor);
//
// Not re-exported from the package root; tests import via relative subpath.

const PREFIX = "test-encoded:";

/** Encodes `value` so the {@link fakeOotleWasmBor} decoders return it. */
export function testEncoded(value: unknown): string {
  return PREFIX + JSON.stringify(value);
}

function decode(encoded: string): string {
  if (!encoded.startsWith(PREFIX)) {
    throw new Error(`fake decoder: not a testEncoded value: ${encoded}`);
  }
  return encoded.slice(PREFIX.length);
}

/** The `@tari-project/ootle-wasm-bor` exports, decoding {@link testEncoded} values. */
export const fakeOotleWasmBor = {
  decodeSubstateValue: decode,
  decodeExecuteResult: decode,
  decodeTransactionReceipt: decode,
  decodeEvent: decode,
  decodeResource: decode,
  decodeUtxo: decode,
};
