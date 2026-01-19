export interface MenuItem {
  /// Icon for the menu item
  icon: any
  /// Label for the menu item
  label: string
  /// Action to perform on press
  onPress: () => void
}
