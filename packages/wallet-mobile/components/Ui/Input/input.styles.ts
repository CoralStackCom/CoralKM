import { StyleSheet } from 'react-native'

import { VALIDATION_ERROR_COLOR } from '@/constants/validation'

export const styles = StyleSheet.create({
  input: {
    height: 36,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
    color: '#000',
    backgroundColor: '#FFF',
  },
  inputError: {
    borderColor: VALIDATION_ERROR_COLOR,
  },
  errorText: {
    color: VALIDATION_ERROR_COLOR,
    fontSize: 12,
    marginTop: 4,
    flexShrink: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counterText: {
    color: '#9CA3AF',
    fontSize: 11,
    marginTop: 4,
    marginLeft: 8,
  },
})

