# CoralKM Protocol Overview

This document describes the CoralKM v0.1 protocol implemented in `@coralstack/core`.
It summarizes the purpose, roles, high-level state flows (namespace setup, guardian lifecycle, recovery) and enumerates message types with example payloads and per-field descriptions.

This specification is derived from the implementation at `packages/core/src/coralkm-protocol` and is intended as a developer-facing reference for implementers of wallets, gateways and guardians.

## 1. Overview

CoralKM is a lightweight protocol for decentralized key management. Its goals are:

- Provide a namespace-based mechanism for wallets to request and store encrypted backups (namespace sync).
- Allow trusted guardian services to manage recovery shares and to participate in a recovery flow for lost device keys.
- Define a small set of DIDComm message types to coordinate namespace provisioning, backup/restore, guardian onboarding, verification challenges, and release of guardian shares.

The protocol is implemented as a DIDComm protocol handler (CoralKM V0.1) and expects agents to declare roles: `wallet`, `gateway`, and/or `guardian`.

## 2. Protocol Roles

- wallet
  - End-user wallet application running in a device or browser.
  - Requests namespace provisioning from gateway, sends/receives namespace sync messages, and participates in guardian verification and share recovery.

- gateway
  - A routing and namespace authority (examples: the CoralKM gateway Cloudflare Worker).
  - Authorizes namespace requests, issues namespace grants/denies, stores namespace metadata and (optionally) backup data.
  - Responds to namespace sync PUT/GET requests and returns sync responses.

- guardian
  - A trusted service that stores guardian shares associated with namespaces and helps with recovery.
  - Receives guardian-requests and can grant/deny guardianship, stores guardian share data and policies, issues verification challenges and releases shares after verification.

Agents may implement multiple roles (for example, a gateway could also be a guardian) but each role has specific store requirements:

- `gateway` role: requires a `namespaceStore` implementation (see `ICoralKMNamespaceStore`).
- `guardian` role: requires a `guardianStore` implementation (see `ICoralKMGuardianStore`).

## 3. State flows

Below are the canonical state flows and brief descriptions of the responsibilities and messages involved.

### 3.1 Namespace setup (provisioning)

1. Wallet -> Gateway: `NAMESPACE_REQUEST`
   - Wallet requests a namespace from the gateway (this is typically done once per wallet / user account).
2. Gateway: Evaluate policy - Gateway consults its NamespaceStore to decide whether to allow/deny the request (PreRequestPolicy / RequestPolicy).
   3a. Gateway -> Wallet: `NAMESPACE_GRANT` (if allowed) - Gateway creates a namespace (UUID + gateway DID) and returns a `NAMESPACE_GRANT` message with `thid` referencing the original request id and `body.namespace` payload describing the assigned namespace.
   3b. Gateway -> Wallet: `NAMESPACE_DENY` (if denied) - If denied, a `NAMESPACE_DENY` may be returned with optional `body.reason`.

After grant, the wallet may perform `NAMESPACE_SYNC` messages to backup data to the gateway.

### 3.2 Namespace backup and restore (sync)

- Wallet -> Gateway: `NAMESPACE_SYNC` (PUT)
  - Used to upload encrypted backup data for the namespace. The message body includes `request: 'PUT'` and `data: <base64-encrypted-backup>`.
- Gateway -> Wallet: `NAMESPACE_SYNC_RESPONSE` (PUT)
  - Confirmation with `request: 'PUT'` and `hash: <sha256-hash>` for integrity verification.

- Wallet -> Gateway: `NAMESPACE_SYNC` (GET)
  - Request to restore backup data, `request: 'GET'` and optional `recovery_id` to target a specific namespace.
- Gateway -> Wallet: `NAMESPACE_SYNC_RESPONSE` (GET)
  - Returns `request: 'GET'` and `data: <base64-encrypted-backup>`.

### 3.3 Guardian onboarding and lifecycle

1. Wallet -> Guardian: `GUARDIAN_REQUEST`
   - Wallet asks a guardian to become a guardian for its namespace.
2. Guardian: evaluate policy and either:
   - Guardian -> Wallet: `GUARDIAN_GRANT` (accept)
   - Guardian -> Wallet: `GUARDIAN_DENY` (deny; may include `reason`)

Updating guardian share data (guardian-side operation):

- Guardian -> Wallet: `GUARDIAN_SHARE_UPDATE`
  - Guardian sends updated share data, threshold and optional delay.
- Wallet -> Guardian: `GUARDIAN_SHARE_UPDATE_CONFIRM`
  - Wallet acknowledges with a confirm message referencing `thid`.

Removing a guardian:

- Wallet (or guardian) -> Guardian: `GUARDIAN_REMOVE`
  - Guardian removes the guardian policy for wallet and replies with `GUARDIAN_REMOVE_CONFIRM`.

