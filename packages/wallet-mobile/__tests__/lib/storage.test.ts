/**
 * Tests for the SecureStore-backed JSON persistence helper that underpins the
 * Profile menu's real (non-mock) data. Uses a stateful in-memory SecureStore
 * mock so round-trips can be asserted.
 */
jest.mock('expo-secure-store', () => {
  const store = new Map<string, string>()
  return {
    __store: store,
    getItemAsync: jest.fn(async (k: string) => (store.has(k) ? store.get(k)! : null)),
    setItemAsync: jest.fn(async (k: string, v: string) => {
      store.set(k, v)
    }),
    deleteItemAsync: jest.fn(async (k: string) => {
      store.delete(k)
    }),
  }
})

import { clearAppData, getJSON, removeItem, setJSON, StorageKeys } from '@/lib/storage'

describe('lib/storage', () => {
  it('round-trips a JSON object', async () => {
    const value = { firstName: 'Ada', count: 3, nested: { ok: true } }
    await setJSON(StorageKeys.user, value)
    expect(await getJSON<typeof value>(StorageKeys.user)).toEqual(value)
  })

  it('returns null for a missing key', async () => {
    expect(await getJSON('coralkm.does-not-exist')).toBeNull()
  })

  it('removes a single key', async () => {
    await setJSON(StorageKeys.themeMode, 'dark')
    await removeItem(StorageKeys.themeMode)
    expect(await getJSON(StorageKeys.themeMode)).toBeNull()
  })

  it('clearAppData removes every app-managed key', async () => {
    await setJSON(StorageKeys.user, { id: '1' })
    await setJSON(StorageKeys.household, { name: 'Home' })
    await setJSON(StorageKeys.preferences, { a: 1 })
    await clearAppData()
    expect(await getJSON(StorageKeys.user)).toBeNull()
    expect(await getJSON(StorageKeys.household)).toBeNull()
    expect(await getJSON(StorageKeys.preferences)).toBeNull()
  })

  it('returns null (not throw) when stored value is not valid JSON', async () => {
    const SecureStore = require('expo-secure-store')
    await SecureStore.setItemAsync(StorageKeys.encryptionSeed, 'not-json{')
    expect(await getJSON(StorageKeys.encryptionSeed)).toBeNull()
  })
})
