import type { IIdentifier, IKey, TKeyType } from '@veramo/core-types'
import { bytesToBase58, bytesToMultibase, hexToBytes } from '@veramo/utils'
import type { DIDDocument, VerificationMethod } from 'did-resolver'

const keyMapping: Record<TKeyType, string> = {
  Secp256k1: 'EcdsaSecp256k1VerificationKey2019',
  Secp256r1: 'EcdsaSecp256r1VerificationKey2019',
  Ed25519: 'Ed25519VerificationKey2018',
  X25519: 'X25519KeyAgreementKey2019',
  Bls12381G1: 'Bls12381G1Key2020',
  Bls12381G2: 'Bls12381G2Key2020',
}

/**
 * Convert a Veramo identifier to a DID:Web DID Document
 *
 * @param identifier    The identifier to convert to a DID Document
 * @returns             The DID:Web Document
 */
export function didDocForIdentifier(identifier: IIdentifier): DIDDocument {
  const contexts = new Set<string>()
  const allKeys: VerificationMethod[] = identifier.keys.map((key: IKey) => {
    const vm: VerificationMethod = {
      id: identifier.did + '#' + key.kid,
      type: keyMapping[key.type],
      controller: identifier.did,
      publicKeyHex: key.publicKeyHex,
    }
    switch (vm.type) {
      case 'EcdsaSecp256k1VerificationKey2019':
      case 'EcdsaSecp256k1RecoveryMethod2020':
        contexts.add('https://w3id.org/security/v2')
        contexts.add('https://w3id.org/security/suites/secp256k1recovery-2020/v2')
        break
      case 'Ed25519VerificationKey2018':
        contexts.add('https://w3id.org/security/suites/ed25519-2018/v1')
        vm.publicKeyBase58 = bytesToBase58(hexToBytes(key.publicKeyHex))
        delete vm.publicKeyHex
        break
      case 'X25519KeyAgreementKey2019':
        contexts.add('https://w3id.org/security/suites/x25519-2019/v1')
        vm.publicKeyBase58 = bytesToBase58(hexToBytes(key.publicKeyHex))
        delete vm.publicKeyHex
        break
      case 'Ed25519VerificationKey2020':
        contexts.add('https://w3id.org/security/suites/ed25519-2020/v1')
        vm.publicKeyMultibase = bytesToMultibase(
          hexToBytes(key.publicKeyHex),
          'base58btc',
          'ed25519-pub'
        )
        delete vm.publicKeyHex
        break
      case 'X25519KeyAgreementKey2020':
        contexts.add('https://w3id.org/security/suites/x25519-2020/v1')
        vm.publicKeyMultibase = bytesToMultibase(
          hexToBytes(key.publicKeyHex),
          'base58btc',
          'x25519-pub'
        )
        delete vm.publicKeyHex
        break
      case 'EcdsaSecp256r1VerificationKey2019':
        contexts.add('https://w3id.org/security/v2')
        break
      case 'Bls12381G1Key2020':
      case 'Bls12381G2Key2020':
        contexts.add('https://w3id.org/security/bbs/v1')
        break
      default:
        break
    }
    return vm
  })
  // ed25519 keys can also be converted to x25519 for key agreement
  const keyAgreementKeyIds = allKeys
    .filter(key => ['Ed25519VerificationKey2018', 'X25519KeyAgreementKey2019'].includes(key.type))
    .map(key => key.id)
  const signingKeyIds = allKeys
    .filter(key => key.type !== 'X25519KeyAgreementKey2019')
    .map(key => key.id)

  const didDoc = {
    '@context': ['https://www.w3.org/ns/did/v1', ...contexts],
    id: identifier.did,
    verificationMethod: allKeys,
    authentication: signingKeyIds,
    assertionMethod: signingKeyIds,
    keyAgreement: keyAgreementKeyIds,
    service: [...(identifier?.services || [])],
  }

  return didDoc
}