### 3.4 Recovery process (high-level)

1. Device (or gateway acting on behalf of device) -> Guardian(s): `NAMESPACE_RECOVERY_REQUEST`
   - Request includes `device_did`, `namespace` (id + gateway_did), optional `request_id` and `expires_at`.
2. Guardian: validate request and start recovery workflow
   - Guardian stores a recovery request and issues a verification challenge to the requesting device DID via `GUARDIAN_VERIFICATION_CHALLENGE` (message contains `pthid` referencing the parent recovery request).
3. Device -> Guardian: `GUARDIAN_VERIFICATION_CHALLENGE_RESPONSE` - Device responds with the challenge result (credentials, code, etc.). The guardian validates the response.
   4a. If verification succeeds: Guardian -> Device: `GUARDIAN_RELEASE_SHARE` - Guardian sends the guardian share (base64) and the recovery `pthid` and `threshold`. The wallet uses the shares to reconstruct secrets and recover keys.
   4b. If verification fails: Guardian records the failure and may deny or require re-challenge.

Note: the concrete share management, secret reconstruction (e.g., Shamir shares), and secure transport of shares are left to the guardian store implementations and are out of scope for the handler demo.

## 4. Message Types (CoralKM V0.1)

The protocol defines a set of DIDComm message types (enumerated in `CoralKMV01MessageTypes`). Each message is a DIDComm message with standard envelope fields (`id`, `type`, `from`, `to`) and optional headers (`thid`, `pthid`) and `body` payloads. Below each type is an example JSON DIDComm message (the DIDComm envelope typically includes `id`, `type`, `from`, `to` and `body`), followed by a table of fields, whether they are required, and a short description.

### 4.1 `NAMESPACE_REQUEST`

Example:

```json
{
  "id": "<uuid>",
  "type": "https://coralstack.com/coralkm/0.1/namespace-request",
  "from": "did:example:alice",
  "to": ["did:example:gateway"]
}
```

Fields:

| Field | Required | Description                    |
| ----- | -------: | ------------------------------ |
| id    |      yes | DIDComm message id (UUID)      |
| type  |      yes | Message type URI               |
| from  |      yes | Sender DID                     |
| to    |      yes | Recipient DID or array of DIDs |

Behavior: Gateway evaluates namespace policy and replies with `NAMESPACE_GRANT` or `NAMESPACE_DENY`.

### 4.2 `NAMESPACE_GRANT`

Example:

```json
{
  "id": "<uuid>",
  "type": "https://coralstack.com/coralkm/0.1/namespace-grant",
  "from": "did:example:gateway",
  "to": ["did:example:alice"],
  "thid": "<namespace-request-id>",
  "body": {
    "namespace": { "id": "<ns-uuid>", "gateway_did": "did:example:gateway" }
  }
}
```

Fields:

| Field          | Required | Description                                |
| -------------- | -------: | ------------------------------------------ |
| id             |      yes | Message id (UUID)                          |
| type           |      yes | Message type URI                           |
| from           |      yes | Gateway DID                                |
| to             |      yes | Wallet DID(s)                              |
| thid           |      yes | Thread id referencing the original request |
| body.namespace |      yes | Namespace object (id, gateway_did)         |

### 4.3 `NAMESPACE_DENY`

Example:

```json
{
  "id": "<uuid>",
  "type": "https://coralstack.com/coralkm/0.1/namespace-deny",
  "from": "did:example:gateway",
  "to": ["did:example:alice"],
  "thid": "<namespace-request-id>",
  "body": { "reason": "policy_restriction" }
}
```

Fields:

| Field       | Required | Description                   |
| ----------- | -------: | ----------------------------- |
| id          |      yes | Message id                    |
| type        |      yes | Message type                  |
| from        |      yes | Gateway DID                   |
| to          |      yes | Wallet DID                    |
| thid        |      yes | Thread id referencing request |
| body.reason |       no | Optional denial reason        |

### 4.4 `NAMESPACE_SYNC` (PUT / GET)

Purpose: used to upload (PUT) or retrieve (GET) encrypted namespace backup data.

PUT Example (backup):

```json
{
  "id": "<uuid>",
  "type": "https://coralstack.com/coralkm/0.1/namespace-sync",
  "from": "did:example:alice",
  "to": ["did:example:gateway"],
  "body": { "request": "PUT", "data": "<base64-encrypted-backup>" }
}
```

GET Example (restore request):

```json
{
  "id": "<uuid>",
  "type": "https://coralstack.com/coralkm/0.1/namespace-sync",
  "from": "did:example:alice",
  "to": ["did:example:gateway"],
  "body": { "request": "GET", "recovery_id": "<optional-namespace-id>" }
}
```

Fields and rules:

