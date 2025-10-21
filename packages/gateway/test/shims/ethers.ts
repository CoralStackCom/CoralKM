/**
 *  Get a typed Uint8Array for %%value%%. If already a Uint8Array
 *  the original %%value%% is returned; if a copy is required use
 *  [[getBytesCopy]].
 *
 *  @see: getBytesCopy
 */
// eslint-disable-next-line no-unused-vars
export function getBytes(value: any, name: any) {
  throw new Error('Not implemented')
}

/**
 *  Returns a [[DataHexString]] representation of %%data%%.
 */
// eslint-disable-next-line no-unused-vars
export function hexlify(data: any) {
  throw new Error('Not implemented')
}

/**
 *  Returns the UTF-8 byte representation of %%str%%.
 *
 *  If %%form%% is specified, the string is normalized.
 */
// eslint-disable-next-line no-unused-vars
export function toUtf8Bytes(str: any, form: any) {
  throw new Error('Not implemented')
}

/**
 *  Returns the string represented by the UTF-8 data %%bytes%%.
 *
 *  When %%onError%% function is specified, it is called on UTF-8
 *  errors allowing recovery using the [[Utf8ErrorFunc]] API.
 *  (default: [error](Utf8ErrorFuncs))
 */
// eslint-disable-next-line no-unused-vars
export function toUtf8String(bytes: any, onError: any) {
  throw new Error('Not implemented')
}

/**
 *  Returns the address for the %%key%%.
 *
 *  The key may be any standard form of public key or a private key.
 */
// eslint-disable-next-line no-unused-vars
export function computeAddress(key: any) {
  throw new Error('Not implemented')
}

/**
 *  A **SigningKey** represents a cryptographic signing key, used to
 *  sign transactions and other operations.
 */
export class SigningKey {
  constructor() {
    throw new Error('SigningKey not implemented')
  }
}

/**
 *  A **Transaction** describes an operation to be executed on
 *  Ethereum by an Externally Owned Account (EOA). It includes
 *  who (the [[to]] address), what (the [[data]]) and how much (the
 *  [[value]] in ether) the operation should entail.
 *
 *  @example:
 *    tx = new Transaction()
 *    //_result:
 *
 *    tx.data = "0x1234";
 *    //_result:
 */
export class Transaction {
  constructor() {
    throw new Error('Transaction not implemented')
  }
}
