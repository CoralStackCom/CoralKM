import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  description: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  canvasContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  canvasBox: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#333333',
  },
  canvasHint: {
    fontSize: 12,
    color: '#999999',
    marginTop: 10,
  },
  seedSection: {
    width: '100%',
    marginBottom: 16,
  },
  seedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  seedLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  copyButton: {
    backgroundColor: '#1B5678',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  copyButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  seedBox: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#333333',
    minHeight: 60,
  },
  seedText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },
  seedSubtext: {
    fontSize: 10,
    color: '#666666',
    marginTop: 4,
  },
  resetButton: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 140,
    alignItems: 'center',
  },
  resetButtonDisabled: {
    backgroundColor: '#555555',
    opacity: 0.5,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
})
