import { getMessageType } from './didcomm-utils'

describe('test didcomm-utils', () => {
  it('getMessageType should parse message type correctly', () => {
    const result1 = getMessageType('https://didcomm.org/discover-features/2.0/request')
    expect(result1.piuri).toBe('https://didcomm.org/discover-features')
    expect(result1.version).toBe('2.0')
    expect(result1.type).toBe('request')

    const result2 = getMessageType('https://didcomm.org/profile/1.0/request-profile')
    expect(result2.piuri).toBe('https://didcomm.org/profile')
    expect(result2.version).toBe('1.0')
    expect(result2.type).toBe('request-profile')
  })
})
