# Wallet-Mobile Enhancement Specification

> **Project**: CoralKM Wallet Mobile
> **Package**: `packages/wallet-mobile/`
> **Branch**: `mobile-app-migration`
> **Date**: 2026-02-23

---

## Table of Contents

1. [Priority Matrix](#priority-matrix)
2. [Critical Priority](#critical-priority)
   - [E01: Implement Real Encryption](#e01-implement-real-encryption)
   - [E02: Implement DIDComm Email Verification Protocol](#e02-implement-didcomm-email-verification-protocol)
   - [E03: Implement Real Authentication Flow](#e03-implement-real-authentication-flow)
3. [High Priority](#high-priority)
   - [E04: Implement Guardian Recovery Protocol](#e04-implement-guardian-recovery-protocol)
   - [E05: WebSocket Reconnection & Offline Queue](#e05-websocket-reconnection--offline-queue)
   - [E06: Persist Setup Wizard State](#e06-persist-setup-wizard-state)
   - [E07: Type Safety Cleanup](#e07-type-safety-cleanup)
   - [E08: Implement Test Suite](#e08-implement-test-suite)
4. [Medium Priority](#medium-priority)
   - [E09: Structured Logging System](#e09-structured-logging-system)
   - [E10: Fix UserProvider Re-render Issue](#e10-fix-userprovider-re-render-issue)
   - [E11: Integrate Theme System](#e11-integrate-theme-system)
   - [E12: Error Boundary & Global Error Handling](#e12-error-boundary--global-error-handling)
   - [E13: Implement Notification System](#e13-implement-notification-system)
   - [E14: Implement Device Management](#e14-implement-device-management)
5. [Low Priority](#low-priority)
   - [E15: Build Stub Screens](#e15-build-stub-screens)
   - [E16: QR Scanner Enhancements](#e16-qr-scanner-enhancements)
   - [E17: Biometric Authentication](#e17-biometric-authentication)
   - [E18: Accessibility Audit](#e18-accessibility-audit)
   - [E19: Performance Optimization](#e19-performance-optimization)
   - [E20: Developer Experience & Documentation](#e20-developer-experience--documentation)

---

## Priority Matrix

| Priority | ID | Enhancement | Effort | Risk |
|----------|----|-------------|--------|------|
| Critical | E01 | Real Encryption | High | High |
| Critical | E02 | DIDComm Email Verification | High | High |
| Critical | E03 | Real Authentication Flow | Medium | High |
| High | E04 | Guardian Recovery Protocol | High | Medium |
| High | E05 | WebSocket Reconnection | Medium | Medium |
| High | E06 | Persist Setup Wizard State | Low | Low |
| High | E07 | Type Safety Cleanup | Medium | Low |
| High | E08 | Test Suite | High | Low |
| Medium | E09 | Structured Logging | Medium | Low |
| Medium | E10 | Fix UserProvider Re-renders | Low | Low |
| Medium | E11 | Integrate Theme System | Medium | Low |
| Medium | E12 | Error Boundary | Medium | Low |
| Medium | E13 | Notification System | Medium | Medium |
| Medium | E14 | Device Management | Medium | Medium |
| Low | E15 | Build Stub Screens | Low | Low |
| Low | E16 | QR Scanner Enhancements | Low | Low |
| Low | E17 | Biometric Authentication | Medium | Medium |
| Low | E18 | Accessibility Audit | Medium | Low |
| Low | E19 | Performance Optimization | Medium | Low |
| Low | E20 | Developer Experience & Docs | Low | Low |

---

## Critical Priority

### E01: Implement Real Encryption

**Current State**:
The `EncryptionManager` at `providers/wallet/encryption.ts` has **fully mocked** encryption methods:

| Method | Current Behavior | Expected Behavior |
|--------|-----------------|-------------------|
| `encrypt(data, key)` | Returns SHA-256 hash (irreversible) | AES-GCM encryption with IV |
| `decrypt(data, key)` | Returns `null` always | AES-GCM decryption |
| `createDEK()` | Generates real 256-bit key via `expo-crypto` | Keep as-is |
| `encryptDEK(dek, password)` | Returns SHA-256 hash | AES-GCM wrap with PBKDF2-derived key |
| `decryptDEK(encryptedDEK, password)` | Returns `null` | AES-GCM unwrap |
| `splitDEK(dek, shares, threshold)` | String slicing (not Shamir) | Real Shamir's Secret Sharing |
| `combineDEK(shares)` | String concatenation | Real Shamir reconstruction |
| `hashPassword(password)` | SHA-256 via `expo-crypto` | PBKDF2 with salt + iterations |

**Target State**: Production-grade encryption using React Native compatible libraries.

**Implementation Steps**:

1. **Install dependencies**:
   ```
   npx expo install expo-crypto react-native-get-random-values
   npm install @noble/ciphers @noble/hashes shamir-secret-sharing
   ```

2. **Implement `encrypt(data, key)`**:
   - Use AES-256-GCM from `@noble/ciphers`
   - Generate random 12-byte IV using `expo-crypto.getRandomBytes()`
   - Return `base64(IV + ciphertext + authTag)`
   - Handle both string and Uint8Array inputs

3. **Implement `decrypt(data, key)`**:
   - Extract IV (first 12 bytes), authTag (last 16 bytes), ciphertext
   - Decrypt with AES-256-GCM
   - Return plaintext or throw on authentication failure

4. **Implement `encryptDEK(dek, password)`**:
   - Derive wrapping key from password using PBKDF2 (`@noble/hashes/pbkdf2`)
   - Salt: 16 random bytes, iterations: 600,000, hash: SHA-256
   - Encrypt DEK with derived key using AES-256-GCM
   - Return `base64(salt + IV + ciphertext + authTag)`

5. **Implement `decryptDEK(encryptedDEK, password)`**:
   - Extract salt, derive key with same PBKDF2 params
   - Decrypt and return DEK
   - Throw descriptive error on wrong password

6. **Implement `splitDEK(dek, shares, threshold)`**:
   - Use `shamir-secret-sharing` library (pure JS, RN-compatible)
   - Convert DEK to Uint8Array, split into `shares` parts with `threshold` reconstruction minimum
   - Return array of base64-encoded share strings

7. **Implement `combineDEK(shares)`**:
   - Decode base64 shares, reconstruct using Shamir
   - Return original DEK string
   - Throw if insufficient shares

8. **Implement `hashPassword(password)`**:
   - Generate 16-byte random salt
   - PBKDF2 with 600,000 iterations, SHA-256
   - Return `base64(salt + hash)` for storage

**Affected Files**:
- `providers/wallet/encryption.ts` — Full rewrite
- `providers/wallet/wallet.ts` — Update calls to match new signatures (if any change)
- `package.json` — New dependencies

**Acceptance Criteria**:
- [ ] `encrypt()` → `decrypt()` round-trip preserves data
- [ ] `encryptDEK()` → `decryptDEK()` round-trip preserves DEK
- [ ] `splitDEK()` → `combineDEK()` round-trip with threshold shares works
- [ ] `combineDEK()` with fewer than threshold shares fails gracefully
- [ ] Wrong password in `decryptDEK()` throws descriptive error
- [ ] All methods work on both iOS and Android
- [ ] No Node.js `crypto` imports (Metro-compatible)

---

### E02: Implement DIDComm Email Verification Protocol

**Current State**:
Auth screen uses mock callbacks with `setTimeout` delays. No real communication with the gateway for email verification.

**Target State**: Native DIDComm protocol messages for email verification, flowing through the existing WebSocket connection to the gateway.

**Protocol Flow**:
```
Wallet                              Gateway
  |                                    |
  |-- EMAIL_VERIFICATION_REQUEST ----->|  (email address)
  |                                    |  → validate, rate-limit, generate code
  |                                    |  → hash code, store in DB
  |                                    |  → send email via Resend/SES
  |<-- EMAIL_VERIFICATION_GRANT -------|  (expires_in: 300)
  |                                    |
  |  [user checks email, enters code]  |
  |                                    |
  |-- EMAIL_VERIFICATION_CONFIRM ----->|  (email, code)
  |                                    |  → hash code, compare with stored
  |<-- EMAIL_VERIFICATION_CONFIRM_RSP -|  (verified: true/false)
  |                                    |
  |  [if verified, proceed to setup]   |
```

**Implementation Steps**:

#### Step 1: Core Protocol Types (`packages/core/src/coralkm-protocol/types.ts`)

1. Add to `CoralKMV01MessageTypes` enum:
   ```typescript
   EMAIL_VERIFICATION_REQUEST = `${CORALKM_PROTOCOL_PREFIX}/email-verification-request`
   EMAIL_VERIFICATION_GRANT = `${CORALKM_PROTOCOL_PREFIX}/email-verification-grant`
   EMAIL_VERIFICATION_DENY = `${CORALKM_PROTOCOL_PREFIX}/email-verification-deny`
   EMAIL_VERIFICATION_CONFIRM = `${CORALKM_PROTOCOL_PREFIX}/email-verification-confirm`
   EMAIL_VERIFICATION_CONFIRM_RESPONSE = `${CORALKM_PROTOCOL_PREFIX}/email-verification-confirm-response`
   ```

2. Add Args interfaces:
   ```typescript
   EmailVerificationRequestArgs   — { type, from, to, email }
   EmailVerificationGrantArgs     — { type, from, to, thid, expires_in }
   EmailVerificationDenyArgs      — { type, from, to, thid, reason? }
   EmailVerificationConfirmArgs   — { type, from, to, email, code }
   EmailVerificationConfirmResponseArgs — { type, from, to, thid, verified }
   ```

3. Add `ICoralKMEmailService` interface:
   ```typescript
   export interface ICoralKMEmailService {
     sendVerificationEmail(email: string, code: string): Promise<void>
   }
   ```

4. Augment `ProtocolMessageRegistry` with 5 new entries

5. Add `verificationStore?` and `emailService?` to `CoralKMOptions`

#### Step 2: Verification Store (`packages/core/src/coralkm-protocol/stores/coralkm-verification-store.ts`)

1. Create `ICoralKMVerificationStore` interface:
   ```typescript
   export interface ICoralKMVerificationStore {
     createVerification(email: string, requesterDid: string, ttlSeconds: number): Promise<string>
     verifyCode(email: string, code: string): Promise<boolean>
     deleteVerification(email: string): Promise<boolean>
     canRequest(requesterDid: string): Promise<boolean>
   }
   ```
   - Store owns code generation and hashing internally (no crypto dependency in handler)

2. Create `MemoryVerificationStore` class:
   - In-memory `Map<string, VerificationRecord>` for dev/testing
   - `createVerification()`: generate 6-digit code, store with hash and TTL
   - `verifyCode()`: check expiry, compare hashed code, increment attempts (max 5)
   - `canRequest()`: rate limit (max 3 requests per 15 minutes per DID)

3. Export from `stores/index.ts` and `coralkm-protocol/index.ts`

#### Step 3: Protocol Handler (`packages/core/src/coralkm-protocol/coralkm-protocol-handler.ts`)

1. Add `verificationStore` and `emailService` private properties
2. Constructor: validate that gateway role with `verificationStore` also has `emailService`
3. Add 5 `createMessage()` switch cases (same pattern as existing NAMESPACE_*, GUARDIAN_*)
4. Add 5 `handle()` switch cases:
   - `email-verification-request` (gateway): rate-limit → create code → send email → return GRANT
   - `email-verification-grant` (wallet): attach decoded metadata `{ expires_in }`, return null
   - `email-verification-deny` (wallet): attach decoded metadata `{ reason }`, return null
   - `email-verification-confirm` (gateway): verify code → return CONFIRM_RESPONSE `{ verified }`
   - `email-verification-confirm-response` (wallet): attach decoded metadata `{ verified }`, return null

#### Step 4: Gateway Implementation (`packages/gateway/`)

1. **D1 Migration** (`migrations/0003_email_verification.sql`):
   ```sql
   CREATE TABLE email_verifications (
     email TEXT PRIMARY KEY,
     hashed_code TEXT NOT NULL,
     requester_did TEXT NOT NULL,
     attempts INTEGER DEFAULT 0,
     created_at TEXT NOT NULL,
     expires_at TEXT NOT NULL
   );
   CREATE TABLE rate_limits (
     requester_did TEXT NOT NULL,
     requested_at TEXT NOT NULL
   );
   CREATE INDEX idx_rate_limits_did ON rate_limits(requester_did);
   ```

2. **D1VerificationStore** (`src/agent/d1-data-store/coralkm/d1-verification-store.ts`):
   - Implements `ICoralKMVerificationStore` using D1 SQL
   - Uses Web Crypto API (`crypto.subtle.digest('SHA-256', ...)`) for hashing — available in Workers runtime
   - 6-digit code generation via `crypto.getRandomValues()`

3. **Email Services** (`src/agent/email-service.ts`):
   - `ConsoleEmailService`: Logs code to console (local dev)
   - `ResendEmailService`: Sends via Resend API using `fetch()` (no npm dependency)

4. **Wire into agent** (`src/agent/agent.ts`):
   - Accept `resendApiKey` and `resendFromAddress` parameters
   - Pass `D1VerificationStore` and email service to protocol constructor

5. **Environment** (`src/env.ts`, `wrangler.toml`):
   - Add `RESEND_API_KEY` and `RESEND_FROM_ADDRESS` to env types
   - Add `.dev.vars` for local secrets

#### Step 5: Wallet-Mobile Integration

1. **Split `wallet.init()`** (`providers/wallet/wallet.ts`):
   - Extract `connect()`: WebSocket connection + mediation only
   - Keep `init()`: namespace/DEK/sync (calls `connect()` if not connected)
   - Add `_isConnected` flag

2. **Add verification methods** (`providers/wallet/wallet.ts`):
   ```typescript
   async requestEmailVerification(email: string): Promise<{ expires_in: number }>
   async confirmEmailVerification(email: string, code: string): Promise<{ verified: boolean }>
   ```
   - Both use `_invokeWithTimeout()` wrapper (15-second timeout via `Promise.race`)

3. **Update provider** (`providers/wallet/provider.tsx`):
   - Change `wallet.init()` → `wallet.connect()` in useEffect
   - Rename `isInitialized` → `isConnected`

4. **Wire auth screen** (`app/index.tsx`):
   - Import `useWallet()` from context
   - `onGetOOBCode`: call `wallet.requestEmailVerification(email)`
   - `onAuthenticate`: call `wallet.confirmEmailVerification(email, code)` → `wallet.init()` → `router.replace('/setup')`

**Important Constraint**: No Node.js `crypto` module in protocol handler (Metro bundler incompatible). All crypto operations must be in the store implementations.

**Affected Files**:
- `packages/core/src/coralkm-protocol/types.ts`
- `packages/core/src/coralkm-protocol/coralkm-protocol-handler.ts`
- `packages/core/src/coralkm-protocol/stores/coralkm-verification-store.ts` (new)
- `packages/core/src/coralkm-protocol/stores/index.ts`
- `packages/core/src/coralkm-protocol/index.ts`
- `packages/gateway/src/agent/agent.ts`
- `packages/gateway/src/agent/d1-data-store/coralkm/d1-verification-store.ts` (new)
- `packages/gateway/src/agent/d1-data-store/coralkm/index.ts`
- `packages/gateway/src/agent/email-service.ts` (new)
- `packages/gateway/src/env.ts`
- `packages/gateway/src/index.ts`
- `packages/gateway/src/websocket-worker.ts`
- `packages/gateway/migrations/0003_email_verification.sql` (new)
- `packages/wallet-mobile/providers/wallet/wallet.ts`
- `packages/wallet-mobile/providers/wallet/provider.tsx`
- `packages/wallet-mobile/app/index.tsx`

**Acceptance Criteria**:
- [ ] Email verification request sends DIDComm message, gateway responds with GRANT
- [ ] OOB code email is received (via Resend in production, console in dev)
- [ ] Code confirmation returns `verified: true` for correct code
- [ ] Rate limiting: max 3 requests per 15 minutes per DID
- [ ] Code expires after 5 minutes (300 seconds)
- [ ] Max 5 verification attempts per code
- [ ] 15-second invoke timeout prevents UI hang
- [ ] TypeScript compiles cleanly in all packages
- [ ] No Node.js `crypto` usage in any Metro-bundled code

---

### E03: Implement Real Authentication Flow

**Current State**:
- `app/_layout.tsx`: `isAuthenticated` is hardcoded to `false`
- `app/index.tsx`: Auth callbacks use mock `setTimeout` delays
- No session persistence — app always shows login on restart
- No token/credential storage

**Target State**: Real authentication state management with secure session persistence.

**Implementation Steps**:

1. **Install secure storage**:
   ```
   npx expo install expo-secure-store
   ```

2. **Create auth service** (`providers/auth/auth-service.ts`):
   - `saveSession(token: string): Promise<void>` — store in SecureStore
   - `getSession(): Promise<string | null>` — retrieve from SecureStore
   - `clearSession(): Promise<void>` — remove from SecureStore
   - `isSessionValid(token: string): Promise<boolean>` — check expiry

3. **Update AuthContext** (`providers/AuthContext.tsx`):
   - Current: exports `AuthProvider` and `useAuth()` hook
   - Add real state management:
     ```typescript
     interface AuthState {
       isAuthenticated: boolean
       isLoading: boolean
       userEmail: string | null
       error: Error | null
     }
     ```
   - `login(email, code)`: call wallet verification → store session → set authenticated
   - `logout()`: clear session → reset state → navigate to index
   - `checkSession()`: called on app start to restore session

4. **Update `_layout.tsx`**:
   - Remove hardcoded `isAuthenticated = false`
   - Use `useAuth()` hook to get real auth state
   - Show loading spinner while checking session
   - Route based on actual auth state

5. **Update `app/index.tsx`**:
   - Wire `onGetOOBCode` and `onAuthenticate` to `useAuth()` methods
   - Remove mock callbacks entirely

6. **Add logout flow**:
   - Profile screen logout button calls `auth.logout()`
   - Clears secure storage and navigates to login

**Affected Files**:
- `providers/AuthContext.tsx` — Major rewrite
- `providers/auth/auth-service.ts` (new)
- `app/_layout.tsx` — Remove hardcoded state
- `app/index.tsx` — Wire real callbacks
- `views/Profile/` — Add logout trigger
- `package.json` — Add `expo-secure-store`

**Acceptance Criteria**:
- [ ] App checks for existing session on startup
- [ ] Valid session → skip login, go to main tabs
- [ ] Expired/no session → show login screen
- [ ] Successful verification → session stored securely
- [ ] Logout clears session and returns to login
- [ ] Session persists across app restarts

---

## High Priority

### E04: Implement Guardian Recovery Protocol

**Current State**:
Guardian recovery has partial UI and state management but uses mock encryption:

- **State machine** in `wallet.ts`: `_currentRecovery` object tracks `{ guardianDID, status, shards }` with statuses `pending → collecting → reconstructing → completed/failed`
- **UI components exist**:
  - `RecoverModal` — Shows recovery progress
  - `RecoverSuccessModal` — Shows success state
  - Connected via `useWallet()` hook which exposes `recoveryStatus`
- **Mock operations**:
  - `splitDEK()` uses string slicing (not real Shamir)
  - `combineDEK()` uses string concatenation
  - `sendRecoveryRequest()` exists but relies on mock encryption

**Target State**: Working guardian recovery with real Shamir's Secret Sharing and DIDComm shard exchange.

**Implementation Steps**:

1. **Real Shamir SSS** (depends on E01):
   - `splitDEK()` and `combineDEK()` in `encryption.ts` must work correctly first
   - Test with various threshold configurations (e.g., 3-of-5, 2-of-3)

2. **Guardian shard distribution**:
   - After DEK creation in setup wizard, split into shares
   - Send each share to a designated guardian via DIDComm encrypted message
   - Store share metadata (which guardian has which share index)

3. **Recovery request flow**:
   - `requestRecovery()`: Send DIDComm recovery request to all guardians
   - `receiveRecoveryShard()`: Handle incoming shards, update `_currentRecovery.shards`
   - `attemptReconstruction()`: When threshold met, combine shares → decrypt DEK

4. **Guardian-side handling**:
   - Receive recovery request → prompt guardian for approval
   - On approval → send stored shard back to requester
   - Guardian must verify requester identity

5. **Recovery state persistence**:
   - Persist `_currentRecovery` to AsyncStorage
   - Resume recovery after app restart
   - Timeout after 24 hours

6. **UI updates**:
   - `RecoverModal`: Show progress bar (X of Y shards collected)
   - Handle timeout and failure states
   - Allow cancellation

**Affected Files**:
- `providers/wallet/encryption.ts` — Real Shamir (from E01)
- `providers/wallet/wallet.ts` — Recovery methods
- `components/containers/RecoverModal/` — UI updates
- `components/containers/RecoverSuccessModal/` — UI updates
- `packages/core/src/coralkm-protocol/types.ts` — Recovery message types (if not already present)

**Acceptance Criteria**:
- [ ] DEK splits into N shares with threshold T
- [ ] Recovery request reaches all guardians
- [ ] Collecting T shards reconstructs correct DEK
- [ ] Fewer than T shards fails gracefully
- [ ] Recovery state survives app restart
- [ ] UI shows accurate progress

---

### E05: WebSocket Reconnection & Offline Queue

**Current State**:
`providers/wallet/websocket-connection.ts` (630 lines):
- No automatic reconnection on disconnect
- No offline message queue
- No heartbeat/ping mechanism
- `invoke()` registers handler in `_replyHandlers` Map keyed by message ID — orphaned if connection drops
- Connection state not exposed to UI

**Target State**: Resilient WebSocket connection with automatic reconnection, offline queuing, and connection state UI.

**Implementation Steps**:

1. **Reconnection logic**:
   - Detect disconnection via WebSocket `onclose` and `onerror` events
   - Implement exponential backoff: 1s → 2s → 4s → 8s → 16s → 30s (max)
   - Add jitter to prevent thundering herd
   - Max reconnection attempts: 10, then surface error to UI
   - Re-authenticate (mediation) after reconnect

2. **Offline message queue**:
   - Queue outgoing messages when disconnected
   - Flush queue in order after reconnection
   - Max queue size: 50 messages (drop oldest)
   - Persist queue to AsyncStorage for app restart scenarios

3. **Heartbeat mechanism**:
   - Send ping every 30 seconds
   - If no pong within 5 seconds, consider connection dead
   - Trigger reconnection

4. **Connection state management**:
   - Add `connectionState` to wallet observable store:
     ```typescript
     type ConnectionState = 'connected' | 'connecting' | 'disconnected' | 'reconnecting'
     ```
   - Expose via `useWallet()` hook
   - UI indicator component (green/yellow/red dot)

5. **Invoke timeout handling**:
   - Clean up orphaned `_replyHandlers` on disconnect
   - Reject pending invokes with `ConnectionLostError`
   - Allow retry after reconnection

**Affected Files**:
- `providers/wallet/websocket-connection.ts` — Major enhancement
- `providers/wallet/wallet.ts` — Expose connection state
- `providers/wallet/hook.ts` — Add `connectionState` to snapshot
- `components/ui/ConnectionIndicator/` (new) — Status UI
- `app/_layout.tsx` — Add connection indicator

**Acceptance Criteria**:
- [ ] Auto-reconnects within 5 seconds of disconnect
- [ ] Messages queued while offline are sent after reconnection
- [ ] UI shows current connection state
- [ ] Pending invokes fail gracefully on disconnect
- [ ] Reconnection re-establishes mediation
- [ ] Exponential backoff prevents server overload

---

### E06: Persist Setup Wizard State

**Current State**:
Setup wizard at `views/SetupWizard/` has 4 steps:
1. **UserStep** — Name and avatar
2. **HouseholdStep** — Household name
3. **EntropyStep** — Seed phrase / randomness
4. **CompleteStep** — Confirmation

Navigation tracked by `currentStep` state (0-3). If user closes app mid-setup, all progress is lost. No persistence between steps.

**Target State**: Setup progress persisted to AsyncStorage, resumable after app restart.

**Implementation Steps**:

1. **Install AsyncStorage** (if not present):
   ```
   npx expo install @react-native-async-storage/async-storage
   ```

2. **Create setup persistence service** (`providers/setup/setup-storage.ts`):
   ```typescript
   interface SetupState {
     currentStep: number
     userData?: { name: string; avatar: string }
     householdData?: { name: string }
     entropyData?: { seedPhrase: string }
     startedAt: string
   }

   saveSetupState(state: SetupState): Promise<void>
   getSetupState(): Promise<SetupState | null>
   clearSetupState(): Promise<void>
   ```

3. **Update SetupWizard view**:
   - On mount: check for saved state, restore if exists
   - On each step completion: persist current state
   - On final step: clear persisted state
   - Add "Resume Setup" prompt if incomplete state found

4. **Update `_layout.tsx` routing**:
   - Check for incomplete setup on app start
   - Route to setup wizard with restored state if found

**Affected Files**:
- `views/SetupWizard/SetupWizard.tsx` — Add persistence
- `providers/setup/setup-storage.ts` (new)
- `app/_layout.tsx` — Check for incomplete setup
- `app/setup.tsx` — Handle restored state

**Acceptance Criteria**:
- [ ] Closing app on step 2 → reopening resumes at step 2 with data intact
- [ ] Completing setup clears persisted state
- [ ] Stale setup state (>24 hours) is discarded
- [ ] No data leakage of seed phrase in plain text (encrypt before storing)

---

### E07: Type Safety Cleanup

**Current State**:
15+ files contain `any` types, reducing TypeScript's ability to catch bugs:

| File | Location | Issue |
|------|----------|-------|
| `providers/wallet/wallet.ts` | Multiple methods | `any` return types, `any` parameters |
| `providers/wallet/websocket-connection.ts` | Message handlers | `any` for DIDComm message bodies |
| `providers/wallet/hook.ts` | Snapshot type | `any` for wallet data |
| `providers/UserContext.tsx` | Context value | `any` for user data |
| `views/SetupWizard/SetupWizard.tsx` | Step data | `any` for step form data |
| `views/Profile/` | Multiple files | `any` for profile data |
| `components/containers/ContactList/` | Contact type | `any` for contact objects |
| `components/containers/CredentialList/` | Credential type | `any` for credential objects |
| `views/AuthScreen/` components | Props | Missing strict types |

**Target State**: Zero `any` types — all replaced with proper interfaces.

**Implementation Steps**:

1. **Define core domain types** (`types/` directory):
   ```typescript
   // types/contact.ts
   interface Contact { did: string; name: string; avatar?: string; ... }

   // types/credential.ts
   interface Credential { id: string; type: string; issuer: string; ... }

   // types/user.ts
   interface UserProfile { name: string; email: string; avatar?: string; ... }

   // types/wallet.ts
   interface WalletSnapshot { contacts: Contact[]; credentials: Credential[]; ... }
   ```

2. **Update providers**:
   - `wallet.ts`: Type all public methods with proper return types
   - `websocket-connection.ts`: Type message handlers with DIDComm message interfaces
   - `hook.ts`: Type snapshot with `WalletSnapshot` interface
   - `UserContext.tsx`: Type context value with `UserProfile`

3. **Update components**:
   - Replace `any` props with specific interfaces
   - Add generic types where needed (e.g., list components)

4. **Enable stricter tsconfig**:
   - Set `"noImplicitAny": true` in `tsconfig.json`
   - Fix all resulting errors

**Affected Files**:
- `types/` directory (new files)
- All 15+ files listed above
- `tsconfig.json` — Enable `noImplicitAny`

**Acceptance Criteria**:
- [ ] `grep -r ": any" src/` returns zero results
- [ ] `tsc --noEmit` passes with `noImplicitAny: true`
- [ ] All public APIs have documented types

---

### E08: Implement Test Suite

**Current State**:
Zero test files in the entire `wallet-mobile` package. No test configuration, no test utilities, no mocks.

**Target State**: Comprehensive test suite covering critical paths with >70% coverage on business logic.

**Implementation Steps**:

1. **Setup testing infrastructure**:
   ```
   npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
   npm install --save-dev @types/jest ts-jest
   ```
   - Configure `jest.config.ts` for React Native + TypeScript
   - Add `__mocks__/` directory for React Native modules
   - Add test scripts to `package.json`

2. **Unit tests — Encryption** (`__tests__/encryption.test.ts`):
   - `encrypt()` / `decrypt()` round-trip
   - `splitDEK()` / `combineDEK()` with various thresholds
   - `encryptDEK()` / `decryptDEK()` round-trip
   - Edge cases: empty input, wrong password, insufficient shares

3. **Unit tests — Wallet** (`__tests__/wallet.test.ts`):
   - Mock WebSocket connection
   - Test `connect()`, `init()`, `requestEmailVerification()`, `confirmEmailVerification()`
   - Test observable store updates
   - Test error handling paths

4. **Unit tests — Protocol Handler** (`packages/core/__tests__/`):
   - Test each `createMessage()` case
   - Test each `handle()` case
   - Test rate limiting in verification store
   - Test code expiry

5. **Component tests**:
   - `AuthScreen` — email submission, code entry, error display
   - `SetupWizard` — step navigation, data persistence
   - `ContactList` — rendering, empty state
   - `CredentialList` — rendering, empty state

6. **Integration tests**:
   - Full auth flow: email → code → verification → setup
   - WebSocket connection lifecycle
   - Guardian recovery flow

7. **CI integration**:
   - Add test step to CI pipeline (if exists)
   - Coverage reporting with threshold enforcement

**Affected Files**:
- `jest.config.ts` (new)
- `__mocks__/` directory (new)
- `__tests__/` directory (new, many files)
- `package.json` — Add test scripts and dev dependencies

**Acceptance Criteria**:
- [ ] `npm test` runs successfully
- [ ] >70% coverage on `providers/wallet/` code
- [ ] >80% coverage on `encryption.ts`
- [ ] All critical user flows have integration tests
- [ ] Tests run in <30 seconds

---

## Medium Priority

### E09: Structured Logging System

**Current State**:
122 `console.*` calls spread across the codebase:
- 51.6% (63 calls) in `websocket-connection.ts` alone
- Mix of `console.log`, `console.error`, `console.warn`
- Inconsistent prefixes: `[WalletProvider]`, `[Wallet.init]`, `[WSConnection]`
- No log levels, no filtering, no remote logging capability
- Development noise in production

**Target State**: Structured logging with levels, filtering, and optional remote transport.

**Implementation Steps**:

1. **Create logger utility** (`utils/logger.ts`):
   ```typescript
   type LogLevel = 'debug' | 'info' | 'warn' | 'error'

   interface Logger {
     debug(message: string, data?: Record<string, unknown>): void
     info(message: string, data?: Record<string, unknown>): void
     warn(message: string, data?: Record<string, unknown>): void
     error(message: string, error?: Error, data?: Record<string, unknown>): void
   }

   function createLogger(namespace: string): Logger
   ```
   - Configurable log level (default: `info` in production, `debug` in dev)
   - Structured output: `[timestamp] [level] [namespace] message { data }`
   - Supports `__DEV__` flag for development-only logging

2. **Replace console calls** across all files:
   ```typescript
   // Before
   console.log('[WSConnection] Connected to', url)

   // After
   const log = createLogger('WSConnection')
   log.info('Connected', { url })
   ```

3. **Add remote transport** (optional, for production):
   - Batched log shipping to analytics endpoint
   - Error-level logs always shipped
   - Configurable via environment

4. **File-by-file replacement**:
   - `websocket-connection.ts` — 63 calls
   - `wallet.ts` — ~20 calls
   - `provider.tsx` — ~8 calls
   - `agent.ts` — ~5 calls
   - Remaining files — ~26 calls

**Affected Files**:
- `utils/logger.ts` (new)
- All 15+ files with `console.*` calls

**Acceptance Criteria**:
- [ ] Zero raw `console.*` calls in codebase
- [ ] Log level filtering works (setting to `warn` suppresses `debug`/`info`)
- [ ] Each log entry includes timestamp, level, namespace
- [ ] Production builds suppress debug-level logs
- [ ] ESLint rule added: `no-console` (with autofix suggestion)

---

### E10: Fix UserProvider Re-render Issue

**Current State**:
`providers/UserContext.tsx` has a `console.log` call **outside** any `useEffect` or `useCallback`:

```typescript
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState(initialUserData)

  console.log('UserProvider render', userData) // ← Runs on EVERY render

  // ...
}
```

This causes:
- Logging on every keystroke in any child component
- Performance degradation from unnecessary console output
- In React StrictMode, double-renders amplify the issue

**Target State**: No unnecessary re-renders, memoized context value.

**Implementation Steps**:

1. **Remove console.log** or move to `useEffect`:
   ```typescript
   useEffect(() => {
     log.debug('UserData updated', userData)
   }, [userData])
   ```

2. **Memoize context value**:
   ```typescript
   const contextValue = useMemo(() => ({
     userData,
     setUserData,
   }), [userData])

   return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
   ```

3. **Type the context properly** (ties into E07):
   ```typescript
   interface UserContextValue {
     userData: UserProfile
     setUserData: (data: UserProfile) => void
   }
   ```

**Affected Files**:
- `providers/UserContext.tsx` — Fix re-render + memoize + type

**Acceptance Criteria**:
- [ ] UserProvider only re-renders when `userData` actually changes
- [ ] Context value is memoized
- [ ] No console.log in render path

---

### E11: Integrate Theme System

**Current State**:
Theme infrastructure exists but is not integrated:
- `constants/Colors.ts` — Defines `light` and `dark` color palettes
- `hooks/useColorScheme.ts` — Detects system theme preference
- `hooks/useThemeColor.ts` — Returns themed color value
- Components use **hardcoded colors** (e.g., `color: '#fff'`, `backgroundColor: '#1a1a2e'`)

**Target State**: All components use theme-aware colors, supporting light/dark mode toggle.

**Implementation Steps**:

1. **Create ThemeProvider** (`providers/ThemeProvider.tsx`):
   ```typescript
   interface ThemeContextValue {
     theme: 'light' | 'dark' | 'system'
     colors: typeof Colors.light
     setTheme: (theme: 'light' | 'dark' | 'system') => void
   }
   ```
   - Persist theme preference to AsyncStorage
   - Default to system preference

2. **Create themed style utility** (`utils/themed-styles.ts`):
   ```typescript
   function createThemedStyles<T>(
     factory: (colors: ColorPalette) => StyleSheet.NamedStyles<T>
   ): () => T
   ```
   - Returns a hook that produces styles based on current theme

3. **Migrate components** (systematic pass):
   - Replace hardcoded color strings with theme tokens
   - Update all `.styles.ts` files to use themed style factory
   - Priority components: Background, AuthScreen, Navigation, Profile

4. **Add theme toggle UI**:
   - Settings screen option for Light / Dark / System
   - Immediate preview on toggle

**Affected Files**:
- `providers/ThemeProvider.tsx` (new)
- `utils/themed-styles.ts` (new)
- `constants/Colors.ts` — Expand color palette if needed
- All `*.styles.ts` files — Migrate to themed styles
- `app/_layout.tsx` — Wrap with ThemeProvider
- `views/Profile/views/ProfileMenu/` — Add theme toggle

**Acceptance Criteria**:
- [ ] App responds to system theme changes
- [ ] Manual theme override persists across restarts
- [ ] Zero hardcoded color values in component files
- [ ] Dark mode is visually complete (no white-on-white or black-on-black)

---

### E12: Error Boundary & Global Error Handling

**Current State**:
No error boundaries. Unhandled errors crash the app with React Native's red screen. No crash reporting.

**Target State**: Graceful error recovery with user-friendly fallback UI and crash reporting.

**Implementation Steps**:

1. **Create ErrorBoundary component** (`components/containers/ErrorBoundary/`):
   ```typescript
   class ErrorBoundary extends React.Component<Props, State> {
     static getDerivedStateFromError(error: Error): State
     componentDidCatch(error: Error, errorInfo: ErrorInfo): void
     render(): React.ReactNode  // Fallback UI or children
   }
   ```
   - Fallback UI: "Something went wrong" with retry button
   - Log error to structured logger (E09)

2. **Create screen-level error boundaries**:
   - Wrap each tab screen in ErrorBoundary
   - Wrap setup wizard in ErrorBoundary
   - Wallet connection errors show reconnection UI

3. **Global unhandled error handler**:
   ```typescript
   ErrorUtils.setGlobalHandler((error, isFatal) => {
     logger.error('Unhandled error', error, { isFatal })
     // Optional: send to crash reporting service
   })
   ```

4. **Promise rejection handler**:
   ```typescript
   // Track unhandled promise rejections
   if (__DEV__) {
     require('promise/setimmediate/rejection-tracking').enable({
       allRejections: true,
       onUnhandled: (id, error) => logger.warn('Unhandled rejection', error),
     })
   }
   ```

**Affected Files**:
- `components/containers/ErrorBoundary/` (new, 4 files per convention)
- `app/_layout.tsx` — Add root ErrorBoundary
- `app/(tabs)/_layout.tsx` — Add per-tab ErrorBoundary
- `utils/error-handler.ts` (new) — Global handler setup

**Acceptance Criteria**:
- [ ] Component error → fallback UI (not crash)
- [ ] Retry button recovers from transient errors
- [ ] Fatal errors logged with full stack trace
- [ ] Error boundaries don't interfere with navigation

---

### E13: Implement Notification System

**Current State**:
`views/Notifications/` exists as a stub screen with placeholder text. No push notification infrastructure.

**Target State**: Working notification system for DIDComm events (new messages, recovery requests, credential offers).

**Implementation Steps**:

1. **Install expo-notifications**:
   ```
   npx expo install expo-notifications expo-device
   ```

2. **Create notification service** (`providers/notifications/notification-service.ts`):
   - Request notification permissions
   - Register for push notifications (Expo push token)
   - Handle foreground notifications
   - Handle notification tap (deep linking)

3. **Define notification types**:
   ```typescript
   type NotificationType =
     | 'new_message'
     | 'recovery_request'
     | 'credential_offer'
     | 'guardian_approval'
     | 'connection_request'
   ```

4. **Wire to DIDComm events**:
   - WebSocket message received → local notification (if app backgrounded)
   - Guardian recovery request → high-priority notification
   - New credential offer → standard notification

5. **Build notifications screen** (`views/Notifications/`):
   - List of past notifications with timestamps
   - Read/unread state
   - Tap to navigate to relevant screen
   - Pull-to-refresh

6. **Badge count**:
   - Show unread count on tab bar
   - Clear on notification screen visit

**Affected Files**:
- `providers/notifications/notification-service.ts` (new)
- `views/Notifications/` — Build real screen
- `providers/wallet/websocket-connection.ts` — Trigger notifications
- `app/(tabs)/_layout.tsx` — Badge count
- `package.json` — New dependencies

**Acceptance Criteria**:
- [ ] Push notification permission requested on first launch
- [ ] DIDComm messages trigger local notifications when app is backgrounded
- [ ] Tapping notification navigates to relevant screen
- [ ] Notification history screen shows all past notifications
- [ ] Badge count updates correctly

---

### E14: Implement Device Management

**Current State**:
`views/Profile/views/ProfileMenu/views/Devices/` exists as a stub screen with "Devices" text only.

**Target State**: View and manage devices linked to the wallet identity.

**Implementation Steps**:

1. **Define device model**:
   ```typescript
   interface LinkedDevice {
     did: string
     name: string
     platform: 'ios' | 'android' | 'web'
     lastSeen: string
     isCurrentDevice: boolean
   }
   ```

2. **Device registration**:
   - On wallet init, register device DID with gateway
   - Include device metadata (platform, model, OS version)

3. **Device list screen** (`views/Profile/views/ProfileMenu/views/Devices/`):
   - List all linked devices
   - Highlight current device
   - Show last activity timestamp
   - Remove device option (with confirmation)

4. **Device sync protocol** (DIDComm):
   - New message type: `DEVICE_REGISTRATION`
   - Gateway maintains device list per identity
   - Sync device list on connection

**Affected Files**:
- `views/Profile/views/ProfileMenu/views/Devices/` — Build real screen
- `providers/wallet/wallet.ts` — Device registration methods
- `packages/core/src/coralkm-protocol/types.ts` — Device message types (future)

**Acceptance Criteria**:
- [ ] Current device shown with "This device" badge
- [ ] All linked devices listed with platform icons
- [ ] Device removal requires confirmation
- [ ] Device list refreshes on screen focus

---

## Low Priority

### E15: Build Stub Screens

**Current State**:
Several screens are placeholder stubs with minimal UI:
- `views/Notifications/` — "Notifications" text only
- `views/Profile/views/ProfileMenu/views/Devices/` — "Devices" text only
- `views/Profile/views/ProfileMenu/views/HelpSupport/` — "Help" text only

**Target State**: Functional screens with real content, even if features behind them aren't fully implemented.

**Implementation Steps**:

1. **Notifications screen** (see E13 for full implementation):
   - Empty state: illustration + "No notifications yet" text
   - List view when notifications exist

2. **Devices screen** (see E14 for full implementation):
   - Empty state: illustration + "Set up device sync" CTA
   - List view when devices registered

3. **Help & Support screen**:
   - FAQ accordion list
   - "Contact Support" button (mailto: or form)
   - App version info
   - Links to documentation
   - Privacy policy and terms links

**Affected Files**:
- `views/Notifications/` — All component files
- `views/Profile/views/ProfileMenu/views/Devices/` — All component files
- `views/Profile/views/ProfileMenu/views/HelpSupport/` — All component files

**Acceptance Criteria**:
- [ ] Each screen has meaningful empty state
- [ ] Help screen has at least 5 FAQ items
- [ ] App version displays correctly
- [ ] Consistent styling with rest of app

---

### E16: QR Scanner Enhancements

**Current State**:
QR scanner at `components/containers/QRScanner/` (102 lines):
- Uses `expo-camera` for scanning
- Used in `AddContactDialog` for adding contacts via DID QR
- Basic implementation — scan and return result

**Target State**: Enhanced QR scanner with better UX and multi-purpose scanning.

**Implementation Steps**:

1. **UX improvements**:
   - Add scanning frame overlay (animated corners)
   - Add torch/flashlight toggle
   - Add "Scan from gallery" option
   - Add haptic feedback on successful scan
   - Add error state for invalid QR codes

2. **Multi-purpose scanning**:
   - DID scanning (existing)
   - Credential offer scanning
   - Connection invitation scanning
   - Auto-detect QR content type and route accordingly

3. **QR code generation**:
   - Generate QR for own DID (share contact)
   - Generate QR for connection invitation
   - Display in Profile screen

**Affected Files**:
- `components/containers/QRScanner/` — Enhanced component
- `views/Profile/` — Add "My QR Code" section
- `package.json` — QR generation library

**Acceptance Criteria**:
- [ ] Scanning frame with animated corners
- [ ] Torch toggle works
- [ ] Gallery import works
- [ ] Invalid QR shows error message
- [ ] Own DID QR code displays in profile

---

### E17: Biometric Authentication

**Current State**:
No biometric authentication. App has no local device authentication.

**Target State**: Optional biometric lock (Face ID / fingerprint) for app access and sensitive operations.

**Implementation Steps**:

1. **Install expo-local-authentication**:
   ```
   npx expo install expo-local-authentication
   ```

2. **Create biometric service** (`providers/auth/biometric-service.ts`):
   - Check device capability (face, fingerprint, none)
   - Prompt for biometric authentication
   - Fallback to device PIN/password

3. **App lock**:
   - Optional setting in Privacy & Security
   - Prompt on app foreground (after background >30 seconds)
   - Configurable timeout

4. **Sensitive operation protection**:
   - Require biometric for: viewing recovery phrase, exporting keys, removing guardian
   - Optional for: sending messages, approving credentials

**Affected Files**:
- `providers/auth/biometric-service.ts` (new)
- `views/Profile/views/ProfileMenu/views/PrivacySecurity/` — Add biometric toggle
- `app/_layout.tsx` — Add app lock check
- `package.json` — New dependency

**Acceptance Criteria**:
- [ ] Face ID / fingerprint prompt on app open (when enabled)
- [ ] Fallback to device passcode
- [ ] Setting persists across restarts
- [ ] Sensitive operations require biometric confirmation

---

### E18: Accessibility Audit

**Current State**:
No accessibility labels, roles, or hints on any components. No screen reader support.

**Target State**: WCAG 2.1 AA compliance for React Native.

**Implementation Steps**:

1. **Add accessibility props to all interactive components**:
   ```typescript
   <TouchableOpacity
     accessibilityLabel="Send message"
     accessibilityRole="button"
     accessibilityHint="Sends the composed message to the selected contact"
   />
   ```

2. **Screen reader navigation**:
   - Logical focus order on each screen
   - Skip navigation landmarks
   - Announce screen transitions

3. **Visual accessibility**:
   - Minimum touch target: 44x44 points
   - Color contrast ratio ≥ 4.5:1 for text
   - Support dynamic type / font scaling
   - Ensure no information conveyed by color alone

4. **Testing**:
   - Test with VoiceOver (iOS) and TalkBack (Android)
   - Use Accessibility Inspector
   - Test with increased font size (200%)

**Affected Files**:
- All component `.tsx` files — Add accessibility props
- All `.styles.ts` files — Ensure minimum touch targets
- `constants/Colors.ts` — Verify contrast ratios

**Acceptance Criteria**:
- [ ] All buttons have `accessibilityLabel` and `accessibilityRole`
- [ ] All inputs have `accessibilityLabel`
- [ ] Screen reader can navigate all screens
- [ ] Touch targets ≥ 44x44 points
- [ ] Color contrast ≥ 4.5:1

---

### E19: Performance Optimization

**Current State**:
No performance profiling done. Potential issues:
- UserProvider re-renders on every keystroke (E10)
- No list virtualization observed in contact/credential lists
- No image caching for avatars
- WebSocket connection established eagerly (even on login screen)

**Target State**: Smooth 60fps UI with optimized rendering and data loading.

**Implementation Steps**:

1. **Profile with React DevTools Profiler**:
   - Identify unnecessary re-renders
   - Identify slow components

2. **Memoization pass**:
   - `React.memo()` on pure presentational components
   - `useMemo()` for expensive computations
   - `useCallback()` for event handlers passed as props

3. **List optimization**:
   - Ensure `FlatList` with proper `keyExtractor` and `getItemLayout`
   - Add `windowSize` and `maxToRenderPerBatch` tuning
   - Implement placeholder/skeleton loading

4. **Image optimization**:
   - Use `expo-image` (optimized) instead of `Image`
   - Cache avatars and images
   - Proper image sizing (no oversized downloads)

5. **Lazy loading**:
   - Lazy import heavy screens
   - Defer non-critical initialization

**Affected Files**:
- Various component files — Add memoization
- List components — Optimization props
- `package.json` — `expo-image` if not present

**Acceptance Criteria**:
- [ ] No unnecessary re-renders in React Profiler
- [ ] Lists scroll at 60fps with 100+ items
- [ ] App startup time < 3 seconds
- [ ] Memory usage stable (no leaks in long sessions)

---

### E20: Developer Experience & Documentation

**Current State**:
- No README in `wallet-mobile/`
- No contribution guidelines
- No architecture documentation
- No component storybook

**Target State**: Comprehensive developer documentation and tooling.

**Implementation Steps**:

1. **README.md**:
   - Project overview and architecture
   - Setup instructions (prerequisites, install, run)
   - Project structure explanation
   - Available scripts
   - Environment variables

2. **Architecture doc** (`docs/architecture.md`):
   - Component hierarchy diagram
   - State management flow (Context + ObservableStore)
   - DIDComm protocol integration
   - Navigation structure

3. **Code conventions doc** (`docs/conventions.md`):
   - Component structure (4-file pattern)
   - Naming conventions
   - Import ordering
   - State management patterns

4. **ESLint & Prettier config**:
   - Enforce code conventions
   - `no-console` rule (use logger)
   - `no-explicit-any` rule
   - Import ordering rule

5. **Husky pre-commit hooks**:
   - Lint staged files
   - Run affected tests
   - Type check

**Affected Files**:
- `README.md` (new)
- `docs/` directory (new)
- `.eslintrc.js` — Enhanced rules
- `.prettierrc` — If not present
- `package.json` — Husky + lint-staged

**Acceptance Criteria**:
- [ ] New developer can set up project in < 15 minutes following README
- [ ] Architecture diagram is accurate and up-to-date
- [ ] ESLint catches `any` types and `console.*` calls
- [ ] Pre-commit hooks prevent lint errors from being committed

---

## Implementation Order (Recommended)

The following order respects dependencies between enhancements:

### Phase 1: Foundation (Weeks 1-2)
1. **E07** — Type Safety Cleanup (unblocks clean development)
2. **E10** — Fix UserProvider Re-renders (quick win)
3. **E09** — Structured Logging (replace all console.* before adding new code)

### Phase 2: Security Core (Weeks 3-4)
4. **E01** — Real Encryption (blocks E04, E06)
5. **E08** — Test Suite Setup (start writing tests alongside features)

### Phase 3: Auth & Communication (Weeks 5-6)
6. **E02** — DIDComm Email Verification (blocks E03)
7. **E03** — Real Authentication Flow (depends on E02)
8. **E05** — WebSocket Reconnection (independent, high impact)

### Phase 4: Features (Weeks 7-8)
9. **E04** — Guardian Recovery (depends on E01)
10. **E06** — Persist Setup Wizard (depends on E01 for encrypting seed)
11. **E12** — Error Boundary (catch errors from new features)

### Phase 5: UX Polish (Weeks 9-10)
12. **E11** — Theme System Integration
13. **E13** — Notification System
14. **E14** — Device Management
15. **E15** — Build Stub Screens

### Phase 6: Hardening (Weeks 11-12)
16. **E16** — QR Scanner Enhancements
17. **E17** — Biometric Authentication
18. **E18** — Accessibility Audit
19. **E19** — Performance Optimization
20. **E20** — Developer Experience & Documentation

---

## Dependencies Graph

```
E07 (Type Safety) ──────────────────────────┐
E10 (UserProvider Fix) ─────────────────────┤
E09 (Logging) ──────────────────────────────┤
                                            ├──→ E08 (Tests)
E01 (Encryption) ──→ E04 (Guardian Recovery)│
                 ──→ E06 (Setup Persist)    │
                                            │
E02 (Email Verify) ──→ E03 (Auth Flow) ────┘

E05 (WebSocket) ──→ E13 (Notifications)
                ──→ E14 (Device Management)

E11 (Theme) ──→ E18 (Accessibility)
            ──→ E19 (Performance)

E09 (Logging) ──→ E12 (Error Boundary)
```

---

## Notes

- All new files must follow the established 4-file component pattern: `Name.interfaces.ts`, `Name.styles.ts`, `Name.tsx`, `index.ts`
- No Node.js `crypto` module in any Metro-bundled code — use `expo-crypto`, `@noble/ciphers`, or Web Crypto API
- Test on both iOS and Android for each enhancement
- Keep bundle size impact minimal — prefer lightweight dependencies
- All DIDComm protocol additions must be added to `packages/core` first, then consumed in `wallet-mobile`
