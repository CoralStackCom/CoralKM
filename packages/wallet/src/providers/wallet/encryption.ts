import { combine, split } from 'shamir-secret-sharing'

/**
 * EncryptionManager
 *
 * A simple AES-GCM 256-bit encryption helper for encrypting and decrypting JSON data.
 * Provides secure key creation, export/import, and optional Additional Authenticated Data (AAD)
 * binding to ensure ciphertext integrity within a given context (e.g., record type, user ID, etc.).
 *
 * The same AAD must be provided during decryption for verification.
 */
export class EncryptionManager {
  /* -------------------------------------------------------------------------- */
  /*                                  Key APIs                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Generate a new 256-bit AES-GCM Data Encryption Key (DEK).
   *
   * @returns {Promise<CryptoKey>}
   * A Promise resolving to a new AES-GCM CryptoKey for encryption and decryption.
   */
  static async createDEK(): Promise<CryptoKey> {
    return crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt'])
  }

  /**
   * Export a CryptoKey into a Base64URL-encoded string for storage or backup.
   *
   * @param {CryptoKey} key
   * The AES-GCM key to export.
   *
   * @returns {Promise<string>}
   * A Base64URL-encoded string representation of the raw 256-bit DEK.
   */
  static async exportDEK(key: CryptoKey): Promise<string> {
    const raw = new Uint8Array(await crypto.subtle.exportKey('raw', key))
    return EncryptionManager.toBase64Url(raw)
  }

