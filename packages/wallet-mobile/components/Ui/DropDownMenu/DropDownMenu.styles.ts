import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  content: {
    backgroundColor: '#FFF',
    borderRadius: 6,
    marginTop: 8,
    minWidth: 128,
    maxHeight: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  item: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDestructive: {},
  itemText: {
    fontSize: 14,
    color: '#000',
  },
  itemTextDestructive: {
    color: '#EF4444',
  },
  label: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
})
