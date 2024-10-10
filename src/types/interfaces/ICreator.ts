export interface ICreator {
  coverUrl: string
  avatarUrl: string
  name: string
  handle: string
  isLive: boolean
  isActive: boolean
  isOnline: boolean
  price: number
  save: number | null
  userId: number
  initialSubscriptionDate?: string
  numberOfSubs?: number
  subscribed?: boolean
  registeredAt: any
}

export interface ISubscriptionModelsServerResponse {
  id: number
  cover: {
    id: number
    url: string
    created_at: string
  }
  avatar: {
    id: number
    url: string
    created_at: string
  }
  name: string
  username: string
  online_status: boolean
  is_live: boolean
}
