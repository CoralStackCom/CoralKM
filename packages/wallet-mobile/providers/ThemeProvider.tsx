import { Colors } from '@/constants/theme'
import { getJSON, setJSON, StorageKeys } from '@/lib/storage'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useColorScheme as useSystemColorScheme } from 'react-native'

type ThemeMode = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

interface ThemeContextValue {
  mode: ThemeMode
  theme: ResolvedTheme
  colors: typeof Colors.light
  setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

/**
 * ThemeProvider component.
 * Provides theme context with light/dark mode support.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useSystemColorScheme()
  const [mode, setModeState] = useState<ThemeMode>('system')

  // Hydrate the saved theme preference on mount.
  useEffect(() => {
    let active = true
    ;(async () => {
      const saved = await getJSON<ThemeMode>(StorageKeys.themeMode)
      if (active && (saved === 'light' || saved === 'dark' || saved === 'system')) {
        setModeState(saved)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const resolvedTheme: ResolvedTheme = useMemo(() => {
    if (mode === 'system') return systemScheme === 'dark' ? 'dark' : 'light'
    return mode
  }, [mode, systemScheme])

  const colors = useMemo(() => Colors[resolvedTheme], [resolvedTheme])

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode)
    void setJSON(StorageKeys.themeMode, newMode)
  }, [])

  const value = useMemo(
    () => ({ mode, theme: resolvedTheme, colors, setMode }),
    [mode, resolvedTheme, colors, setMode]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/**
 * Hook to access current theme context.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
