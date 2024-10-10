/* ---------------------------------
  SUBSCRIPTION
-----------------------------------*/
export interface iSubscriptionPlan {
  created_at: string
  discount: number
  id: number
  month_count: number
  name: string
  price: number
  updated_at: string
  user_id: number
}

export interface iSubscriptionCard {
  id?: number
  type?: string
  isSelected?: boolean
  icon?: string | JSX.Element | JSX.Element[]
  name?: string | JSX.Element | JSX.Element[]
  subname?: string | JSX.Element | JSX.Element[]
  price?: number
  discount?: number
  isActive?: boolean
  clickFn?: () => void
  switchFn?: () => void
  modalFn?: () => void
  editFn?: () => void
  deleteFn?: () => void
  descritpion?: string | JSX.Element | JSX.Element[]
  selectable?: boolean
  alwaysExpanded?: boolean
  hideArrow?: boolean
  customClass?: string
  hideEdit?: boolean
  hideToggle?: boolean
  monthCount?: number
  displayMonthlyPrice?: boolean
}

export interface IPaymentPlan {
  id: number
  user_id?: number
  price: number
  name: string
  month_count: number
  discount?: number
  active?: number
  created_at?: Date
  updated_at?: Date
}

/* ---------------------------------
  SESSIONS
-----------------------------------*/
export interface iLoginSession {
  abilities: any
  browser: string
  created_at: string
  device_name: string
  id: number
  is_desktop: boolean
  is_mobile: boolean
  is_tablet: boolean
  last_used_at: string
  name: string
  os: string
  tokenable_id: number
  tokenable_type: string
}

/* ---------------------------------
  NOTIFICATIONS
-----------------------------------*/
export interface iNotificationsSettings {
  id: number
  notificationSettings: {
    [key: string]: boolean
  }
  email: {
    [key: string]: boolean | number | string
    id: number
    type: string
  }
  in_app: {
    [key: string]: boolean | number | string
    id: number
    type: string
  }
  push: {
    [key: string]: boolean | number | string
    id: number
    type: string
  }
  sms: {
    [key: string]: boolean | number | string
    id: number
    type: string
  }
}

/* ---------------------------------
  MESSAGES
-----------------------------------*/
export interface iMessage {
  body: string
  created_at: string
  id: number
  is_purchased: boolean | null
  is_seen: boolean
  is_sender: boolean
  photos: Array<iFile>
  price: number
  read_at: string
  replied_message: any
  sounds: Array<iFile>
  videos: Array<iFile>
}

export interface iNewMessage {
  text: string
  audioMessage: any
  audioPreview: any
  media: Array<File>
  previewMedia: Array<string>
  vaultImages: Array<string>
  price: number
  replied_message?: string
  audience?: any
  schedule_date?: string
}

/* ---------------------------------
  CARDS
-----------------------------------*/
export interface iActionCard {
  link?: string | {}
  icon?: string | JSX.Element | JSX.Element[]
  text?: string | JSX.Element | JSX.Element[]
  avatar?: string | JSX.Element | JSX.Element[]
  subtext?: string | JSX.Element | JSX.Element[]
  suptext?: string | JSX.Element | JSX.Element[]
  description?: string | JSX.Element | JSX.Element[] | { (): void }
  bottomArea?: string | JSX.Element | JSX.Element[]
  hasArrow?: boolean
  hasToggle?: boolean
  hasToggleWithText?: boolean
  toggleText?: string
  toggleActive?: any
  toggleFn?: () => void
  hasRadio?: boolean
  hasWire?: boolean
  wireText?: string
  hasTrash?: boolean
  trashFn?: () => void
  clickFn?: (e: any) => void
  customClass?: string
  absFix?: boolean
  inputId?: string
  pendingNumber?: number
  customHtml?: ((argument?: any) => JSX.Element | JSX.Element[]) | JSX.Element | JSX.Element[]
  selected?: boolean
  hasEdit?: boolean
  editFn?: () => void
  mediumIcon?: boolean
  dropDownContent?: string | JSX.Element | JSX.Element[]
  linkInArrow?: boolean
  disabled?: boolean
}

export interface iChatCard {
  conversation_id: number
  avatar: string
  name: string
  username: string
  message: string
  time: string
  number: string | number
}

/* ---------------------------------
  POST
-----------------------------------*/
export interface iFile {
  caption: string | null
  created_at: string
  id: number
  order: number
  thumbnail_src?: string | null
  url: string
}

export interface iPost {
  active: number
  audience: string
  body: string | null
  created_at: string
  id: number
  isLiked: boolean
  likes_count: number
  photo_count: number
  photos: Array<iFile>
  price: number | null
  schedule_date: string | null
  shared_post: any | null
  shared_post_id: number | null
  sound_count: number
  sounds: any
  updated_at: string
  user_id: number
  video_count: number
  videos: Array<iFile>
}

export interface iComment {
  comment: string
  user_id: number
  entity_id: number
  entity_type: string
  updated_at: string
  created_at: string
  id: number
  photos: Array<iFile>
  videos: Array<iFile>
  sounds: Array<iFile>
}

export interface ProgressValue {
  name: string
  percentage: number
  size: number
  type: string
  cancel?: () => void
}

export interface IReportType {
  id: number
  text: string
  type: string
  created_at: string
  updated_at: string
}
export interface IOption {
  icon: JSX.Element | string
  text: string
  disabled: boolean
  action(id: number): void
}
