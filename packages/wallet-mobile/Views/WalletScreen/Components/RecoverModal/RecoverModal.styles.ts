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
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  recoverBtn: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  recoverText: { color: '#fff', fontWeight: '600' },
})
