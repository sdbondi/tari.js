//   Copyright 2026 The Tari Project
//   SPDX-License-Identifier: BSD-3-Clause

import type { IndexerGetSubstateResponse, SubstateValue } from "@tari-project/ootle-ts-bindings";
import { decodeSubstateValue } from "./encoded";

/**
 * The decoded value of a fetched substate, or `null` if the indexer answered that the
 * requested version is down (only possible for a request with `include_proof`
 * that names the version).
 */
export function upSubstateValue(response: IndexerGetSubstateResponse): SubstateValue | null {
  return "up" in response.state ? decodeSubstateValue(response.state.up.substate) : null;
}
