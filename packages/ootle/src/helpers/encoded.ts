//   Copyright 2026 The Tari Project
//   SPDX-License-Identifier: BSD-3-Clause

import type {
  Event,
  ExecuteResult,
  Resource,
  SubstateValue,
  TransactionReceipt,
  Utxo,
} from "@tari-project/ootle-ts-bindings";
import {
  decodeEvent as wasmDecodeEvent,
  decodeExecuteResult as wasmDecodeExecuteResult,
  decodeResource as wasmDecodeResource,
  decodeSubstateValue as wasmDecodeSubstateValue,
  decodeTransactionReceipt as wasmDecodeTransactionReceipt,
  decodeUtxo as wasmDecodeUtxo,
} from "@tari-project/ootle-wasm-bor";

// The indexer serves engine values in their CBOR encoding, base64 in JSON. These decode one
// into the JSON shape of its binding type. `JSON.parse` turns a u64 above 2^53 into an
// inexact number, as it does for any other indexer response.

/** Decodes a `SubstateValue` as the indexer serves it. */
export function decodeSubstateValue(encoded: string): SubstateValue {
  return JSON.parse(wasmDecodeSubstateValue(encoded)) as SubstateValue;
}

/** Decodes an `ExecuteResult` as the indexer serves it (a finalized transaction's `execution_result`). */
export function decodeExecuteResult(encoded: string): ExecuteResult {
  return JSON.parse(wasmDecodeExecuteResult(encoded)) as ExecuteResult;
}

/** Decodes a `TransactionReceipt` as the indexer serves it. */
export function decodeTransactionReceipt(encoded: string): TransactionReceipt {
  return JSON.parse(wasmDecodeTransactionReceipt(encoded)) as TransactionReceipt;
}

/** Decodes an `Event` as the indexer serves it. */
export function decodeEvent(encoded: string): Event {
  return JSON.parse(wasmDecodeEvent(encoded)) as Event;
}

/** Decodes a `Resource` as the indexer serves it. */
export function decodeResource(encoded: string): Resource {
  return JSON.parse(wasmDecodeResource(encoded)) as Resource;
}

/** Decodes a `Utxo` as the indexer serves it. */
export function decodeUtxo(encoded: string): Utxo {
  return JSON.parse(wasmDecodeUtxo(encoded)) as Utxo;
}
