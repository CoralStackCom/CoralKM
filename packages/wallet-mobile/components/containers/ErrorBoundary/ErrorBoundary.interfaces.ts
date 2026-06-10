import { ReactNode } from 'react'

/**
 * Interfaces for ErrorBoundary component.
 */
export interface ErrorBoundaryProps {
  /** Child components to wrap */
  children: ReactNode
  /** Optional fallback component to show on error */
  fallback?: ReactNode
  /** Optional callback when error is caught */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}
