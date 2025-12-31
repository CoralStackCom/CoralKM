import { createContext, useContext, useState, type ReactNode } from 'react'

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

  const setUser = (userData: User) => {
    setUserState(userData)
  }

  const setHousehold = (householdData: Household) => {
    setHouseholdState(householdData)
  }

  const setEncryptionSeed = (seed: string) => {
    setEncryptionSeedState(seed)
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUserState({ ...user, ...updates })
    }
  }

  const updateHousehold = (updates: Partial<Household>) => {
    if (household) {
      setHouseholdState({ ...household, ...updates })
    }
  }

  const logout = () => {
    setUserState({} as User)
    setHouseholdState(null)
    setEncryptionSeedState(null)
  }
  console.log('UserProvider Render: ', { user, household, encryptionSeed })
  return (
    <UserContext.Provider
      value={{
        user,
        household,
        encryptionSeed,
        setUser,
        setHousehold,
        setEncryptionSeed,
        updateUser,
        updateHousehold,
        logout,
      }}
    >
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
