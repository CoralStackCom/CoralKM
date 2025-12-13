// 📁 shim.js
import { polyfillWebCrypto } from 'expo-standard-web-crypto'
import 'react-native-get-random-values'
import { TextDecoder, TextEncoder } from 'text-encoding'

// 1. Polyfill Buffer (Fixes the .length error)
global.Buffer = require('buffer').Buffer

// 2. Polyfill Process
global.process = require('process')

// 3. Polyfill WebCrypto
polyfillWebCrypto()

// 4. Polyfill TextEncoder
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder
}

console.log('✅ Shim loaded: Buffer, Process, and Crypto ready.')
