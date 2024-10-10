export interface ICheckboxCard {
  id: string
  text: string
  checked: boolean
  checkFn: () => void
  checkboxType: string
}
