//   Copyright 2026 The Tari Project
//   SPDX-License-Identifier: BSD-3-Clause

// Cross-SDK golden vectors. Each `expected` value is copied verbatim from the core's
// `crates/ootle_sdk_core/fixtures/arg_dsl/<name>.json` (`expected.encoded_arg_bytes`),
// which the Rust encoders, ootle-go and ootle-py are all pinned to. When the core
// regenerates a vector, update it here too so the TypeScript helpers cannot drift.
// Vectors with no TypeScript helper (list, optional, txreceipt) are not mirrored.

import type { InstructionArg, NonFungibleId } from "@tari-project/ootle-ts-bindings";
import { describe, expect, it } from "vitest";
import {
  amountLiteral,
  boolLiteral,
  bytesLiteral,
  claimedOutputTombstoneAddressLiteral,
  componentAddressLiteral,
  intLiteral,
  metadataLiteral,
  nonFungibleAddressLiteral,
  resourceAddressLiteral,
  stringLiteral,
  templateAddressLiteral,
  utxoAddressLiteral,
  validatorFeePoolAddressLiteral,
  vaultIdLiteral,
} from "./cbor-literal";
import { fromHexStr } from "./hex";

const resourceC = "resource_" + "cc".repeat(32);
// `nonFungibleAddressLiteral` prefix: Tag(130), array(2), Tag(131) bytes(32) resource.
const NFT_PREFIX = "d88282d8835820" + "cc".repeat(32);

/** The bare `NonFungibleId` bytes, for the core's standalone `nfid_*` vectors. */
function nfidLiteral(id: NonFungibleId): InstructionArg {
  const { Literal } = nonFungibleAddressLiteral({ resource_address: resourceC, id }) as { Literal: string };
  expect(Literal.startsWith(NFT_PREFIX)).toBe(true);
  return { Literal: Literal.slice(NFT_PREFIX.length) };
}

const vectors: [name: string, actual: () => InstructionArg, expected: string][] = [
  [
    "address_component",
    () => componentAddressLiteral("component_" + "aa".repeat(32)),
    "d8805820aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  ],
  [
    "address_non_fungible",
    () => nonFungibleAddressLiteral({ resource_address: resourceC, id: { String: "nft-1" } }),
    "d88282d8835820cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc820181656e66742d31",
  ],
  [
    "address_resource",
    () => resourceAddressLiteral("resource_" + "bb".repeat(32)),
    "d8835820bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  ],
  [
    "address_template",
    () => templateAddressLiteral("template_" + "12".repeat(32)),
    "58201212121212121212121212121212121212121212121212121212121212121212",
  ],
  [
    "address_tombstone",
    () => claimedOutputTombstoneAddressLiteral("tombstone_" + "78".repeat(32)),
    "d88858207878787878787878787878787878787878787878787878787878787878787878",
  ],
  [
    "address_utxo",
    () => utxoAddressLiteral({ resource_address: resourceC, id: "56".repeat(32) }),
    "d88d82d8835820cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc58205656565656565656565656565656565656565656565656565656565656565656",
  ],
  [
    "address_validator_fee_pool",
    () => validatorFeePoolAddressLiteral("vnfp_" + "34".repeat(32)),
    "d88a58203434343434343434343434343434343434343434343434343434343434343434",
  ],
  [
    "address_vault",
    () => vaultIdLiteral("vault_" + "dd".repeat(32)),
    "d8845820dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
  ],
  ["amount_above_2_pow_33", () => amountLiteral(17179869191n), "1b0000000400000007"],
  ["amount", () => amountLiteral(1000000n), "1a000f4240"],
  ["bool_false", () => boolLiteral(false), "f4"],
  ["bool_true", () => boolLiteral(true), "f5"],
  ["bytes", () => bytesLiteral(fromHexStr("deadbeef")), "44deadbeef"],
  ["i64_min", () => intLiteral(-9223372036854775808n), "3b7fffffffffffffff"],
  ["i64_negative", () => intLiteral(-42n), "3829"],
  ["i64_positive", () => intLiteral(42n), "182a"],
  [
    "metadata",
    () => metadataLiteral({ provider_name: "OotleExample", website: "example.test" }),
    "d881a26d70726f76696465725f6e616d656c4f6f746c654578616d706c6567776562736974656c6578616d706c652e74657374",
  ],
  ["nfid_str", () => nfidLiteral({ String: "special-nft" }), "8201816b7370656369616c2d6e6674"],
  ["nfid_u32", () => nfidLiteral({ Uint32: 7 }), "82028107"],
  ["nfid_u64", () => nfidLiteral({ Uint64: 17179869189 }), "8203811b0000000400000005"],
  [
    "nfid_uuid",
    () => nfidLiteral({ U256: "5a".repeat(32) }),
    "82008158205a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a",
  ],
  ["string", () => stringLiteral("withdraw"), "687769746864726177"],
  ["u64_above_2_pow_33", () => intLiteral(17179869283n), "1b0000000400000063"],
  ["u64", () => intLiteral(42n), "182a"],
];

describe("core arg_dsl golden vectors", () => {
  it.each(vectors)("%s", (_name, actual, expected) => {
    expect(actual()).toEqual({ Literal: expected });
  });
});
