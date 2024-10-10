export interface IInputCard {
  hasAvatar?: boolean
  hasIcon?: boolean
  icon?: any
  type: string
  label: string
  value: string | number
  changeFn: any
  keyDownFn?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  errorActive?: boolean
  errorMessage?: string
  hasTypeChanger?: boolean
  validate?: string
  customClass?: string
  isTextArea?: boolean
  hasDesc?: boolean
  desc?: string
  info?: string
  disabled?: boolean
  maxChars?: number
  iconRight?: boolean
  iconSmaller?: boolean
  placeholder?: string
  validateFn?: (value: string) => any
  hasError?: (value: boolean) => any
  isValid?: boolean
  blurFn?: () => void
  focusFn?: () => void
  mask?: string | JSX.Element | JSX.Element[]
}
