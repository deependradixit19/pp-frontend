export interface IPreviewFile {
  id: number
  order: number | null
  orientation: string
  preview: { src: string; type: string }
}
