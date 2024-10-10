export interface IMediaSearchResult {
  media: {
    src: string
    name: string
    thumbnail: string | null
  }[]
  users: {
    id: number
    name: string
    username: string
    avatarSrc: string | null
  }[]
}
