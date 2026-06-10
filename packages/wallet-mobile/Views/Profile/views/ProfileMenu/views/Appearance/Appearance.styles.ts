import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fafafa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    // backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  backIcon: {
    fontSize: 24,
    color: '#000',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  themeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeIcon: {
    fontSize: 22,
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#0095f6',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0095f6',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 50,
  },
  colorGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  colorButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorButtonSelected: {
    borderWidth: 3,
    borderColor: '#000',
  },
  checkmark: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  previewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  previewContent: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  previewSubtitle: {
    fontSize: 14,
    color: '#7eadc9ff',
  },
  previewButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  previewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  iconLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appIconPreview: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#0095f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appIconText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  iconText: {
    flex: 1,
  },
  iconLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 2,
  },
  iconDescription: {
    fontSize: 13,
    color: '#7eadc9ff',
  },
  chevron: {
    fontSize: 22,
    color: '#999',
    fontWeight: '300',
  },
})
