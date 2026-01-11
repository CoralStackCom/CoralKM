import { Platform, StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B5678',
    marginTop: 12,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },

  drawerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  tabsList: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
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

  /* ===== Content ===== */
  tabContentScroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 2,
      },
    }),
  },

  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },

  dataContainerScroll: {
    backgroundColor: '#0F172A', // dark code block
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
    maxHeight: 320,
  },

  dataText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#E5E7EB',
    lineHeight: 18,
  },

  dataTextLarge: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#1B5678',
    lineHeight: 18,
  },

  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
    color: '#111827',
    marginBottom: 16,
  },

  modalButtonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },

  button: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#1B5678',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonOutline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  buttonTextOutline: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },
})
