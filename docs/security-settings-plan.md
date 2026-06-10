# Security Settings — Real Functionality Plan

## Goal
Merge **Settings** + **Privacy & Security** into one **Security** screen, drop the
app-generated PIN in favor of **device biometrics**, and make each control do
something real and phone-integrated.

## Model
- **Factor 1**: email sign-in code (existing).
- **Factor 2 (new)**: biometric / device-auth to *open the wallet*. This is what
  "Two-Factor Authentication" means in the UI — enabling it turns on the app lock.
- No app PIN is generated. `expo-local-authentication` is used with
  `disableDeviceFallback: false`, so if biometrics fail the OS shows the phone's
  own passcode — the device owns the secret, not the app.

## Changes
1. **AuthContext** → biometric-first:
   - `enableAuth()` (no passcode) — gated by a successful biometric prompt.
   - `disableAuth()` — gated by biometric.
   - `unlock()` — biometric; on success records a login session + fires a login
     alert (if enabled).
   - Remove passcode storage + `verifyPasscode`.
2. **UnlockScreen** → biometric-only (OS passcode fallback), no keypad.
3. **session-service** → records login sessions (timestamp, device, platform,
   method) in SecureStore (last 20); powers **Login Activity**.
4. **Login Alerts** → on each unlock, if the preference is on, push a `system`
   notification ("New sign-in · device · time").
5. **Login Activity** → new screen listing real recorded sessions.
6. **Download Your Data** → exports user + household + preferences + devices +
   login sessions via the share sheet.
7. Remove **Change Password** and the separate **Biometric Login** toggle (folded
   into the 2FA/app-lock toggle).
8. **Menu** → single "Security" entry; the old `/ProfileMenu/Settings` route
   redirects to it.