| Field            |                                 Required | Description                           |
| ---------------- | ---------------------------------------: | ------------------------------------- |
| id               |                                      yes | Message id                            |
| type             |                                      yes | Message type                          |
| from             |                                      yes | Sender DID                            |
| to               |                                      yes | Recipient DID                         |
| body.request     |                                      yes | 'PUT' or 'GET'                        |
| body.data        |                                 when PUT | Base64 encrypted backup payload (PUT) |
| body.recovery_id | when GET and targeting specific recovery | Optional namespace id to restore      |

Responses use `NAMESPACE_SYNC_RESPONSE`.

### 4.5 `NAMESPACE_SYNC_RESPONSE` (PUT / GET)

PUT Response Example:

```json
{
  "id": "<uuid>",
  "type": "https://coralstack.com/coralkm/0.1/namespace-sync-response",
  "from": "did:example:gateway",
  "to": ["did:example:alice"],
  "thid": "<sync-request-id>",
  "body": { "request": "PUT", "hash": "<sha256-hash>" }
}
```

GET Response Example:

```json
{
  "id": "<uuid>",
  "type": "https://coralstack.com/coralkm/0.1/namespace-sync-response",
  "from": "did:example:gateway",
  "to": ["did:example:alice"],
  "thid": "<sync-request-id>",
  "body": { "request": "GET", "data": "<base64-encrypted-backup>" }
}
```

### 4.6 Guardian message types

The following guardian-related message types are used for onboarding guardians, updating shares, verification challenges, and releasing shares during recovery.

#### `GUARDIAN_REQUEST`

Example:

```json
{
  "id": "<uuid>",
  "type": "https://coralstack.com/coralkm/0.1/guardian-request",
  "from": "did:example:alice",
  "to": ["did:example:guardian"],
  "body": {
    "namespace": { "id": "<ns-uuid>", "gateway_did": "did:example:gateway" },
    "request_id": "<optional>"
  }
}
```

Fields:

| Field           | Required | Description                        |
| --------------- | -------: | ---------------------------------- |
| id              |      yes | Message id                         |
| type            |      yes | Message type URI                   |
| from            |      yes | Wallet DID                         |
| to              |      yes | Guardian DID(s)                    |
| body.namespace  |      yes | Namespace (id and gateway_did)     |
| body.request_id |       no | Optional request id used by wallet |

Behavior: Guardian evaluates the request and replies with `GUARDIAN_GRANT` or `GUARDIAN_DENY`.

#### `GUARDIAN_GRANT`

Example:

```json
{
  "id": "<uuid>",
  "type": "https://coralstack.com/coralkm/0.1/guardian-grant",
  "from": "did:example:guardian",
  "to": ["did:example:alice"],
  "thid": "<guardian-request-id>",
  "body": { "guardian": { "did": "did:example:guardian", "share_id": "<share-id>" } }
}
```

Fields:

| Field         | Required | Description                                            |
| ------------- | -------: | ------------------------------------------------------ |
| id            |      yes | Message id                                             |
| type          |      yes | Message type                                           |
| from          |      yes | Guardian DID                                           |
| to            |      yes | Wallet DID                                             |
| thid          |      yes | Thread id referencing the request                      |
| body.guardian |      yes | Guardian descriptor (did, share_id, optional metadata) |

#### `GUARDIAN_DENY`

Example:

```json
{
  "id": "<uuid>",
  "type": "https://coralstack.com/coralkm/0.1/guardian-deny",
  "from": "did:example:guardian",
  "to": ["did:example:alice"],
  "thid": "<guardian-request-id>",
  "body": { "reason": "insufficient_trust" }
}
```

Fields:

| Field       | Required | Description                       |
| ----------- | -------: | --------------------------------- |
| id          |      yes | Message id                        |
| type        |      yes | Message type                      |
| from        |      yes | Guardian DID                      |
| to          |      yes | Wallet DID                        |
| thid        |      yes | Thread id referencing the request |
| body.reason |       no | Optional deny reason              |

#### `GUARDIAN_SHARE_UPDATE`

Purpose: Guardian notifies the wallet of updated share parameters or provides an encrypted share blob.

Example:

```json
{
  "id": "<uuid>",
  "type": "https://coralstack.com/coralkm/0.1/guardian-share-update",
  "from": "did:example:guardian",
  "to": ["did:example:alice"],
  "thid": "<related-id>",
  "body": { "share": "<base64-share>", "threshold": 2, "delay": 0 }
}
```

Fields:

| Field          |        Required | Description                                            |
| -------------- | --------------: | ------------------------------------------------------ |
| body.share     | when applicable | Base64 encoded share blob (encrypted)                  |
| body.threshold |             yes | Number of shares required to reconstruct secret        |
| body.delay     |              no | Optional delay in seconds before share may be released |

#### `GUARDIAN_SHARE_UPDATE_CONFIRM`

Example:

