/** Standardized error color for all validation states */
export const VALIDATION_ERROR_COLOR = '#DC2626'

/** Email format regex */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Person/household name: letters (incl. accents), spaces, apostrophes, hyphens. */
export const NAME_REGEX = /^[\p{L}][\p{L} '.-]*$/u

/** Decentralized Identifier (DID), e.g. did:peer:..., did:web:... */
export const DID_REGEX = /^did:[a-z0-9]+:.+/i

/** ISO 4217-style currency code: exactly 3 uppercase letters. */
export const CURRENCY_REGEX = /^[A-Z]{3}$/

/** Numeric-only string (used for passcodes). */
export const NUMERIC_REGEX = /^\d+$/

/** Common field length limits. */
export const LIMITS = {
  name: { min: 1, max: 40 },
  householdName: { min: 2, max: 60 },
  country: { min: 2, max: 56 },
  email: { max: 254 },
  passcode: 6,
} as const
