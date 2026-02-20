import { StyleSheet } from 'react-native'

/**
 * Styles for ChannelView component.
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    gap: 12,
  },
  backButton: { padding: 4, marginRight: 4 },
  avatarContainer: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  infoButton: {
    padding: 4,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 80,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  drawerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '50%',
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  drawerContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  codeBlock: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#333',
  },
})
