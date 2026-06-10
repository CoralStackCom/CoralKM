/**
 * Tabs context value.
 */
export interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

/**
 * Tabs component.
 *
 * Provides a controlled tab system with shared state
 * between triggers and content.
 */
export interface TabsProps {
  defaultValue: string
  children?: React.ReactNode
  onValueChange?: (value: string) => void
}
export interface TabsListProps {
  children?: React.ReactNode
}

export interface TabsTriggerProps {
  value: string
  children?: React.ReactNode
}

export interface TabsContentProps {
  value: string
  children?: React.ReactNode
}
