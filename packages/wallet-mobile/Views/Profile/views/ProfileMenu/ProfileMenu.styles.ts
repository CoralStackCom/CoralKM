import { Platform, StyleSheet } from 'react-native'

const cardShadow = Platform.select({
  ios: {
    shadowColor: '#0B3A52',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  android: { elevation: 3 },
})

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  /* Account summary */
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    gap: 14,
    marginBottom: 24,
    ...cardShadow,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1B5678',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  summaryText: {
    flex: 1,
  },
  summaryName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#13415C',
    letterSpacing: -0.3,
  },
  summaryEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  summaryLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2B86B8',
    marginTop: 6,
  },

  /* Sections */
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5B7689',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 6,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    ...cardShadow,
  },

  /* Rows */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEF2F5',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  iconChip: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#13415C',
  },
  rowDescription: {
    fontSize: 13,
    color: '#8194A1',
    marginTop: 2,
  },

  /* Logout */
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#F5D6D0',
    ...cardShadow,
  },
  logoutLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E0533D',
  },
  bottomSpacer: {
    height: 40,
  },
})
