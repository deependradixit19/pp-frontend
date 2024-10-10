import React from 'react'
import { IProfile } from './interfaces/IProfile'
import { IPollResponse, PollType } from './interfaces/ITypes'

/* --------------------------------------
  #AUTH
--------------------------------------- */
export interface quickRegistration {
  name: string
  username: string
  password: string
  password_confirmation: string
  email: string
  is_model: number
}

export interface userLogin {
  email: string
  password: string
  remember: boolean
}

/* --------------------------------------
  #FORM
--------------------------------------- */
export interface selectField {
  title: string
  changeFn: any
  selectedOption: string
  countryOptions?: Array<{
    name: string
    a2c: string
    a3c: string
    flag: string
  }>
}

/* --------------------------------------
  #UI
--------------------------------------- */
export interface centerCircle {
  children: React.ReactNode
  type: string
  id?: number
}

/* --------------------------------------
  #LAYOUTS
--------------------------------------- */
export interface basicLayout {
  title: string | React.ReactNode
  children: React.ReactNode
  headerNav?: Array<string>
  customClass?: string
  customHeaderLink?: any
  hideFooter?: boolean
  headerSize?: string
  customContentClass?: string
  headerRightEl?: React.ReactNode
  handleGoBack?(): void
  hideBackButton?: boolean
  verifyNavOpen?: boolean
  setVerifyNavOpen?(value: boolean): void
}
export interface desktopAdditionalContent {
  children?: React.ReactNode
}

export interface defaultLayout {
  title: string
  linkBack: string
  hasCover?: boolean
  hasNav?: boolean
  navLinks?: Array<{
    text: string
    name: string
  }>
  children: React.ReactNode
}

export interface profileHolderLayout {
  title: string
  linkBack: string
  data: any
  coverImg: string
  children: React.ReactNode
  userId?: number
}

/* --------------------------------------
  #STORIES
--------------------------------------- */
export type StoryActionType = 'click' | 'swipeLeft' | 'swipeRight' | 'swipeUp' | 'swipeDown' | 'longPress' | null

export type TypeStoryOrientation = 'Landscape' | 'Portrait'

export type StoryMessageType = {
  message: string
  type: 'story'
  recipient: number
}

export type NewStory = {
  schedule_date?: Date | null
  sound?: string
  background_color?: string
  text?: {
    value: string
    x: number
    y: number
  }
  videos?: {
    path: string
    orientation: TypeStoryOrientation
  }[]
  photo?: {
    path: string
    orientation: TypeStoryOrientation
  }
  poll?: {
    type: PollType
    question: string
    answers: string[] | null
  }
}

export type Story = {
  id: number
  user_id: number | null
  image_src: string | null
  background_color: string | null
  image_orientation: TypeStoryOrientation | null
  video_src: string | null
  video_orientation: TypeStoryOrientation | null
  liked: boolean
  like_count: number
  sound: any // no idea what are possible options
  duration: number
  seen: boolean
  user: {
    avatar: {
      id: number
      url: string
    }
  }
  statistics: {
    likes: []
    tipped: number
    views: {
      avatar: {
        created_at: string
        id: number
        url: string
      }
      id: number
    }[]
  } | null
  text: {
    value: string
    x: number
    y: number
  } | null
  poll: IPollResponse | null
  schedule_date?: Date
  created_at: Date
  // poll: {
  //   id: number | null;
  //   type: PollType;
  //   question: string;
  //   background_src: string | null;
  //   background_color: string | null;
  //   answers_count: { id: number; text: string; count: number }[] | null;
  //   answer: any; // same here
  //   is_answered: boolean | null;
  // } | null;
}

export type StoryPost = {
  all_stories_seen: boolean
  tips_sum: number | boolean
  stories_created_at: string
  stories: Story[]
  user: IProfile
  user_id: number
}

/* --------------------------------------
  #FEATURES
--------------------------------------- */
export interface header {
  title: string | React.ReactNode
  headerNav?: Array<string>
  linkBack?: any
  hideBackButton?: boolean
  rightElement?: React.ReactNode
}

export interface navigationBar {
  navArr: Array<string>
  type: string
  customClass?: string
  chosenListId?: number
  onApply?: (id: number) => void
}

export interface post {
  active: boolean
  audience: boolean
  body: string
  created_at: string
  id: number
  isLiked: boolean
  likes_count: number
  photo_count: number
  photos: any
  schedule_date: string | null
  sound_count: number
  type: boolean
  updated_at: string | null
  user_id: number
  video_count: number
  videos: any
}

/* --------------------------------------
  #SETTINGS
--------------------------------------- */
export interface accountSettings {
  display_name: string
  username: string
  email: string
  page: string
  setCurrentValue?: any
}

/* --------------------------------------
  #USER
--------------------------------------- */
export interface User {
  id: number
  name: string
  avatar: any
  croppedAvatar: any
  message: string | null
  online: boolean
  fans?: number
  display_name: string
  username: string
  follower_count: number
  friend_count: number
  close: any
  [key: string]: any
}

/* --------------------------------------
  #LIST FILTERS
--------------------------------------- */
type SortingElement = {
  value: string
  name: string
  default?: boolean
  selectOptions?: { value: string | number; label: string | number }[]
  isToggle?: boolean
}

export type ListSorting = {
  first_section: Array<SortingElement>
  second_section?: Array<SortingElement>
  third_section?: Array<SortingElement>
}

export type ListFilter = {
  type: 'sort' | 'filter'
  elements: ListSorting
  hasResetBtn?: boolean
}

/* --------------------------------------
  #QUERY PARAMS
--------------------------------------- */
export type QueryParams = { [key: string]: string | number }

// LIKEABLE TYPES
export type LikeableType = 'comment' | 'post' | 'tip' | 'message' | 'notification'
