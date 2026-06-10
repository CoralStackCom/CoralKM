import type { IAgentUserProfile } from '@coralkm/core'
import type { IChannelMessage } from '../providers/wallet'

/**
 * Main function to style DIDComm messages based on their type.
 * Adapted for React Native - returns styled object properties instead of JSX
 *
 * @param message The DIDComm message to style
 * @returns       The styled message content including title, body, and optional color
 */
export function styleMessage(message: IChannelMessage): {
  title: string
  body: string | { type: string; content: any }
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
        body: {
          type: 'list',
          content: didcommMessage.body.disclosures.map((d: any) => ({
            id: d.id,
            roles: d.roles || [],
          })),
        },
      }

    case 'https://didcomm.org/report-problem/2.0/problem-report': {
      const code = message?.decoded?.code || message.message.body?.code
      const comment = message?.decoded?.comment || message.message.body?.comment
      return {
        title: 'Problem Report',
        body: `Code: ${code}${comment ? `\nExplanation: ${comment}` : ''}`,
        color: '#f87f7f',
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
          body: {
            type: 'profile',
            content: {
              displayName: userProfile.displayName || 'N/A',
              description: userProfile.description,
              displayPicture: userProfile.displayPicture,
              sendBackYours: message.message.body.send_back_yours,
            },
          },
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
        body: `Routing DID: ${didcommMessage.body.routing_did}`,
        color: '#76f772',
      }

    case 'https://didcomm.org/coordinate-mediation/3.0/mediate-deny':
      return {
        title: 'Mediation Deny',
        body: '',
        color: '#f87f7f',
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

    case 'https://coralkm.com/coralkm/0.1/namespace-request':
      return {
        title: 'CoralKM Namespace Request',
        body: '',
        color: '#f7c14d',
      }

    case 'https://coralkm.com/coralkm/0.1/namespace-grant':
      return {
        title: 'CoralKM Namespace Created',
        body: `Namespace ID: ${didcommMessage.body.namespace.id}`,
        color: '#f7c14d',
      }

    case 'https://coralkm.com/coralkm/0.1/namespace-sync':
      return {
        title: `Namespace Sync (${didcommMessage.body.request})`,
        body:
          didcommMessage.body.request === 'PUT'
            ? `Sent ${(didcommMessage.body.data as string)?.length} bytes of data`
            : 'Requested namespace data',
        color: '#f7c14d',
      }

    case 'https://coralkm.com/coralkm/0.1/namespace-sync-response':
      return {
        title: `Namespace Sync Response (${didcommMessage.body.request})`,
        body:
          didcommMessage.body.request === 'PUT'
            ? `Data Hash: ${didcommMessage.body.hash}`
            : `Received ${(didcommMessage.body.data as string)?.length} bytes of data`,
        color: '#f7c14d',
      }

    case 'https://coralkm.com/coralkm/0.1/namespace-recovery-request':
      return {
        title: 'CoralKM Namespace Recovery Request',
        body: `Recovery ID: ${didcommMessage.id}\nNamespace ID: ${didcommMessage.body.namespace.id}\nGateway DID: ${didcommMessage.body.namespace.gateway_did}\nDevice DID: ${didcommMessage.body.device_did}`,
        color: '#f7c14d',
      }

    case 'https://coralkm.com/coralkm/0.1/guardian-request':
      return {
        title: 'Guardianship Request',
        body: '',
        color: '#f7c14d',
      }

    case 'https://coralkm.com/coralkm/0.1/guardian-grant':
      return {
        title: 'Guardianship Grant',
        body: 'Status: Granted',
        color: '#f7c14d',
      }

    case 'https://coralkm.com/coralkm/0.1/guardian-remove':
      return {
        title: 'Guardianship Removal Request',
        body: '',
        color: '#f7c14d',
      }

    case 'https://coralkm.com/coralkm/0.1/guardian-remove-confirm':
      return {
        title: 'Guardianship Removed',
        body: 'Status: Removed',
        color: '#f7c14d',
      }

    case 'https://coralkm.com/coralkm/0.1/guardian-share-update':
      return {
        title: 'Guardian Share Update',
        body: `Share: ${didcommMessage.body.share}`,
        color: '#f7c14d',
      }

    case 'https://coralkm.com/coralkm/0.1/guardian-share-update-confirm':
      return {
        title: 'Guardian Share Update Confirmed',
        body: '',
        color: '#f7c14d',
      }

    case 'https://coralkm.com/coralkm/0.1/guardian-verification-challenge':
      return {
        title: 'Guardian Verification Challenge',
        body: {
          type: 'challenge',
          content: {
            recoveryId: didcommMessage.body.pthid,
            instructions: didcommMessage.body.challenge.instructions,
            verificationCode: '123456',
          },
        },
        color: '#f7c14d',
      }

    case 'https://coralkm.com/coralkm/0.1/guardian-verification-challenge-response':
      return {
        title: 'Guardian Verification Challenge Response',
        body: `Recovery ID: ${didcommMessage.body.pthid}\nResponse: ${didcommMessage.body.response}`,
        color: '#f7c14d',
      }

    case 'https://coralkm.com/coralkm/0.1/guardian-release-share':
      return {
        title: 'Guardian Release Share',
        body: `Recovery ID: ${didcommMessage.body.pthid}\nShare: ${didcommMessage.body.share}`,
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
  const r = Number.parseInt(cleanHex.substring(0, 2), 16)
  const g = Number.parseInt(cleanHex.substring(2, 4), 16)
  const b = Number.parseInt(cleanHex.substring(4, 6), 16)

  // Calculate relative luminance using the sRGB formula
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b

  // Use a threshold (160); returns black for bright backgrounds, white for dark
  return luminance > 160 ? '#000000' : '#FFFFFF'
}
