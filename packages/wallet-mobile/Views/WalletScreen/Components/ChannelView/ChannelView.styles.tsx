import { StyleSheet } from 'react-native'
import { palette, radius, tint } from '@/constants/design'

/**
 * Styles for ChannelView component. Transparent surfaces let the shared
 * underwater Background show through, matching the rest of the app.
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: tint(palette.navy),
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: palette.heading,
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: tint(palette.navy),
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 80,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11,58,82,0.45)',
    justifyContent: 'flex-end',
  },
  drawerContainer: {
    backgroundColor: palette.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '80%',
    minHeight: '50%',
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.border,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.heading,
  },
  drawerContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: palette.heading,
    marginTop: 12,
    marginBottom: 8,
  },
  codeBlock: {
    backgroundColor: '#0F172A',
    padding: 12,
    borderRadius: radius.md,
    marginBottom: 12,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#E5E7EB',
  },
})
