export type IInboxContext = {
  changeClass: (className: string, type: 'add' | 'remove') => void
} | null
