import { ILanguage } from './ITypes'

export interface IProfile {
  ability_change_avatar: boolean
  ability_change_cover: boolean
  avatar: {
    created_at: string
    id: number
    url: string
  }
  cover: {
    created_at: string
    id: number
    url: string
  }
  cropped_avatar: {
    created_at: string
    id: number
    url: string
  }
  cropped_cover: {
    created_at: string
    id: number
    url: string
  }
  autoplay: number
  auto_post_to_twitter: boolean
  currently_streaming: boolean
  display_name: string
  email: string
  follower_count: number
  friend_count: number
  first_name: string
  id: number
  isSubscribed: boolean
  last_logged_at: string
  last_name: string
  language: ILanguage
  name: string
  online_status: boolean
  photo_count: number
  post_like_count: number
  premium_video_count: number
  role: string
  post_preview_type: string | null
  show_cam_request_button: boolean
  show_currently_streaming: boolean
  show_feed: boolean
  show_friend_button: boolean
  show_header: boolean
  show_last_logged_at: boolean
  show_message_button: boolean
  show_online_status: boolean
  show_social_trade_button: boolean
  show_stories: boolean
  show_subscribe_button: boolean
  show_tip_button: boolean
  show_follow_count: boolean
  show_friend_list: boolean
  show_like_count: boolean
  show_mini_bio: boolean
  username: string
  video_count: number
  friends: any
  mini_bio?: string
  stories: []
  payout_frequency?: string
  payout_method?: string
  status: string
}
