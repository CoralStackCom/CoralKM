export interface TabItem<T extends string = string> {
  /** Unique tab key */
  key: T

  /** Label displayed in the tab */
  label: string
}

export interface TabsProps<T extends string = string> {
  /** List of tabs */
  tabs: TabItem<T>[]

  /** Currently active tab key */
  activeTab: T

  /** Callback fired when a tab is selected */
  onTabChange: (tab: T) => void
}
