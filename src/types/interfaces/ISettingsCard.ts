export interface ISettingsCard {
  icon?: string
  body?: string
  info?: string
  currentData?: string
  hasToggle?: boolean
  toggleFn?: () => void
  toggleActive?: boolean
  link?: string
  absFix?: boolean
  hasArrow?: boolean
  clickFn?: () => void
}
