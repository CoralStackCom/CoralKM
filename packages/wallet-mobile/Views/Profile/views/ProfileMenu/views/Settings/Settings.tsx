import { Redirect } from 'expo-router'
import React from 'react'

/**
 * Settings has been merged into the Security screen (Privacy & Security).
 * This component redirects any remaining navigation there.
 */
export const Settings: React.FC = () => {
  return <Redirect href="/ProfileMenu/Privacy" />
}

export default Settings
