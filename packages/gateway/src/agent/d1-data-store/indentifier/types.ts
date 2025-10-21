/**
 * Table schema for storing identifiers in D1
 */
export interface Identifier {
  did: string
  provider?: string | null
  alias?: string | null
  saveDate?: string
  updateDate?: string
  controllerKeyId?: string | null
}

/**
 * Table schema for storing keys in D1
 */
export interface Key {
  kid: string
  type: string
  publicKeyHex: string
  meta?: any
  kms: string
  identifier_id?: string
}

/**
 * Table schema for storing private keys in D1
 */
export interface PrivateKey {
  alias: string
  privateKeyHex: string
  type: string
}

/**
 * Table schema for storing services in D1
 */
export interface Service {
  id: string
  type: string
  serviceEndpoint: string
  description?: string | null
  identifier_id?: string
}
