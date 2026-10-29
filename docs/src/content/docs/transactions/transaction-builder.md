---
title: Transaction Builder
description: Compose transaction instructions with a fluent API.
---

`TransactionBuilder` is a fluent, chainable API for constructing `UnsignedTransactionV1` objects. Instructions are appended in order and executed as a single batch on-chain.

## Create a builder

```ts
import { TransactionBuilder, Network, resolveMaxEpoch } from "@tari-project/ootle";

const builder = TransactionBuilder.new(Network.Esmeralda, await resolveMaxEpoch(provider));
```

Both arguments are required. The second is the transaction's `max_epoch` — the last epoch in
which it may be sequenced — which every transaction must carry. See
[Epoch Bounds](/transactions/epoch-bounds/).

## Build a transaction

A typical transaction: withdraw tokens from one account and deposit them into another.

```ts
const unsignedTx = TransactionBuilder.new(Network.Esmeralda, await resolveMaxEpoch(provider))
  .feeTransactionPayFromComponent(accountAddress, 1000n)
  .callMethod({ componentAddress: accountAddress, methodName: "withdraw" }, [
    { Literal: resourceAddress },
    { Literal: "500" },
  ])
  .saveVar("bucket")
  .callMethod({ componentAddress: recipientAddress, methodName: "deposit" }, [{ Workspace: "bucket" }])
  .buildUnsignedTransaction();
```

## Main signer

Some operations act as a single signer: creating a component owned by `OwnerRule::OwnedBySigner`, reading `CallerContext::transaction_signer_public_key` in a template, and publishing a template (the main signer is its author). The transaction declares which key that is with `withMainSigner`, before anyone signs:

```ts
builder.withMainSigner({ Authorizer: toHexStr(await signer.getPublicKey()) });
```

The declared key must also sign the transaction. The default is `"None"`, under which the engine aborts any of those operations with `NoMainSigner`.

## Method reference

| Method                                                    | Description                          |
| --------------------------------------------------------- | ------------------------------------ |
| `callFunction(func, args)`                                | Call a static function on a template |
| `callMethod(method, args)`                                | Call a method on a component         |
| `createAccount(ownerPublicKey)`                           | Create a new account component       |
| `createProof(account, resource)`                          | Create a resource proof              |
| `claimBurn(claim, outputData)`                            | Claim a Minotari burn                |
| `saveVar(name)`                                           | Save last output to workspace        |
| `feeTransactionPayFromComponent(addr, amount)`            | Add fee instruction                  |
| `feeTransactionPayFromComponentConfidential(addr, proof)` | Confidential fee                     |
| `allocateAddress(type, name)`                             | Pre-allocate an address              |
| `addInput(req)` / `withInputs(reqs)`                      | Add substate inputs                  |
| `withMinEpoch(n)` / `withMaxEpoch(n)`                     | Set epoch bounds                     |
| `withNonce(n)`                                            | Distinguish identical transactions   |
| `withMainSigner(mainSigner)`                              | Declare the main signer              |
| `withInstructions(instructions)`                          | Append raw instructions              |
| `withFeeInstructions(instructions)`                       | Append raw fee instructions          |
| `dropAllProofsInWorkspace()`                              | Drop all proofs                      |
| `buildUnsignedTransaction()`                              | Return the finished unsigned tx      |

## Mutable builder pattern

All methods return `this`, so you can chain calls. The builder mutates its internal state — each call appends to the same instruction list:

```ts
// These are equivalent:
const tx1 = builder.callMethod(a, argsA).callMethod(b, argsB).buildUnsignedTransaction();

builder.callMethod(a, argsA);
builder.callMethod(b, argsB);
const tx2 = builder.buildUnsignedTransaction();
```
