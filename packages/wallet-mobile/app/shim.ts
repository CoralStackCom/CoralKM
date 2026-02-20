// IMPORTANT: react-native-get-random-values MUST be imported FIRST
// before any other imports that might use crypto
import 'react-native-get-random-values'

import { polyfillWebCrypto } from 'expo-standard-web-crypto'
import { TextDecoder, TextEncoder } from 'text-encoding'

// 1. Polyfill Buffer (Fixes the .length error)
global.Buffer = require('buffer').Buffer

// 2. Polyfill Process
global.process = require('process')

// 3. Polyfill WebCrypto
polyfillWebCrypto()

// 4. Ensure crypto.getRandomValues is available globally
// This is critical for Veramo and other crypto libraries
if (typeof global.crypto === 'undefined') {
  ;(global as any).crypto = {}
}

// If getRandomValues is still not defined after polyfillWebCrypto,
// use the one from react-native-get-random-values
if (typeof global.crypto.getRandomValues === 'undefined') {
  // react-native-get-random-values should have set this up
  // but we ensure it's available
  const getRandomValues = (array: ArrayBufferView) => {
    const bytes = require('react-native-get-random-values').getRandomValues(array)
    return bytes
  }
  global.crypto.getRandomValues = getRandomValues
}

// 5. Polyfill TextEncoder/TextDecoder
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder
}

// 6. Verify crypto.getRandomValues is working
try {
  const testArray = new Uint8Array(8)
  global.crypto.getRandomValues(testArray)
  console.log('✅ Shim loaded: Buffer, Process, Crypto, and getRandomValues ready.')
} catch (e) {
  console.error('❌ Shim Error: crypto.getRandomValues failed:', (e as Error).message)
}
