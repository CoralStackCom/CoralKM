import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  trigger: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  triggerName: { fontSize: 14, fontWeight: '600' },
  modal: { flex: 1, backgroundColor: '#fff' },
  modalHeader: {
    padding: 16,
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
  },
  modalClose: { fontSize: 16, fontWeight: '600' },
  item: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemName: { fontSize: 14, fontWeight: '500', flex: 1 },
})