  /**
   * Import a Base64URL-encoded DEK string back into a usable CryptoKey.
   *
   * @param {string} encoded
   * The Base64URL-encoded DEK string previously exported with `exportDEK`.
   *
   * @returns {Promise<CryptoKey>}
   * The reconstructed AES-GCM CryptoKey.
   */
  static async importDEK(encoded: string): Promise<CryptoKey> {
    const raw = EncryptionManager.fromBase64Url(encoded)
    // @ts-expect-error WebCrypto API types are incomplete
    return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, true, ['encrypt', 'decrypt'])
  }

  /* -------------------------------------------------------------------------- */
  /*                           Shamir Split / Combine                           */
  /* -------------------------------------------------------------------------- */

  /**
   * Split the given CryptoKey into multiple shares using Shamir's Secret Sharing.
   *
   * @param key CryptoKey to split
   * @param numberOfShares Total number of shares to create
   * @param threshold  Minimum number of shares required to reconstruct the key
   * @returns Array of Base64URL-encoded shares
   */
  static async splitDEK(
    key: CryptoKey,
    numberOfShares: number,
    threshold: number
  ): Promise<string[]> {
    const raw = new Uint8Array(await crypto.subtle.exportKey('raw', key))
    const shares = await split(raw, numberOfShares, threshold)
    return shares.map(share => EncryptionManager.toBase64Url(share))
  }

  /**
   * Combine multiple Base64URL-encoded shares into a single CryptoKey using Shamir's Secret Sharing.
   *
   * @param shares Array of Base64URL-encoded shares
   * @returns The reconstructed AES-GCM CryptoKey
   */
  static async combineDEK(shares: string[]): Promise<CryptoKey> {
    const shareBytes = shares.map(share => EncryptionManager.fromBase64Url(share))
    const combined = await combine(shareBytes)
    // @ts-expect-error WebCrypto API types are incomplete
    return crypto.subtle.importKey('raw', combined, { name: 'AES-GCM' }, true, [
      'encrypt',
      'decrypt',
    ])
  }

  /* -------------------------------------------------------------------------- */
  /*                           Encryption / Decryption                          */
  /* -------------------------------------------------------------------------- */

  /**
   * Encrypt a JSON value or string using AES-GCM with optional AAD binding.
   *
   * The resulting payload includes algorithm metadata, IV, ciphertext, and optionally the AAD.
   *
   * @template T
   * @param {CryptoKey} key
   * The AES-GCM key used to perform encryption.
   *
   * @param {T} data
   * The JSON object or string to encrypt.
   *
   * @param {string | object} [aad]
   * Optional Additional Authenticated Data (AAD). Used to bind context such as record ID or type.
   * Must be supplied again when decrypting to verify integrity.
   *
   * @returns {Promise<string>}
   * A serialized JSON string containing `{ alg, v, iv, ct, aad? }`.
   */
  static async encrypt<T extends object | string>(
    key: CryptoKey,
    data: T,
    aad?: string | object
  ): Promise<string> {
    const json = typeof data === 'string' ? data : JSON.stringify(data)
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const pt = new TextEncoder().encode(json)

    const aadBytes = aad ? EncryptionManager.aadBytes(aad) : undefined
    const ciphertext = new Uint8Array(
      await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv, ...(aadBytes ? { additionalData: aadBytes } : {}) },
        key,
        pt
      )
    )

    const payload = {
      alg: 'AES-GCM' as const,
      v: 1,
      iv: EncryptionManager.toBase64Url(iv),
      ct: EncryptionManager.toBase64Url(ciphertext),
      ...(aadBytes ? { aad: EncryptionManager.toBase64Url(aadBytes) } : {}),
    }

    return JSON.stringify(payload)
  }

  /**
   * Decrypt an encrypted payload produced by {@link encrypt}.
   *
   * The same AAD must be supplied if it was provided during encryption, or decryption will fail.
   *
   * @template T
   * @param {CryptoKey} key
   * The AES-GCM key used for decryption.
   *
   * @param {string} encrypted
   * The serialized payload string returned by `encrypt`.
   *
   * @param {string | object} [aad]
   * Optional Additional Authenticated Data (AAD). Must match the AAD used at encryption.
   *
   * @returns {Promise<T>}
   * Resolves to the decrypted object (or string if non-JSON input was provided).
   *
   * @throws {Error}
   * If AAD mismatch or decryption/authentication fails.
   */
  static async decrypt<T = unknown>(
    key: CryptoKey,
    encrypted: string,
    aad?: string | object
  ): Promise<T> {
    const {
      alg,
      iv,
      ct,
      aad: aadB64u,
    } = JSON.parse(encrypted) as {
      alg: 'AES-GCM'
      v?: number
      iv: string
      ct: string
      aad?: string
    }
    if (alg !== 'AES-GCM') throw new Error('Unsupported alg')

    const ivBytes = EncryptionManager.fromBase64Url(iv)
    const ctBytes = EncryptionManager.fromBase64Url(ct)

    // If the payload carries AAD, caller must provide matching AAD (and vice versa)
    const providedAAD = aad ? EncryptionManager.aadBytes(aad) : undefined
    const encodedAAD = aadB64u ? EncryptionManager.fromBase64Url(aadB64u) : undefined
    if ((providedAAD && !encodedAAD) || (!providedAAD && encodedAAD)) {
      throw new Error('AAD mismatch: encrypt/decrypt AAD presence differs')
    }
    if (providedAAD && encodedAAD) {
      // Optional: strict byte equality check before decrypt (fail fast)
      if (!EncryptionManager.equals(providedAAD, encodedAAD)) {
        throw new Error('AAD mismatch: different context supplied')
      }
    }

    const pt = new Uint8Array(
      await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          // @ts-expect-error WebCrypto API types are incomplete
          iv: ivBytes,
          ...(providedAAD ? { additionalData: providedAAD } : {}),
        },
        key,
        ctBytes
      )
    )

    const text = new TextDecoder().decode(pt)
    try {
      return JSON.parse(text)
    } catch {
      return text as T
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                               Private Helpers                              */
  /* -------------------------------------------------------------------------- */

  /**
   * Convert an AAD input (string or object) to a UTF-8 encoded Uint8Array.
   * Object keys are sorted to ensure deterministic serialization.
   *
   * @private
   * @param {string | object} aad
   * The Additional Authenticated Data to encode.
   *
   * @returns {Uint8Array}
   * UTF-8 encoded byte array representation.
   */
  private static aadBytes(aad: string | object): Uint8Array {
    if (typeof aad === 'string') return new TextEncoder().encode(aad)
    // stable stringify (keys sorted) to avoid accidental mismatches
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stable = JSON.stringify(aad, Object.keys(aad as any).sort())
    return new TextEncoder().encode(stable)
  }

  /**
   * Convert a Uint8Array to a Base64URL-encoded string.
   *
   * @private
   * @param {Uint8Array} bytes
   * Raw bytes to encode.
   *
   * @returns {string}
   * Base64URL-encoded string without padding.
   */
  private static toBase64Url(bytes: Uint8Array): string {
    return btoa(String.fromCharCode(...bytes))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }

  /**
   * Decode a Base64URL string into a Uint8Array.
   *
   * @private
   * @param {string} b64url
   * The Base64URL-encoded string to decode.
   *
   * @returns {Uint8Array}
   * Raw byte array.
   */
  private static fromBase64Url(b64url: string): Uint8Array {
    const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/')
    const pad = b64.length % 4 ? 4 - (b64.length % 4) : 0
    const base64 = b64 + '='.repeat(pad)
    const bin = atob(base64)
    const out = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
    return out
  }

  /**
   * Constant-time byte comparison to prevent timing attacks.
   *
   * @private
   * @param {Uint8Array} a
   * First array.
   * @param {Uint8Array} b
   * Second array.
   *
   * @returns {boolean}
   * True if arrays are identical.
   */
  private static equals(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) return false
    let diff = 0
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
    return diff === 0
  }
}
