export interface IButton {
  text?: string
  type: string
  hasIcon?: boolean
  icon?: string
  iconBg?: string
  disabled?: boolean
  customClass?: string
  clickFn?: () => void
}
