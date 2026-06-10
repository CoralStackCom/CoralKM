/**
 * Unit tests for the newly added field validators (name, did, currencyCode,
 * numeric). These power the stricter input constraints across the app.
 */
import { validators } from '@/hooks'

describe('validators.name', () => {
  const v = validators.name()
  it('accepts letters, spaces, hyphens and apostrophes', () => {
    expect(v('Mary-Jane', {})).toBeNull()
    expect(v("O'Connor", {})).toBeNull()
    expect(v('José', {})).toBeNull()
  })
  it('rejects digits and symbols', () => {
    expect(v('John3', {})).not.toBeNull()
    expect(v('a@b', {})).not.toBeNull()
  })
  it('treats empty as valid (use required separately)', () => {
    expect(v('', {})).toBeNull()
  })
})

describe('validators.did', () => {
  const v = validators.did()
  it('accepts well-formed DIDs', () => {
    expect(v('did:peer:2.abc', {})).toBeNull()
    expect(v('did:web:example.com', {})).toBeNull()
  })
  it('rejects non-DIDs', () => {
    expect(v('not-a-did', {})).not.toBeNull()
    expect(v('did:', {})).not.toBeNull()
  })
})

describe('validators.currencyCode', () => {
  const v = validators.currencyCode()
  it('accepts 3-letter codes (case-insensitive)', () => {
    expect(v('USD', {})).toBeNull()
    expect(v('eur', {})).toBeNull()
  })
  it('rejects wrong length or non-letters', () => {
    expect(v('US', {})).not.toBeNull()
    expect(v('US1', {})).not.toBeNull()
    expect(v('DOLLAR', {})).not.toBeNull()
  })
})

describe('validators.numeric', () => {
  const v = validators.numeric()
  it('accepts digits only', () => {
    expect(v('123456', {})).toBeNull()
  })
  it('rejects non-digits', () => {
    expect(v('12a4', {})).not.toBeNull()
  })
})
