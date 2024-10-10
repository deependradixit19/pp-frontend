export interface IMessage {
  text: string
  audience?: any
  audioMessage: any
  audioPreview: any
  media: Array<File>
  previewMedia: Array<string>
  vaultImages: Array<string>
  price: number
}

export interface IGroupMessage {
  audience: any
  text: string
  audioMessage: any
  audioPreview: any
  media: Array<File>
  previewMedia: Array<string>
  price: number | null
}

export interface IMassMessage {
  id: number
  body: string
  user_id: number
  sent: number
  viewed: number
  purchased_count: number
  message_price: number
  purchased_price: number
  photos_count: number
  videos_count: number
  sounds_count: number
  category: string
  sent_date: string
}
