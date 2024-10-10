export interface IProfileInfo {
  id: number
  role: string
  display_name: string
  follower_count: number
  friend_count: number
  post_like_count: number
  avatar: string
  username: string
  show_stories: boolean
  show_friend_button: boolean
  isSubscribed: boolean
  friendRequest: (id: number) => void
  friends_status: any
  setSubscribeModalOpen: (key: boolean) => void
  mini_bio?: string
  show_follower_count: boolean
  show_friends_count: boolean
  show_likes_count: boolean
  show_mini_bio: boolean
  setPlanId: any
  setCampaign: any
}
