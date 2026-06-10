import { clearAppData, getJSON, setJSON, StorageKeys } from '@/lib/storage'
import * as Crypto from 'expo-crypto'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar: string
}

export interface Household {
  name: string
  country: string
  currency: string
  logo: string
}

export interface UserContextData {
  user: User | null
  household: Household | null
  encryptionSeed: string | null
  /** True until persisted profile data has been loaded from storage. */
  isLoading: boolean
  setUser: (user: User) => void
  setHousehold: (household: Household) => void
  setEncryptionSeed: (seed: string) => void
  updateUser: (updates: Partial<User>) => void
  updateHousehold: (updates: Partial<Household>) => void
  logout: () => Promise<void>
}

const UserContext = createContext<UserContextData | undefined>(undefined)

/**
 * UserProvider.
 *
 * Holds the authenticated user's profile, household, and encryption seed.
 * Real data flows in from the login (`EmailForm`) and setup flow
 * (`SetupUserStep` / `SetupHouseholdStep`); this provider persists it to
 * SecureStore and rehydrates on launch, so the Profile screen shows the real
 * account rather than a mock and survives app reloads.
 */
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null)
  const [household, setHouseholdState] = useState<Household | null>(null)
  const [encryptionSeed, setEncryptionSeedState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Hydrate persisted profile on mount.
  useEffect(() => {
    let active = true
    ;(async () => {
      const [storedUser, storedHousehold, storedSeed] = await Promise.all([
        getJSON<User>(StorageKeys.user),
        getJSON<Household>(StorageKeys.household),
        getJSON<string>(StorageKeys.encryptionSeed),
      ])
      if (!active) return
      if (storedUser) setUserState(storedUser)
      if (storedHousehold) setHouseholdState(storedHousehold)
      if (storedSeed) setEncryptionSeedState(storedSeed)
      setIsLoading(false)
    })()
    return () => {
      active = false
    }
  }, [])

  const setUser = useCallback((userData: User) => {
    setUserState(userData)
    void setJSON(StorageKeys.user, userData)
  }, [])

  const setHousehold = useCallback((householdData: Household) => {
    setHouseholdState(householdData)
    void setJSON(StorageKeys.household, householdData)
  }, [])

  const setEncryptionSeed = useCallback((seed: string) => {
    setEncryptionSeedState(seed)
    void setJSON(StorageKeys.encryptionSeed, seed)
  }, [])

  const updateUser = useCallback((updates: Partial<User>) => {
    setUserState((prev) => {
      const next = prev ? { ...prev, ...updates } : ({ ...updates } as User)
      // Ensure a stable account id exists once any profile field is set, so the
      // rest of the app can rely on `user.id`.
      if (!next.id) next.id = Crypto.randomUUID()
      void setJSON(StorageKeys.user, next)
      return next
    })
  }, [])

  const updateHousehold = useCallback((updates: Partial<Household>) => {
    setHouseholdState((prev) => {
      const next = prev ? { ...prev, ...updates } : ({ ...updates } as Household)
      void setJSON(StorageKeys.household, next)
      return next
    })
  }, [])

  const logout = useCallback(async () => {
    setUserState(null)
    setHouseholdState(null)
    setEncryptionSeedState(null)
    await clearAppData()
  }, [])

  const contextValue = useMemo(
    () => ({
      user,
      household,
      encryptionSeed,
      isLoading,
      setUser,
      setHousehold,
      setEncryptionSeed,
      updateUser,
      updateHousehold,
      logout,
    }),
    [
      user,
      household,
      encryptionSeed,
      isLoading,
      setUser,
      setHousehold,
      setEncryptionSeed,
      updateUser,
      updateHousehold,
      logout,
    ]
  )

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
}

export const useUserContext = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider')
  }
  return context
}
