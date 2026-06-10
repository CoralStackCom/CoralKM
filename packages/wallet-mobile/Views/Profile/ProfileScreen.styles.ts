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
  menuButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
  },

  /* Hero */
  heroCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 24,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    ...cardShadow,
  },
  heroBand: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: '#1B5678',
  },
  avatarWrapper: {
    marginTop: 28,
    marginBottom: 14,
    padding: 4,
    borderRadius: 64,
    backgroundColor: '#FFFFFF',
    ...cardShadow,
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#13415C',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1B5678',
    paddingVertical: 13,
    paddingHorizontal: 32,
    borderRadius: 14,
    gap: 8,
    minWidth: 180,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F8',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelButtonText: {
    color: '#4B5563',
    fontSize: 15,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1B5678',
    paddingVertical: 13,
    borderRadius: 14,
    gap: 6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  /* Cards */
  cardsContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    ...cardShadow,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEF2F5',
  },
  cardIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#13415C',
    letterSpacing: -0.3,
  },
  cardContent: {
    paddingHorizontal: 16,
  },
  householdLogoWrapper: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEF2F5',
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  value: {
    fontSize: 15,
    color: '#13415C',
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  secureValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  input: {
    fontSize: 15,
    color: '#13415C',
    fontWeight: '500',
    backgroundColor: '#F7FAFB',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    minWidth: 160,
    maxWidth: '60%',
    textAlign: 'right',
  },
  bottomSpacer: {
    height: 32,
  },
})
