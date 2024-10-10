export interface IProfileHolder {
  id: number
  online: boolean
  role: string
  last_logged_at: string
  cover: string | null
  // cover: string | null;
  // cropped_cover: string | null;
  avatar: string | null
  // avatar: string | null;
  // cropped_avatar: string | null;
  display_name: string
  follower_count: number
  friend_count: number
  post_like_count: number
  username: string
  show_stories: boolean
  show_friend_button: boolean
  refetchProfileData: () => void
  isSubscribed: boolean
  friends_status: any
  photo_count: number
  premium_video_count: number
  video_count: number
  hideCount?: boolean
  mini_bio?: string
  stories: []
  subscribeModalOpen: boolean
  setSubscribeModalOpen: any
  show_follower_count: boolean
  show_friends_count: boolean
  show_likes_count: boolean
  show_mini_bio: boolean
  show_online_status: boolean
  status: string
}
