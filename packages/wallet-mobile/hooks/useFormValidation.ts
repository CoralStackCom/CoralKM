import { useState, useCallback, useMemo } from 'react'

import { CURRENCY_REGEX, DID_REGEX, EMAIL_REGEX, NAME_REGEX, NUMERIC_REGEX } from '@/constants/validation'

/** A validator function returns an error message string or null if valid */
export type ValidatorFn = (value: string, allValues?: Record<string, string>) => string | null

/** Schema mapping field names to an array of validator functions */
export type ValidationSchema = Record<string, ValidatorFn[]>

/** Factory functions for common validators */
export const validators = {
  required:
    (msg = 'This field is required'): ValidatorFn =>
    (value) =>
      value.trim() === '' ? msg : null,

  email:
    (msg = 'Invalid email format'): ValidatorFn =>
    (value) =>
      value.trim() === '' ? null : !EMAIL_REGEX.test(value) ? msg : null,

  minLength:
    (n: number, msg?: string): ValidatorFn =>
    (value) =>
      value.trim() === '' ? null : value.length < n ? (msg ?? `Must be at least ${n} characters`) : null,

  maxLength:
    (n: number, msg?: string): ValidatorFn =>
    (value) =>
      value.trim() === '' ? null : value.length > n ? (msg ?? `Must be at most ${n} characters`) : null,

  exactLength:
    (n: number, msg?: string): ValidatorFn =>
    (value) =>
      value.trim() === '' ? null : value.length !== n ? (msg ?? `Must be exactly ${n} characters`) : null,

  pattern:
    (regex: RegExp, msg = 'Invalid format'): ValidatorFn =>
    (value) =>
      value.trim() === '' ? null : !regex.test(value) ? msg : null,

  /** Letters, spaces, apostrophes and hyphens only (no digits/symbols). */
  name:
    (msg = 'Only letters, spaces, hyphens and apostrophes are allowed'): ValidatorFn =>
    (value) =>
      value.trim() === '' ? null : !NAME_REGEX.test(value.trim()) ? msg : null,

  /** A valid Decentralized Identifier (DID). */
  did:
    (msg = 'Enter a valid DID (e.g. did:peer:...)'): ValidatorFn =>
    (value) =>
      value.trim() === '' ? null : !DID_REGEX.test(value.trim()) ? msg : null,

  /** A 3-letter ISO currency code (e.g. USD). */
  currencyCode:
    (msg = 'Use a 3-letter code, e.g. USD'): ValidatorFn =>
    (value) =>
      value.trim() === '' ? null : !CURRENCY_REGEX.test(value.trim().toUpperCase()) ? msg : null,

  /** Digits only. */
  numeric:
    (msg = 'Numbers only'): ValidatorFn =>
    (value) =>
      value.trim() === '' ? null : !NUMERIC_REGEX.test(value) ? msg : null,

  matches:
    (otherField: string, msg = 'Fields do not match'): ValidatorFn =>
    (value, allValues) =>
      value.trim() === '' ? null : allValues && value !== allValues[otherField] ? msg : null,

  jsonWithKeys:
    (keys: string[], msg?: string): ValidatorFn =>
    (value) => {
      if (value.trim() === '') return null
      try {
        const parsed = JSON.parse(value)
        for (const key of keys) {
          if (!(key in parsed)) {
            return msg ?? `Missing required field: ${key}`
          }
        }
        return null
      } catch {
        return msg ?? 'Invalid JSON'
      }
    },
}

/**
 * Hook for declarative form validation.
 *
 * @param schema - mapping of field names to ordered validator arrays
 * @returns validation state and helpers
 */
export const useFormValidation = (schema: ValidationSchema) => {
  const fieldNames = useMemo(() => Object.keys(schema), [schema])

  const [errors, setErrors] = useState<Record<string, string | null>>(() =>
    Object.fromEntries(fieldNames.map((name) => [name, null]))
  )

  const validateField = useCallback(
    (name: string, value: string, allValues?: Record<string, string>): boolean => {
      const fieldValidators = schema[name]
      if (!fieldValidators) return true

      for (const validator of fieldValidators) {
        const error = validator(value, allValues)
        if (error) {
          setErrors((prev) => ({ ...prev, [name]: error }))
          return false
        }
      }
      setErrors((prev) => ({ ...prev, [name]: null }))
      return true
    },
    [schema]
  )

  const validateAll = useCallback(
    (values: Record<string, string>): boolean => {
      let allValid = true
      const newErrors: Record<string, string | null> = {}

      for (const name of fieldNames) {
        const fieldValidators = schema[name]
        let fieldError: string | null = null

        for (const validator of fieldValidators) {
          const error = validator(values[name] ?? '', values)
          if (error) {
            fieldError = error
            allValid = false
            break
          }
        }
        newErrors[name] = fieldError
      }

      setErrors(newErrors)
      return allValid
    },
    [schema, fieldNames]
  )

  const clearFieldError = useCallback((name: string) => {
    setErrors((prev) => ({ ...prev, [name]: null }))
  }, [])

  const clearErrors = useCallback(() => {
    setErrors(Object.fromEntries(fieldNames.map((name) => [name, null])))
  }, [fieldNames])

  const isValid = useMemo(() => Object.values(errors).every((e) => e === null), [errors])

  return { errors, validateField, validateAll, clearFieldError, clearErrors, isValid }
}
