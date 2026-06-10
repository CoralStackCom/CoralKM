import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    backgroundColor: '#F2F2F2',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#777',
  },
  textActive: {
    color: '#111',
    fontWeight: '600',
  },
  tabsList: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  tabTrigger: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabTriggerActive: {
    backgroundColor: '#EEF4FF',
    opacity: 0.85,
  },

  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },

  tabTextActive: {
    color: '#1B5678',
    fontWeight: '700',
  },
})
