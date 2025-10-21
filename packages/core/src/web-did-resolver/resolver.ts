import fetch from 'cross-fetch'
import type { DIDDocument, DIDResolutionResult, DIDResolver, ParsedDID } from 'did-resolver'

/**
 * The path where the DID document is expected to be found for a web DID.
 */
export const DID_DOC_PATH = '/.well-known/did.json'

/**
 * The main function to perform an HTTPS GET request to fetch a JSON document from a given URL.
 *
 * @param url   The URL to fetch the DID document from.
 * @returns     The parsed JSON response.
 * @throws      An error if the response status is 400 or greater.
 * @returns     The parsed JSON response if successful.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function get(url: string): Promise<any> {
  const res = await fetch(url, { mode: 'cors' })
  if (res.status >= 400) {
    throw new Error(`Bad response ${res.statusText}`)
  }
  return res.json()
}

/**
 * A function type that can be used to override the default DID resolution behavior
 * when fetching remote web DIDs. Useful for unit testing, local development
 * or stopping loopback requests on Cloudflare workers to resolve their local
 * DID.
 *
 * @param did   The DID to resolve.
 * @param url   The URL that would be fetched to resolve the DID.
 * @returns     A resolved DIDDocument or null if not found.
 * @throws      An error if the resolution fails.
 */
export type DIDResolverOverride = (did: string, url: string) => Promise<DIDDocument | null>

/**
 * did:web resolver for fetching and resolving web DIDs. Unless the `override` function
 * is provided, this resolver will attempt to fetch the DID document from the DID domain
 * using a HTTPS GET request to `https://<did-domain>/.well-known/did.json`. It does not
 * support HTTP/localhost so you will need to provide an override function for local
 * development.
 *
 * @param override  Optional function to override the default DID resolution behavior
 *                  when fetching remote web DIDs. Useful for unit testing, local development
 *                  or stopping loopback requests on Cloudflare workers to resolve their local
 *                  DID.
 * @returns         A resolved DIDDocument.
 */
export function getResolver(override?: DIDResolverOverride): Record<string, DIDResolver> {
  async function resolve(did: string, parsed: ParsedDID): Promise<DIDResolutionResult> {
    let err = null
    let path = decodeURIComponent(parsed.id) + DID_DOC_PATH
    const id = parsed.id.split(':')
    if (id.length > 1) {
      path = id.map(decodeURIComponent).join('/') + '/did.json'
    }

    const url = `https://${path}`

    const didDocumentMetadata = {}
    let didDocument: DIDDocument | null = null

    if (override) {
      try {
        didDocument = await override(did, url)
        if (didDocument) {
          return {
            didDocument,
            didDocumentMetadata,
            didResolutionMetadata: { contentType: 'application/did+json' },
          }
        }
      } catch (error) {
        err = `resolver_error: Error using local override function: ${error}`
      }
    } else {
      do {
        try {
          didDocument = await get(url)
        } catch (error) {
          err = `resolver_error: DID must resolve to a valid https URL containing a JSON document: ${error}`
          break
        }
        // TODO: this excludes the use of query params
        const docIdMatchesDid = didDocument?.id === did
        if (!docIdMatchesDid) {
          err = 'resolver_error: DID document id does not match requested did'
          // break // uncomment this when adding more checks
        }
        // eslint-disable-next-line no-constant-condition
      } while (false)
    }

    if (err) {
      return {
        didDocument,
        didDocumentMetadata,
        didResolutionMetadata: {
          error: 'notFound',
          message: err,
        },
      }
    } else {
      const contentType =
        typeof didDocument?.['@context'] !== 'undefined'
          ? 'application/did+ld+json'
          : 'application/did+json'
      return {
        didDocument,
        didDocumentMetadata,
        didResolutionMetadata: { contentType },
      }
    }
  }

  return { web: resolve }
}
