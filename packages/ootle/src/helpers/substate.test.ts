//   Copyright 2026 The Tari Project
//   SPDX-License-Identifier: BSD-3-Clause

import { describe, expect, it } from "vitest";
import { ENCODED_VAULT_SUBSTATE } from "../test/fixtures";
import { upSubstateValue } from "./substate";

describe("upSubstateValue", () => {
  it("decodes the value of an up substate", () => {
    expect(
      upSubstateValue({ version: 1, state: { up: { substate: ENCODED_VAULT_SUBSTATE } }, verified: false }),
    ).toEqual({
      Vault: {
        resource_container: {
          Fungible: {
            address: "resource_" + "01".repeat(32),
            amount: "100",
            locked_amount: "0",
          },
        },
        freeze_flags: 0,
      },
    });
  });

  it("returns null for a down substate", () => {
    expect(upSubstateValue({ version: 1, state: { down: {} }, verified: true })).toBeNull();
  });

  it("throws on a value that is not the indexer's encoding", () => {
    expect(() => upSubstateValue({ version: 1, state: { up: { substate: "not base64!" } }, verified: false })).toThrow(
      /base64/i,
    );
  });
});
