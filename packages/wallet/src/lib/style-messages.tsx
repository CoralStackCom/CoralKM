import type { IAgentUserProfile } from '@coralkm/core'

import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import type { IChannelMessage } from '../providers/wallet'

/**
 * Main function to style DIDComm messages based on their type.
 *
 * @param message The DIDComm message to style
 * @returns       The styled message content including title, body, and optional color
 */
export function styleMessage(message: IChannelMessage): {
  title: string | React.ReactElement
  body: string | React.ReactElement
  color?: string
} {
  const didcommMessage = message.message
  switch (didcommMessage.type) {
    case 'https://didcomm.org/trust-ping/2.0/ping':
      return {
        title: 'Ping',
        body: `Response Requested: ${didcommMessage.body.responseRequested ? 'Yes' : 'No'}`,
      }
    case 'https://didcomm.org/trust-ping/2.0/ping-response':
      return {
        title: 'Pong',
        body: '',
      }
    case 'https://didcomm.org/discover-features/2.0/queries':
      return {
        title: 'Discover Features Query',
        body: JSON.stringify(didcommMessage.body.queries, null, 2),
      }
    case 'https://didcomm.org/discover-features/2.0/disclose':
      return {
        title: 'Discover Features Disclosure',
        body: (
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {didcommMessage.body.disclosures.map((d: any) => (
              <li key={d.id} style={{ marginBottom: '8px' }}>
                <a href={d.id} target="_blank" rel="noopener noreferrer">
                  {d.id}
                </a>
                {d.roles && d.roles.length > 0 ? ` (${d.roles.join(', ')})` : ''}
              </li>
            ))}
          </ul>
        ),
      }
    case 'https://didcomm.org/report-problem/2.0/problem-report': {
      const code = message?.decoded?.code || message.message.body?.code
      const comment = message?.decoded?.comment || message.message.body?.comment
      return {
        title: 'Problem Report',
        body: (
          <div>
            <p>
              <strong>Code:</strong> {code}
            </p>
            {comment && (
              <p>
                <strong>Explanation:</strong> {comment}
              </p>
            )}
          </div>
        ),
        color: '#f87f7fff',
      }
    }
    case 'https://didcomm.org/user-profile/1.0/request-profile':
      return {
        title: 'User Profile Request',
        body: didcommMessage.body.query
          ? `Requested Fields: ${
              Array.isArray(didcommMessage.body.query)
                ? didcommMessage.body.query.join(', ')
                : didcommMessage.body.query
            }`
          : 'Requested all profile fields',
      }
    case 'https://didcomm.org/user-profile/1.0/profile': {
      const userProfile: IAgentUserProfile = message.decoded as IAgentUserProfile
      if (userProfile) {
        return {
          title: 'User Profile',
          body: (
            <div>
              <p>
                <strong>Name:</strong> {userProfile.displayName || 'N/A'}
              </p>
              {userProfile.description && (
                <p>
                  <strong>Description:</strong> {userProfile.description}
                </p>
              )}
              {userProfile.displayPicture && (
                <p>
                  <strong>Avatar:</strong>
                  <Avatar className="h-8 w-8 flex-shrink-0 mt-0">
                    <AvatarImage
                      src={`data:image/png;base64,${userProfile.displayPicture}`}
                      alt={userProfile.displayName}
                    />
                    <AvatarFallback>{userProfile.displayName.charAt(0)}</AvatarFallback>
                  </Avatar>
                </p>
              )}
              <p>
                <strong>Send Yours Back:</strong>{' '}
                {message.message.body.send_back_yours ? 'Yes' : 'No'}
              </p>
            </div>
          ),
        }
      } else {
        return {
          title: 'User Profile',
          body: 'Sent User Profile',
        }
      }
    }
    case 'https://didcomm.org/coordinate-mediation/3.0/mediate-request':
      return {
        title: 'Mediation Request',
        body: '',
        color: '#76f772',
      }
    case 'https://didcomm.org/coordinate-mediation/3.0/mediate-grant':
      return {
        title: 'Mediation Grant',
        body: (
          <p>
            <strong>Routing DID:</strong> {didcommMessage.body.routing_did}
          </p>
        ),
        color: '#76f772',
      }
    case 'https://didcomm.org/coordinate-mediation/3.0/mediate-deny':
      return {
        title: 'Mediation Deny',
        body: '',
        color: '#f87f7fff',
      }
    case 'https://didcomm.org/coordinate-mediation/3.0/recipient-update':
      return {
        title: 'Mediation Recipient Update',
        body: 'Add Recipient DID',
        color: '#76f772',
      }
    case 'https://didcomm.org/coordinate-mediation/3.0/recipient-update-response':
      return {
        title: 'Mediation Recipient Update Response',
        body:
          didcommMessage.body.updated[0].result === 'success'
            ? 'Recipient DID Updated'
            : 'Recipient DID Not Updated',
        color: '#76f772',
      }
    case 'https://coralstack.com/coralkm/0.1/namespace-request':
      return {
        title: 'CoralKM Namespace Request',
        body: '',
        color: '#f7c14d',
      }
    case 'https://coralstack.com/coralkm/0.1/namespace-grant':
      return {
        title: 'CoralKM Namespace Created',
        body: (
          <p>
            <strong>Namespace ID:</strong> {didcommMessage.body.namespace.id}
          </p>
        ),
        color: '#f7c14d',
      }
    case 'https://coralstack.com/coralkm/0.1/namespace-sync':
      return {
        title: `Namespace Sync (${didcommMessage.body.request})`,
        body:
          didcommMessage.body.request === 'PUT'
            ? `Sent ${(didcommMessage.body.data as string)?.length} bytes of data`
            : 'Requested namespace data',
        color: '#f7c14d',
      }
    case 'https://coralstack.com/coralkm/0.1/namespace-sync-response':
      return {
        title: `Namespace Sync Response (${didcommMessage.body.request})`,
        body:
          didcommMessage.body.request === 'PUT' ? (
            <p>
              <strong>Data Hash:</strong> {didcommMessage.body.hash}
            </p>
          ) : (
            `Received ${(didcommMessage.body.data as string)?.length} bytes of data`
          ),
        color: '#f7c14d',
      }
    case 'https://coralstack.com/coralkm/0.1/namespace-recovery-request':
      return {
        title: 'CoralKM Namespace Recovery Request',
        body: (
          <>
            <p>
              <strong>Recovery ID:</strong> {didcommMessage.id}
            </p>
            <p>
              <strong>Namespace ID:</strong> {didcommMessage.body.namespace.id}
            </p>
            <p>
              <strong>Gateway DID:</strong> {didcommMessage.body.namespace.gateway_did}
            </p>
            <p>
              <strong>Device DID:</strong> {didcommMessage.body.device_did}
            </p>
          </>
        ),
        color: '#f7c14d',
      }
    case 'https://coralstack.com/coralkm/0.1/guardian-request':
      return {
        title: 'Guardianship Request',
        body: '',
        color: '#f7c14d',
      }
    case 'https://coralstack.com/coralkm/0.1/guardian-grant':
      return {
        title: 'Guardianship Grant',
        body: (
          <p>
            <strong>Status:</strong> Granted
          </p>
        ),
        color: '#f7c14d',
      }
    case 'https://coralstack.com/coralkm/0.1/guardian-remove':
      return {
        title: 'Guardianship Removal Request',
        body: '',
        color: '#f7c14d',
      }
    case 'https://coralstack.com/coralkm/0.1/guardian-remove-confirm':
      return {
        title: 'Guardianship Removed',
        body: (
          <p>
            <strong>Status:</strong> Removed
          </p>
        ),
        color: '#f7c14d',
      }
    case 'https://coralstack.com/coralkm/0.1/guardian-share-update':
      return {
        title: 'Guardian Share Update',
        body: (
          <p>
            <strong>Share:</strong> {didcommMessage.body.share}
          </p>
        ),
        color: '#f7c14d',
      }
    case 'https://coralstack.com/coralkm/0.1/guardian-share-update-confirm':
      return {
        title: 'Guardian Share Update Confirmed',
        body: '',
        color: '#f7c14d',
      }
    case 'https://coralstack.com/coralkm/0.1/guardian-verification-challenge':
      return {
        title: 'Guardian Verification Challenge',
        body: (
          <div className="flex flex-col space-y-3">
            <p className="text-sm text-gray-700">
              <strong>Recovery ID:</strong> {didcommMessage.body.pthid}
            </p>
            <p className="text-sm text-gray-700">{didcommMessage.body.challenge.instructions}</p>
            <Input
              placeholder="Enter Verification Code"
              type="number"
              value="123456"
              readOnly
              className="bg-white text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button className="mt-2 w-full sm:w-auto">Verify</Button>
          </div>
        ),
        color: '#f7c14d',
      }
    case 'https://coralstack.com/coralkm/0.1/guardian-verification-challenge-response':
      return {
        title: 'Guardian Verification Challenge Response',
        body: (
          <>
            <p>
              <strong>Recovery ID:</strong> {didcommMessage.body.pthid}
            </p>
            <p>
              <strong>Response:</strong> {didcommMessage.body.response}
            </p>
          </>
        ),
        color: '#f7c14d',
      }
    case 'https://coralstack.com/coralkm/0.1/guardian-release-share':
      return {
        title: 'Guardian Release Share',
        body: (
          <>
            <p>
              <strong>Recovery ID:</strong> {didcommMessage.body.pthid}
            </p>
            <p>
              <strong>Share:</strong> {didcommMessage.body.share}
            </p>
          </>
        ),
        color: '#f7c14d',
      }
    default:
      return {
        title: didcommMessage.type,
        body: JSON.stringify(didcommMessage.body, null, 2),
      }
  }
}

/**
 * Returns either '#000000' (black) or '#FFFFFF' (white)
 * depending on which has better contrast for the given background color.
 */
export function getContrastTextColor(hex: string): '#000000' | '#FFFFFF' {
  // Remove leading '#' if present
  const cleanHex = hex.replace('#', '')

  // Parse RGB from hex
  const r = parseInt(cleanHex.substring(0, 2), 16)
  const g = parseInt(cleanHex.substring(2, 4), 16)
  const b = parseInt(cleanHex.substring(4, 6), 16)

  // Calculate relative luminance using the sRGB formula
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b

  // Use a threshold (128 ~ midpoint); tweak to your preference
  return luminance > 160 ? '#000000' : '#FFFFFF'
}
