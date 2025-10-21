import React from 'react'

import type { Wallet } from './wallet'

export const WalletContext = React.createContext<Wallet | undefined>(undefined)
