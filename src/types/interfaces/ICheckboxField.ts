export interface ICheckboxField {
  id: string
  value: string
  label: string | JSX.Element
  checked: boolean
  changeFn(): void
  customClass?: string
}
