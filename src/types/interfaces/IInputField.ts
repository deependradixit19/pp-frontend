export interface IInputField {
  id: string
  type: string
  value: string | number
  label?: string
  changeFn(val: string | number): void
  validate?: string
  validationCheck?: (
    invalid: boolean,
    inputValue?: string,
    originalValidationMessage?: string | null
  ) => void | { isValid: boolean; message?: string }
  validationErrorMessage?: string
  validationCharactersNumber?: number
  inputvisible?: boolean
  swaptypeicon?: boolean
  swaptype?: () => void
  additionalProps?: { [key: string]: string }
  customClass?: string
  loginAttempted?: boolean
}
