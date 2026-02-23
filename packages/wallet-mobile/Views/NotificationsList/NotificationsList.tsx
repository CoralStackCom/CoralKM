import Header from '@/components/ui/Header'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { useNotifications } from '@/providers/notifications'
import type { AppNotification, NotificationType } from '@/providers/notifications'
import React, { useCallback, useMemo } from 'react'
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import type { NotificationItemProps } from './NotificationsList.interfaces'
import { styles } from './NotificationsList.styles'

import type { IconSymbolName } from '@/components/ui/icon-symbol'

/** Map notification type to an icon name */
const NOTIFICATION_TYPE_ICONS: Record<NotificationType, IconSymbolName> = {
  new_message: 'message.fill',
  recovery_request: 'key.fill',
  credential_offer: 'card.fill',
  guardian_approval: 'lock.shield.fill',
  connection_request: 'person.fill',
  system: 'info.circle.fill',
}

/** Format an ISO timestamp into a human-readable relative string */
const formatTimestamp = (iso: string): string => {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  const diffHr = Math.floor(diffMs / 3_600_000)
  const diffDay = Math.floor(diffMs / 86_400_000)

  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay < 7) return `${diffDay}d ago`

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

/**
 * NotificationItem component.
 *
 * Renders a single notification row with type icon, title, body preview,
 * timestamp, and an unread indicator dot.
 */
const NotificationItemComponent: React.FC<NotificationItemProps> = ({
  notification,
  onPress,
}) => {
  const iconName = NOTIFICATION_TYPE_ICONS[notification.type] ?? 'bell'

  const handlePress = useCallback(() => {
    onPress(notification)
  }, [notification, onPress])

  return (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !notification.read && styles.notificationItemUnread,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${notification.read ? '' : 'Unread '}notification: ${notification.title}`}
      accessibilityHint="Tap to view notification details"
    >
      {/* Type icon */}
      <View style={styles.iconContainer}>
        <IconSymbol name={iconName} size={20} color="#1B5678" />
      </View>

      {/* Content */}
      <View style={styles.notificationContent}>
        <View style={styles.notificationTitleRow}>
          <Text
            style={[
              styles.notificationTitle,
              !notification.read && styles.notificationTitleUnread,
            ]}
            numberOfLines={1}
          >
            {notification.title}
          </Text>
        </View>
        <Text style={styles.notificationBody} numberOfLines={2}>
          {notification.body}
        </Text>
        <Text style={styles.notificationTimestamp}>
          {formatTimestamp(notification.timestamp)}
        </Text>
      </View>

      {/* Unread indicator dot */}
      {!notification.read && (
        <View style={styles.unreadDotContainer}>
          <View style={styles.unreadDot} />
        </View>
      )}
    </TouchableOpacity>
  )
}

const NotificationItem = React.memo(NotificationItemComponent)
NotificationItem.displayName = 'NotificationItem'

/**
 * NotificationsList component.
 *
 * Displays the notification inbox with a scrollable list of notifications.
 * Supports pull-to-refresh, empty state, and a header action to mark all
 * notifications as read.
 */
export const NotificationsList: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications()
  const [refreshing, setRefreshing] = React.useState(false)

  /** Handle notification press: mark as read */
  const handleNotificationPress = useCallback(
    (notification: AppNotification) => {
      if (!notification.read) {
        markAsRead(notification.id)
      }
    },
    [markAsRead]
  )

  /** Pull-to-refresh handler (re-renders the list) */
  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    // Simulate a brief refresh delay
    setTimeout(() => setRefreshing(false), 300)
  }, [])

  /** Stable key extractor */
  const keyExtractor = useCallback((item: AppNotification) => item.id, [])

  /** Render each notification item */
  const renderItem = useCallback(
    ({ item }: { item: AppNotification }) => (
      <NotificationItem
        notification={item}
        onPress={handleNotificationPress}
      />
    ),
    [handleNotificationPress]
  )

  /** "Mark all as read" header action */
  const headerRight = useMemo(
    () => (
      <TouchableOpacity
        style={styles.headerAction}
        onPress={markAllAsRead}
        disabled={unreadCount === 0}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Mark all notifications as read"
      >
        <Text
          style={
            unreadCount > 0
              ? styles.headerActionText
              : styles.headerActionTextDisabled
          }
        >
          Read All
        </Text>
      </TouchableOpacity>
    ),
    [markAllAsRead, unreadCount]
  )

  /** Empty state component */
  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <IconSymbol name="bell" size={36} color="#7eadc9" />
        </View>
        <Text style={styles.emptyTitle}>No notifications yet</Text>
        <Text style={styles.emptySubtitle}>
          When you receive messages, credential offers, or connection requests,
          they will appear here.
        </Text>
      </View>
    ),
    []
  )

  /** Footer spacer so content is not hidden behind the tab bar */
  const ListFooterComponent = useMemo(
    () => <View style={styles.listFooter} />,
    []
  )

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Notifications" rightComponent={headerRight} />
      <FlatList
        style={styles.content}
        data={notifications}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={notifications.length > 0 ? ListFooterComponent : null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#1B5678"
            colors={['#1B5678']}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={notifications.length === 0 ? { flex: 1 } : undefined}
      />
    </SafeAreaView>
  )
}
