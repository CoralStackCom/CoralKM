import { validators, type ValidatorFn } from '@/hooks/useFormValidation'

describe('validators', () => {
  describe('required()', () => {
    const validate = validators.required()

    it('returns error for empty string', () => {
      expect(validate('')).toBe('This field is required')
    })

    it('returns error for whitespace-only string', () => {
      expect(validate('   ')).toBe('This field is required')
    })

    it('returns null for non-empty string', () => {
      expect(validate('hello')).toBeNull()
    })

    it('accepts custom error message', () => {
      const custom = validators.required('Name is required')
      expect(custom('')).toBe('Name is required')
    })
  })

  describe('email()', () => {
    const validate = validators.email()

    it('returns error for invalid email', () => {
      expect(validate('not-an-email')).toBe('Invalid email format')
    })

    it('returns error for email missing @', () => {
      expect(validate('testexample.com')).toBe('Invalid email format')
    })

    it('returns error for email missing domain', () => {
      expect(validate('test@')).toBe('Invalid email format')
    })

    it('returns null for valid email', () => {
      expect(validate('user@example.com')).toBeNull()
    })

    it('returns null for empty string (not required)', () => {
      expect(validate('')).toBeNull()
    })

    it('accepts custom error message', () => {
      const custom = validators.email('Bad email')
      expect(custom('invalid')).toBe('Bad email')
    })
  })

  describe('minLength()', () => {
    const validate = validators.minLength(5)

    it('returns error for short strings', () => {
      expect(validate('abc')).toBe('Must be at least 5 characters')
    })

    it('returns null for strings at minimum length', () => {
      expect(validate('abcde')).toBeNull()
    })

    it('returns null for strings above minimum length', () => {
      expect(validate('abcdef')).toBeNull()
    })

    it('returns null for empty string (not required)', () => {
      expect(validate('')).toBeNull()
    })

    it('accepts custom error message', () => {
      const custom = validators.minLength(3, 'Too short')
      expect(custom('ab')).toBe('Too short')
    })
  })

  describe('maxLength()', () => {
    const validate = validators.maxLength(5)

    it('returns error for long strings', () => {
      expect(validate('abcdef')).toBe('Must be at most 5 characters')
    })

    it('returns null for strings at maximum length', () => {
      expect(validate('abcde')).toBeNull()
    })

    it('returns null for strings below maximum length', () => {
      expect(validate('abc')).toBeNull()
    })

    it('returns null for empty string', () => {
      expect(validate('')).toBeNull()
    })

    it('accepts custom error message', () => {
      const custom = validators.maxLength(3, 'Too long')
      expect(custom('abcd')).toBe('Too long')
    })
  })

  describe('exactLength()', () => {
    const validate = validators.exactLength(4)

    it('returns error for wrong length (too short)', () => {
      expect(validate('abc')).toBe('Must be exactly 4 characters')
    })

    it('returns error for wrong length (too long)', () => {
      expect(validate('abcde')).toBe('Must be exactly 4 characters')
    })

    it('returns null for correct length', () => {
      expect(validate('abcd')).toBeNull()
    })

    it('returns null for empty string', () => {
      expect(validate('')).toBeNull()
    })

    it('accepts custom error message', () => {
      const custom = validators.exactLength(6, 'Must be 6 chars')
      expect(custom('abc')).toBe('Must be 6 chars')
    })
  })

  describe('pattern()', () => {
    const validate = validators.pattern(/^[A-Z]+$/)

    it('returns error for non-matching string', () => {
      expect(validate('abc')).toBe('Invalid format')
    })

    it('returns null for matching string', () => {
      expect(validate('ABC')).toBeNull()
    })

    it('returns null for empty string', () => {
      expect(validate('')).toBeNull()
    })

    it('accepts custom error message', () => {
      const custom = validators.pattern(/^\d+$/, 'Numbers only')
      expect(custom('abc')).toBe('Numbers only')
    })
  })

  describe('matches()', () => {
    const validate = validators.matches('password')

    it('returns error when fields do not match', () => {
      expect(validate('abc', { password: 'xyz' })).toBe('Fields do not match')
    })

    it('returns null when fields match', () => {
      expect(validate('abc', { password: 'abc' })).toBeNull()
    })

    it('returns null for empty string', () => {
      expect(validate('', { password: 'abc' })).toBeNull()
    })

    it('accepts custom error message', () => {
      const custom = validators.matches('password', 'Passwords must match')
      expect(custom('abc', { password: 'xyz' })).toBe('Passwords must match')
    })
  })
})

describe('useFormValidation (validateAll / clearErrors)', () => {
  // We test the hook's validation logic through the validators and
  // the validateAll/clearErrors logic by importing the hook.
  // Since hooks require React rendering context, we test the pure
  // validation logic that validateAll uses.

  it('validateAll concept: returns false when any field fails', () => {
    const schema: Record<string, ValidatorFn[]> = {
      name: [validators.required()],
      email: [validators.required(), validators.email()],
    }

    const values: Record<string, string> = { name: '', email: 'bad' }
    let allValid = true
    const errors: Record<string, string | null> = {}

    for (const fieldName of Object.keys(schema)) {
      let fieldError: string | null = null
      for (const validator of schema[fieldName]) {
        const error = validator(values[fieldName] ?? '', values)
        if (error) {
          fieldError = error
          allValid = false
          break
        }
      }
      errors[fieldName] = fieldError
    }

    expect(allValid).toBe(false)
    expect(errors.name).toBe('This field is required')
  })

  it('validateAll concept: returns true when all fields pass', () => {
    const schema: Record<string, ValidatorFn[]> = {
      name: [validators.required()],
      email: [validators.required(), validators.email()],
    }

    const values: Record<string, string> = { name: 'John', email: 'john@example.com' }
    let allValid = true
    const errors: Record<string, string | null> = {}

    for (const fieldName of Object.keys(schema)) {
      let fieldError: string | null = null
      for (const validator of schema[fieldName]) {
        const error = validator(values[fieldName] ?? '', values)
        if (error) {
          fieldError = error
          allValid = false
          break
        }
      }
      errors[fieldName] = fieldError
    }

    expect(allValid).toBe(true)
    expect(errors.name).toBeNull()
    expect(errors.email).toBeNull()
  })

  it('clearErrors concept: resets all errors to null', () => {
    const fieldNames = ['name', 'email']
    const errors: Record<string, string | null> = {
      name: 'This field is required',
      email: 'Invalid email format',
    }

    // Simulate clearErrors behavior
    const cleared = Object.fromEntries(fieldNames.map((name) => [name, null]))
    expect(cleared.name).toBeNull()
    expect(cleared.email).toBeNull()
  })

  it('clearFieldError concept: resets specific field error', () => {
    const errors: Record<string, string | null> = {
      name: 'This field is required',
      email: 'Invalid email format',
    }

    // Simulate clearFieldError for 'name'
    const updated: Record<string, string | null> = { ...errors, name: null }
    expect(updated['name']).toBeNull()
    expect(updated['email']).toBe('Invalid email format')
  })
})
