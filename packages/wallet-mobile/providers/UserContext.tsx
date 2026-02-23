import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

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
  setUser: (user: User) => void
  setHousehold: (household: Household) => void
  setEncryptionSeed: (seed: string) => void
  updateUser: (updates: Partial<User>) => void
  updateHousehold: (updates: Partial<Household>) => void
  logout: () => void
}

const UserContext = createContext<UserContextData | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>({
    id: '1',
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    avatar: '',
  })
  const [household, setHouseholdState] = useState<Household | null>({
    name: 'The Doe Household',
    country: 'USA',
    currency: 'USD',
    logo: '',
  })
  const [encryptionSeed, setEncryptionSeedState] = useState<string | null>('sample-seed-12345')

  const setUser = useCallback((userData: User) => {
    setUserState(userData)
  }, [])

  const setHousehold = useCallback((householdData: Household) => {
    setHouseholdState(householdData)
  }, [])

  const setEncryptionSeed = useCallback((seed: string) => {
    setEncryptionSeedState(seed)
  }, [])

  const updateUser = useCallback((updates: Partial<User>) => {
    setUserState((prev) => (prev ? { ...prev, ...updates } : prev))
  }, [])

  const updateHousehold = useCallback((updates: Partial<Household>) => {
    setHouseholdState((prev) => (prev ? { ...prev, ...updates } : prev))
  }, [])

  const logout = useCallback(() => {
    setUserState({} as User)
    setHouseholdState(null)
    setEncryptionSeedState(null)
  }, [])

  const contextValue = useMemo(
    () => ({
      user,
      household,
      encryptionSeed,
      setUser,
      setHousehold,
      setEncryptionSeed,
      updateUser,
      updateHousehold,
      logout,
    }),
    [user, household, encryptionSeed, setUser, setHousehold, setEncryptionSeed, updateUser, updateHousehold, logout]
  )

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider')
  }
  return context
}
