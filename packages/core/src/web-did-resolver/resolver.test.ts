import type { DIDDocument, Resolvable } from 'did-resolver'
import { Resolver } from 'did-resolver'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { getResolver } from './resolver'

vi.mock('cross-fetch', () => ({
  default: vi.fn(),
}))

import fetch from 'cross-fetch'

const mockedFetch = vi.mocked(fetch)

describe('web did resolver', () => {
  const did: string = 'did:web:example.com'
  const didLong: string = 'did:web:example.com:user:alice'
  const didWithPort: string = 'did:web:localhost%3A8443'
  const didWithEncodedPath: string = 'did:web:example.com:path:some%2Bsubpath'
  const identity: string = '0x2Cc31912B2b0f3075A87b3640923D45A26cef3Ee'
  const validResponse: DIDDocument = {
    '@context': 'https://www.w3.org/ns/did/v1',
    id: did,
    publicKey: [
      {
        id: `${did}#owner`,
        type: 'EcdsaSecp256k1RecoveryMethod2020',
        controller: did,
        ethereumAddress: identity,
      },
    ],
    authentication: [`${did}#owner`],
  }

  let didResolver: Resolvable

  beforeAll(async () => {
    didResolver = new Resolver(getResolver())
  })

  beforeEach(() => {
    mockedFetch.mockClear()
  })

  it('resolves document', async () => {
    mockedFetch.mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve(validResponse),
    } as Response)
    const result = await didResolver.resolve(did)
    expect(result.didDocument).toEqual(validResponse)
    expect(result.didResolutionMetadata.contentType).toEqual('application/did+ld+json')
  })

  it('resolves document with long did', async () => {
    const validResponseLong: DIDDocument = JSON.parse(
      JSON.stringify(validResponse).replace(did, didLong)
    )
    mockedFetch.mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve(validResponseLong),
    } as Response)
    const result = await didResolver.resolve(didLong)
    expect(result.didDocument).toEqual(validResponseLong)
  })

  it('fails if the did is not a valid https url', async () => {
    mockedFetch.mockRejectedValueOnce({ status: 404 })
    const result = await didResolver.resolve(did)
    expect(result.didResolutionMetadata.error).toEqual('notFound')
  })

  it('fails if the did document is not valid json', async () => {
    mockedFetch.mockResolvedValueOnce({
      status: 200,
      json: () => Promise.reject(new Error('unable to parse json')),
    } as Response)
    const result = await didResolver.resolve(did)
    expect(result.didResolutionMetadata.error).toEqual('notFound')
    expect(result.didResolutionMetadata.message).toMatch(/unable to parse json/)
  })

  it('fails if the web server produces an error', async () => {
    mockedFetch.mockResolvedValueOnce({
      status: 400,
      statusText: 'Bad Request',
    } as Response)
    const result = await didResolver.resolve(did)
    expect(result.didResolutionMetadata.error).toEqual('notFound')
    expect(result.didResolutionMetadata.message).toMatch(
      /DID must resolve to a valid https URL containing a JSON document: Error: Bad response/
    )
  })

  it('fails if the did document id does not match', async () => {
    const wrongIdResponse: DIDDocument = {
      ...validResponse,
      id: 'did:web:wrong.com',
    }
    mockedFetch.mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve(wrongIdResponse),
    } as Response)
    const result = await didResolver.resolve(did)
    expect(result.didResolutionMetadata.error).toEqual('notFound')
    expect(result.didResolutionMetadata.message).toMatch(
      /DID document id does not match requested did/
    )
  })

  it('returns correct contentType without @context', async () => {
    const noContextResponse: DIDDocument = {
      ...validResponse,
    }
    delete noContextResponse['@context']
    mockedFetch.mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve(noContextResponse),
    } as Response)
    const result = await didResolver.resolve(did)
    expect(result.didResolutionMetadata.contentType).toEqual('application/did+json')
  })

  it('resolves doc with port did', async () => {
    const validResponsePort: DIDDocument = JSON.parse(
      JSON.stringify(validResponse).replace(did, didWithPort)
    )
    mockedFetch.mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve(validResponsePort),
    } as Response)
    const result = await didResolver.resolve(didWithPort)
    expect(result.didDocument).toEqual(validResponsePort)
    expect(mockedFetch).toHaveBeenCalledWith('https://localhost:8443/.well-known/did.json', {
      mode: 'cors',
    })
  })

  it('resolves doc with URI encoded path components', async () => {
    const validResponseEncodedPath: DIDDocument = JSON.parse(
      JSON.stringify(validResponse).replace(did, didWithEncodedPath)
    )
    mockedFetch.mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve(validResponseEncodedPath),
    } as Response)
    const result = await didResolver.resolve(didWithEncodedPath)
    expect(result.didDocument).toEqual(validResponseEncodedPath)
    expect(mockedFetch).toHaveBeenCalledWith('https://example.com/path/some+subpath/did.json', {
      mode: 'cors',
    })
  })

  it('uses override function if provided', async () => {
    // Create an override function that returns the validResponse for our test DID
    const overrideFn = async (did: string, _url: string) => {
      let result: DIDDocument | null = null
      if (did === didLong) {
        result = validResponse
      }
      return result
    }
    const customResolver = new Resolver(getResolver(overrideFn))
    const result = await customResolver.resolve(didLong)
    expect(result.didDocument).toEqual(validResponse)

    // Try calling with a DID that the override does not handle
    mockedFetch.mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve(validResponse),
    } as Response)
    const result2 = await customResolver.resolve(did)
    expect(result2.didDocument).toEqual(validResponse)
  })
})
