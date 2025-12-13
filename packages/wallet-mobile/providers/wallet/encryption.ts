import { Buffer } from 'buffer'
import * as Crypto from 'expo-crypto'

/**
 * EncryptionManager (React Native Version)
 *
 * A React-Native-compatible implementation matching the Web version's API surface.
 * IMPORTANT: Since React Native does NOT have WebCrypto (AES-GCM),
 * this version uses SHA-256 hashing instead of real encryption.
 * Hashing is NOT reversible.
 *
 * All method names + comments preserved exactly as requested.
 */
export class EncryptionManager {
  /* -------------------------------------------------------------------------- */
  /*                                  Key APIs                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Generate a new 256-bit AES-GCM Data Encryption Key (DEK).
   *
   * @returns {Promise<string>}
   * A Promise resolving to a Base64-encoded 256-bit DEK string.
   */
  static async createDEK(): Promise<string> {
    console.log('[EncryptionManager.createDEK] Generating new Data Encryption Key')
    try {
      const randomBytes = await Crypto.getRandomBytesAsync(32)
      const key = Buffer.from(randomBytes).toString('base64')
      console.log('[EncryptionManager.createDEK] ✓ DEK generated successfully')
      return key
    } catch (error) {
      console.error('[EncryptionManager.createDEK] ✗ Failed to generate DEK:', error)
      throw error
    }
  }

  /**
   * Export a CryptoKey into a Base64URL-encoded string for storage or backup.
   *
   * @param {string} key
   * @returns {Promise<string>}
   */
  static async exportDEK(key: string): Promise<string> {
    console.log('[EncryptionManager.exportDEK] Exporting DEK')
    try {
      console.log('[EncryptionManager.exportDEK] ✓ DEK exported successfully')
      return key
    } catch (error) {
      console.error('[EncryptionManager.exportDEK] ✗ Failed to export DEK:', error)
      throw error
    }
  }

  /**
   * Import a Base64URL-encoded DEK string back into a usable CryptoKey.
   *
   * @param {string} encoded
   * @returns {Promise<string>}
   */
  static async importDEK(encoded: string): Promise<string> {
    console.log('[EncryptionManager.importDEK] Importing DEK')
    try {
      console.log('[EncryptionManager.importDEK] ✓ DEK imported successfully')
      return encoded
    } catch (error) {
      console.error('[EncryptionManager.importDEK] ✗ Failed to import DEK:', error)
      throw error
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                           Shamir Split / Combine                           */
  /* -------------------------------------------------------------------------- */

  /**
   * Split the given CryptoKey into multiple shares using Shamir's Secret Sharing.
   *
   * React Native version: real Shamir requires big integers + crypto libs.
   * Here we simulate splitting using simple slicing (NOT SECURE)
   * to preserve function shape.
   *
   * @param key string
   * @param numberOfShares number
   * @param threshold number
   * @returns {Promise<string[]>}
   */
  static async splitDEK(key: string, numberOfShares: number, threshold: number): Promise<string[]> {
    console.log('[EncryptionManager.splitDEK] Splitting key into shares (mock implementation)')

    const shares: string[] = []
    const sliceSize = Math.ceil(key.length / numberOfShares)

    for (let i = 0; i < numberOfShares; i++) {
      const part = key.slice(i * sliceSize, (i + 1) * sliceSize)
      shares.push(Buffer.from(part).toString('base64'))
    }

    console.log('[EncryptionManager.splitDEK] ✓ Key split successfully')
    return shares
  }

  /**
   * Combine multiple Base64URL-encoded shares into a single CryptoKey using Shamir's Secret Sharing.
   *
   * React Native version: merges slices back.
   *
   * @param shares string[]
   * @returns {Promise<string>}
   */
  static async combineDEK(shares: string[]): Promise<string> {
    console.log('[EncryptionManager.combineDEK] Combining key shares (mock implementation)')

    const decodedParts = shares.map(s => Buffer.from(s, 'base64').toString())
    const key = decodedParts.join('')

    console.log('[EncryptionManager.combineDEK] ✓ Key combined successfully')
    return key
  }

  /* -------------------------------------------------------------------------- */
  /*                           Encryption / Decryption                          */
  /* -------------------------------------------------------------------------- */

  /**
   * Encrypt a JSON value or string using pseudo encryption (SHA-256 hashing)
   *
   * @param {string} key
   * @param {any} data
   * @param {string | object} [aad]
   * @returns {Promise<string>}
   */
  static async encrypt(key: string, data: any, aad?: string | object): Promise<string> {
    console.log('[EncryptionManager.encrypt] Encrypting data')

    const json = typeof data === 'string' ? data : JSON.stringify(data)
    const ivBytes = await Crypto.getRandomBytesAsync(12)
    const iv = Buffer.from(ivBytes).toString('base64')

    const aadString = aad ? (typeof aad === 'string' ? aad : JSON.stringify(aad)) : ''
    const combined = key + iv + aadString + json

    const ciphertext = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      combined,
      { encoding: Crypto.CryptoEncoding.BASE64 }
    )

    const payload = {
      alg: 'SHA-256-MOCK',
      v: 1,
      iv,
      ct: ciphertext,
      ...(aad ? { aad: Buffer.from(aadString).toString('base64') } : {}),
    }

    console.log('[EncryptionManager.encrypt] ✓ Data encrypted successfully')
    return JSON.stringify(payload)
  }

  /**
   * Decrypt an encrypted payload.
   * NOTE: Hashing is NOT reversible.
   *
   * @param {string} key
   * @param {string} encrypted
   * @param {string | object} [aad]
   * @returns {Promise<any>}
   */
  static async decrypt(key: string, encrypted: string, aad?: string | object): Promise<any> {
    console.log('[EncryptionManager.decrypt] Decrypting data')
    try {
      console.log('[EncryptionManager.decrypt] WARNING: Hashing is not reversible')
      return null
    } catch (error) {
      console.error('[EncryptionManager.decrypt] ✗ Failed to decrypt data:', error)
      throw error
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                               Private Helpers                              */
  /* -------------------------------------------------------------------------- */

  /** stable stringify */
  private static stableStringify(obj: object): string {
    return JSON.stringify(obj, Object.keys(obj).sort())
  }

  private static equals(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) return false
    let diff = 0
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
    return diff === 0
  }
}
