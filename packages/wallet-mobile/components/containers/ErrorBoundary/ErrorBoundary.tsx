import { IconSymbol } from '@/components/ui/icon-symbol'
import { createLogger } from '@/utils/logger'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { ErrorBoundaryProps, ErrorBoundaryState } from './ErrorBoundary.interfaces'
import { styles } from './ErrorBoundary.styles'

const log = createLogger('ErrorBoundary')

/**
 * ErrorBoundary component.
 *
 * Catches JavaScript errors in child component tree and
 * displays a fallback UI instead of crashing the app.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    log.error('Caught error', error, { componentStack: errorInfo.componentStack ?? '' })
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <View style={styles.container}>
          <IconSymbol name="exclamationmark.triangle" size={48} color="#1B5678" style={styles.icon} />
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            An unexpected error occurred. Please try again.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={this.handleRetry}
            accessibilityRole="button"
            accessibilityLabel="Try again"
          >
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
          {__DEV__ && this.state.error && (
            <View style={styles.errorDetails}>
              <Text style={styles.errorText}>{this.state.error.message}</Text>
            </View>
          )}
        </View>
      )
    }

    return this.props.children
  }
}
