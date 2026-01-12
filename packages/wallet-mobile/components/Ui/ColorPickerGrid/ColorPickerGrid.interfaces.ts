export interface ColorOption {
  /* Unique key for the color */
  key: string
  /* Color value */
  value: string // hex / rgb
}

export interface ColorPickerGridProps {
  /* Available color options */
  colors: ColorOption[]
  /* Currently selected color key */
  value: string
  /* Callback when a color is selected */
  onChange: (key: string) => void
  /* Number of columns in the grid */
  columns?: number
}
