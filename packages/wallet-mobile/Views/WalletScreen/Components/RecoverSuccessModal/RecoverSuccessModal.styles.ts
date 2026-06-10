import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  headerText: { fontSize: 14, color: '#666', marginTop: 4 },
  body: { flex: 1, paddingVertical: 16, paddingHorizontal: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  codeBlock: {
    fontSize: 10,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontFamily: 'monospace',
    marginBottom: 16,
  },
  footer: { padding: 16 },
  okButton: {
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  okButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
})
