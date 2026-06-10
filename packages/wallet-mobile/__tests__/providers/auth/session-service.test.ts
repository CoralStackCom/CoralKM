/**
 * Tests for SessionService — the real login/unlock session recorder that powers
 * the Login Activity screen. Uses a stateful in-memory SecureStore mock.
 */
jest.mock('expo-secure-store', () => {
  const store = new Map<string, string>()
  return {
    getItemAsync: jest.fn(async (k: string) => (store.has(k) ? store.get(k)! : null)),
    setItemAsync: jest.fn(async (k: string, v: string) => {
      store.set(k, v)
    }),
    deleteItemAsync: jest.fn(async (k: string) => {
      store.delete(k)
    }),
  }
})

import { SessionService } from '@/providers/auth/session-service'

describe('SessionService', () => {
  beforeEach(async () => {
    await SessionService.clear()
  })

  it('records a session with method, platform and timestamp', async () => {
    const s = await SessionService.record('biometric', 'Test Phone')
    expect(s.method).toBe('biometric')
    expect(s.device).toBe('Test Phone')
    expect(typeof s.platform).toBe('string')
    expect(s.id).toBeTruthy()
    expect(() => new Date(s.timestamp).toISOString()).not.toThrow()
  })

  it('returns sessions most-recent-first', async () => {
    await SessionService.record('login', 'A')
    await SessionService.record('biometric', 'B')
    const all = await SessionService.getAll()
    expect(all).toHaveLength(2)
    expect(all[0].device).toBe('B')
    expect(all[1].device).toBe('A')
  })

  it('caps history at 20 entries', async () => {
    for (let i = 0; i < 25; i++) {
      await SessionService.record('biometric', `D${i}`)
    }
    const all = await SessionService.getAll()
    expect(all).toHaveLength(20)
    expect(all[0].device).toBe('D24')
  })

  it('clear() empties the history', async () => {
    await SessionService.record('login')
    await SessionService.clear()
    expect(await SessionService.getAll()).toEqual([])
  })
})
