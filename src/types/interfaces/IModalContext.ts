export interface IModalContext {
  title: string
  window: JSX.Element | null
  withoutTitle?: boolean
  withoutCloseIcon?: boolean
  customClass?: string
  withScroll?: boolean
}