```json
{
  "id": "<uuid>",
  "type": "https://coralstack.com/coralkm/0.1/guardian-share-update-confirm",
  "from": "did:example:alice",
  "to": ["did:example:guardian"],
  "thid": "<share-update-id>"
}
```

Fields:

| Field | Required | Description                                    |
| ----- | -------: | ---------------------------------------------- |
| thid  |      yes | Thread id referencing the share update message |

#### `GUARDIAN_REMOVE` and `GUARDIAN_REMOVE_CONFIRM`

Removing a guardian is an explicit operation. The remover (wallet or guardian) issues `GUARDIAN_REMOVE` and the target replies with `GUARDIAN_REMOVE_CONFIRM` to acknowledge.

Remove Example:

```json
{
  "id": "<uuid>",
  "type": "https://coralstack.com/coralkm/0.1/guardian-remove",
  "from": "did:example:alice",
  "to": ["did:example:guardian"],
  "body": { "share_id": "<share-id>" }
}
```

Confirm Example:

```json
{
  "id": "<uuid>",
  "type": "https://coralstack.com/coralkm/0.1/guardian-remove-confirm",
  "from": "did:example:guardian",
  "to": ["did:example:alice"],
  "thid": "<remove-id>"
}
```

#### `GUARDIAN_VERIFICATION_CHALLENGE`

Purpose: Guardian issues a proof-of-possession or human verification challenge during recovery. The message references the parent recovery request via `pthid`.

Example:

```json
{
  "id": "<uuid>",
  "type": "https://coralstack.com/coralkm/0.1/guardian-verification-challenge",
  "from": "did:example:guardian",
  "to": ["did:example:device"],
  "pthid": "<recovery-request-id>",
  "body": {
    "challenge": { "type": "code", "code_length": 6, "expires_at": "2025-10-20T12:00:00Z" }
  }
}
```

Fields:

| Field          | Required | Description                                                          |
| -------------- | -------: | -------------------------------------------------------------------- |
| pthid          |      yes | Parent thread id referencing the recovery request                    |
| body.challenge |      yes | Challenge descriptor (type, length, expires_at, additional metadata) |

#### `GUARDIAN_VERIFICATION_CHALLENGE_RESPONSE`

Purpose: Device or wallet responds to a guardian verification challenge.

Example:

```json
{
  "id": "<uuid>",
  "type": "https://coralstack.com/coralkm/0.1/guardian-verification-challenge-response",
  "from": "did:example:device",
  "to": ["did:example:guardian"],
  "pthid": "<recovery-request-id>",
  "body": { "result": { "code": "123456" } }
}
```

Fields:

| Field       | Required | Description                                       |
| ----------- | -------: | ------------------------------------------------- |
| pthid       |      yes | Parent thread id referencing the recovery request |
| body.result |      yes | Challenge response payload (code or proof)        |

#### `GUARDIAN_RELEASE_SHARE`

Purpose: After successful verification, the guardian releases an encrypted share to the requestor. The message includes `pthid` and `body.share` with threshold info.

Example:

```json
{
  "id": "<uuid>",
  "type": "https://coralstack.com/coralkm/0.1/guardian-release-share",
  "from": "did:example:guardian",
  "to": ["did:example:device"],
  "pthid": "<recovery-request-id>",
  "body": { "share": "<base64-share>", "threshold": 2 }
}
```

Fields:

| Field          | Required | Description                                     |
| -------------- | -------: | ----------------------------------------------- |
| pthid          |      yes | Parent thread id                                |
| body.share     |      yes | Encrypted/base64 share blob                     |
| body.threshold |      yes | Number of shares required to reconstruct secret |

### 4.7 Implementation notes and caveats

The current `DCCoralKMProtocolV01` handler implemented in `@coralstack/core` contains demonstration and convenience behavior that must be replaced for production:

- Static verification code: The demo handler uses a static challenge code (`"123456"`) and accepts that as a successful verification. Replace this with a secure, time-limited challenge mechanism (random nonce, HMAC or signed challenge, or use verifiable credentials proof).
- Auto-grant behavior: The gateway currently auto-grants namespace requests in some demo flows. Real deployments should enforce policy checks, rate limits, and proper authentication before issuing `NAMESPACE_GRANT`.
- Guardian DID private hack: The handler stores a private `_guardian_did` field for demo routing. Production guardians must persist authorized guardian records in the `ICoralKMGuardianStore` and never rely on in-memory or hard-coded DIDs.

Security considerations:

- Never transport raw secret shares without encrypting them to the recipient's public key.
- Use short-lived nonces and require challenge-response proofs that bind to the DID and the recovery `pthid`.
- Log minimal metadata; never log secret blobs or unencrypted shares.

## 5. References

- Implementation: `packages/core/src/coralkm-protocol/coralkm-protocol-handler.ts`
- Types: `packages/core/src/coralkm-protocol/types.ts`
