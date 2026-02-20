import { StyleSheet } from 'react-native'

import { VALIDATION_ERROR_COLOR } from '@/constants/validation'

export const styles = StyleSheet.create({
  textarea: {
    minHeight: 64,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
    color: '#000',
    backgroundColor: '#FFF',
  },
  textareaError: {
    borderColor: VALIDATION_ERROR_COLOR,
  },
  errorText: {
    color: VALIDATION_ERROR_COLOR,
    fontSize: 12,
    marginTop: 4,
  },
})
