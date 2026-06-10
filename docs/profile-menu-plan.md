# Profile Menu — Real Data & Functionality Plan

> Goal: replace mock/ephemeral state in the Profile menu with **real, persisted,
> on-device data** so settings survive reloads and the screens reflect the actual
> user. Fully offline-capable (no gateway dependency) using `expo-secure-store`.

## Analysis — current state of each menu item

| Item | Screen | Data source today | Status |
|---|---|---|---|
| Profile (main) | `ProfileScreen` | `UserContext` — **hardcoded "John Doe", not persisted** | ❌ mock |
| Settings (App Lock) | `Settings` | `AuthContext` + SecureStore | ✅ real |
| Privacy & Security | `PrivacyScreen` | Biometric = real; **2FA/Login-Alerts = local `useState`**; actions = `Alert` stubs | ⚠️ partial |
| Notifications | `NotificationsScreen` | **8 toggles = local `useState`**, not persisted | ❌ mock |
| Appearance | `AppearanceScreen` | `ThemeProvider` — **mode not persisted** | ⚠️ not persisted |
| Devices | `DevicesScreen` | `DeviceService` — local, **no real device, list not persisted** | ❌ mock |
| Help & Support | `HelpScreen` | Static FAQ + `Linking` (acceptable) | ✅ ok |
| Log Out | `ProfileMenu` | `UserContext.logout` only | ⚠️ incomplete |

Real data already flows in from **EmailForm** (`setUser({email})`) and **Setup**
(`setUser({firstName,lastName,avatar})`, `updateHousehold(...)`, `setEncryptionSeed`)
— it was just being overwritten by the mock default and discarded on reload.

## Plan

1. **`lib/storage.ts`** — typed JSON helper over `expo-secure-store` (`getJSON`/`setJSON`/`removeItem`/`clearAll`).
2. **`providers/preferences/`** — `PreferencesProvider` + `usePreferences()` holding notification
   prefs (push, email, budget, weekly/monthly reports, household, security, marketing) and
   privacy prefs (twoFactor, loginAlerts). Write-through persistence; hydrate on mount.
   Mounted in `_layout.tsx`.
3. **`UserContext`** — remove the John Doe default; hydrate user/household/seed from SecureStore
   on mount; write-through persist on every setter; `logout()` wipes all stored app data.
4. **`ThemeProvider`** — persist `mode`; hydrate on mount.
5. **Wire screens** — `NotificationsScreen` and `PrivacyScreen` toggles read/write `usePreferences`
   instead of local `useState`.
6. **Devices** — persist the device list and a stable current-device id; register the real current
   device (platform + name) on first run.
7. **Privacy/Help actions made real** — Download Data → JSON export via `Share`; Delete Account →
   wipe local data + logout + route to `/`; Login Activity → real persisted last-active.

## Notes / boundaries

- Gateway-backed cross-device sync (server device list, account deletion on server) is a
  documented follow-up; this change makes the **mobile** side real and persistent.
- All persistence uses SecureStore (already the app's secure store for passcode/biometric).
