import { Channel } from 'pusher-js'
import { FC, createContext, useState, useContext } from 'react'
import { IProfile } from '../types/interfaces/IProfile'

const defaultValues = {
  ability_change_avatar: false,
  ability_change_cover: false,
  avatar: {
    created_at: '',
    id: 0,
    url: ''
  },
  cover: {
    created_at: '',
    id: 0,
    url: ''
  },
  cropped_avatar: {
    created_at: '',
    id: 0,
    url: ''
  },
  cropped_cover: {
    created_at: '',
    id: 0,
    url: ''
  },
  currently_streaming: false,
  display_name: '',
  email: '',
  follower_count: 0,
  friend_count: 0,
  id: 0,
  isSubscribed: false,
  last_logged_at: '',
  online_status: false,
  photo_count: 0,
  post_like_count: 0,
  premium_video_count: 0,
  role: '',
  show_cam_request_button: false,
  show_currently_streaming: false,
  show_feed: false,
  show_friend_button: false,
  show_header: false,
  show_last_logged_at: false,
  show_message_button: false,
  show_online_status: false,
  show_social_trade_button: false,
  show_stories: [1],
  show_subscribe_button: false,
  show_tip_button: false,
  username: '',
  video_count: 0
}

export const UserContext = createContext<any>(defaultValues)

export const UserProvider: FC<{
  children: JSX.Element | JSX.Element[]
}> = ({ children }) => {
  const [userLoading, setUserLoading] = useState(true)
  const [user, setUser] = useState<IProfile>({
    ability_change_avatar: false,
    ability_change_cover: false,
    avatar: {
      created_at: '',
      id: 0,
      url: ''
    },
    cover: {
      created_at: '',
      id: 0,
      url: ''
    },
    cropped_avatar: {
      created_at: '',
      id: 0,
      url: ''
    },
    cropped_cover: {
      created_at: '',
      id: 0,
      url: ''
    },
    autoplay: 0,
    currently_streaming: false,
    display_name: '',
    email: '',
    follower_count: 0,
    friend_count: 0,
    first_name: '',
    id: 0,
    isSubscribed: false,
    last_logged_at: '',
    last_name: '',
    language: { id: 0, name: '', code: '' },
    name: '',
    online_status: false,
    photo_count: 0,
    post_like_count: 0,
    premium_video_count: 0,
    role: '',
    show_cam_request_button: false,
    show_currently_streaming: false,
    show_feed: false,
    show_friend_button: false,
    show_header: false,
    show_last_logged_at: false,
    show_message_button: false,
    show_online_status: false,
    show_social_trade_button: false,
    show_stories: false,
    show_subscribe_button: false,
    show_tip_button: false,
    show_follow_count: false,
    show_friend_list: false,
    show_like_count: false,
    show_mini_bio: false,
    username: '',
    video_count: 0,
    friends: '',
    mini_bio: '',
    stories: [],
    auto_post_to_twitter: false,
    post_preview_type: null,
    status: ''
  })
  const [isPlayerMuted, setIsPlayerMuted] = useState<boolean>(false)

  const [notificationsChannel, setNotificationsChannel] = useState<Channel>()

  return (
    <UserContext.Provider
      value={{
        ...user,
        setUser,
        userLoading,
        setUserLoading,
        isPlayerMuted,
        setIsPlayerMuted,
        notificationsChannel,
        setNotificationsChannel
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => useContext(UserContext)
