import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  channelItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },

  channelItemSelected: {
    backgroundColor: '#f0f0f0',
  },

  channelInfo: {
    flex: 1,
    marginLeft: 12,
  },

  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  nameText: {
    fontWeight: '600',
    fontSize: 14,
    flex: 1,
  },

  msgCount: {
    fontSize: 12,
    color: '#999',
    marginLeft: 6,
  },

  didRow: {
    flexDirection: 'row',
    marginTop: 2,
    alignItems: 'center',
  },

  didText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
})
