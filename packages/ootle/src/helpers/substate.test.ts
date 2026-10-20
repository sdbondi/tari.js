//   Copyright 2026 The Tari Project
//   SPDX-License-Identifier: BSD-3-Clause

import { describe, expect, it } from "vitest";
import { upSubstateValue } from "./substate";

describe("upSubstateValue", () => {
  it("returns the value of an up substate", () => {
    const substate = { Utxo: { output: null, is_frozen: false } };
    expect(upSubstateValue({ version: 1, state: { up: { substate } }, verified: false })).toBe(substate);
  });

  it("returns null for a down substate", () => {
    expect(upSubstateValue({ version: 1, state: { down: {} }, verified: true })).toBeNull();
  });
});
