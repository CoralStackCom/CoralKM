import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  closeButton: {
    padding: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 20,
  },
  qrContainer: {
    marginVertical: 20,
  },
  qrWrapper: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  didContainer: {
    width: '100%',
    marginTop: 20,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  didLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  didText: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'monospace',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    gap: 8,
    marginBottom: 12,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  instructionText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
})
