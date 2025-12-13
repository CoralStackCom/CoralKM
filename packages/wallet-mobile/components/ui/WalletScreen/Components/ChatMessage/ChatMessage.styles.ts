import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    alignItems: 'flex-start',
    gap: 8,
  },
  row: { flexDirection: 'row' },
  rowReverse: { flexDirection: 'row-reverse' },

  messageWrapper: {
    flex: 1,
    maxWidth: '80%',
  },
  alignStart: { alignItems: 'flex-start' },
  alignEnd: { alignItems: 'flex-end' },

  bubble: {
    borderRadius: 16,
    overflow: 'hidden',
  },

  header: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 11,
    fontWeight: '500',
    opacity: 0.8,
  },

  body: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  bodyText: {
    fontSize: 14,
  },

  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
})
