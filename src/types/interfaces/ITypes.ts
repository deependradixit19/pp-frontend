import { Story } from '../types'
import { IFile } from './IFile'
import { IProfile } from './IProfile'
import { ITextObject } from './ITextObject'

// export interface IFile {
//   caption: string | null;
//   created_at: string;
//   id: number;
//   order: number;
//   thumbnail_src?: string | null;
//   url: string;
// }
export interface IPollResponse {
  id: number
  type: PollType
  question: string
  background_src: string | null
  background_color: string | null
  answers_count: [{ id: number; text: string; count: number }]
  is_answered: number | string | null
  answer: string | null
}
// id: number | null;
// type: PollType;
// question: string;
// background_src: string | null;
// background_color: string | null;
// answers_count: {
//   id: number;
//   text: string;
//   count: number;
// }
// [] | null;
// answer: any; // same here
// is_answered: boolean | null;
export interface IGoalResponse {
  background_color: string | null
  background_src: string | null
  goal: number
  id: number
  text: string
  tipped: number
}
export interface IStoryResponse {
  id: number
  user_id: number
  image_src: string | null
  image_orientation: string | null
  background_color: string | null
  video_src: string | null
  video_orientation: string | null
  sound: string | null
  text: {
    value: string | null
    x: number | null
    y: number | null
  }
  poll: IPollResponse | null
  seen: boolean
}
export interface ILiveResponse {
  active: number
  created_at: string | Date
  finished: number
  id: number
  img_url: string
  img_orientation: string
  schedule_date: string | Date | null
  updated_at: string | Date
  user_id: number
}

export interface IPost {
  active: number
  all_stories_seen: boolean
  audience: string
  body: string | null
  created_at: string
  comment_count: number
  encode_status: string
  id: number
  isLiked: boolean
  is_purchased: boolean
  is_pinned: boolean
  is_engage: boolean
  free: boolean
  likes_count: number
  photo_count: number
  photos: Array<IFile>
  photos_preview: Array<IPostMediaPreview>
  price: number | null
  overall_revenue: number
  purchases_count: number
  purchases_sum: number
  tips_count: number
  tips_sum: number
  conversion_rate: number | boolean
  unique_impressions: number
  unique_views: number
  views: number
  stories_created_at: string
  schedule_date: string | null
  shared_post: any | null
  shared_post_id: number | null
  sound_count: number
  sounds: any
  updated_at: string
  user_id: number
  video_count: number
  videos: Array<IFile>
  videos_preview: Array<IPostMediaPreview>
  isHomeFeed?: boolean
  user: IProfile
  last_3_comments: IComment[]
  poll: IPollResponse | null
  goal: IGoalResponse | null
  stories: Story[]
  live: ILiveResponse | null
  tags: IPostTag[]
}

export interface IPostFile {
  name: string
  text: string | null
  mentions: IPostTag[]
  media: IFile[]
  minimizedName: string
  minimizedAvatar: string
}

export interface IPostTag {
  created_at: string
  end: number
  id: number
  start: number
  taggable_id: number
  taggable_type: string
  updated_at: string
  user_id: number
  user: IProfile
}
export interface IPostMediaPreview {
  id: number
  order: number
  orientation: string
  preview: IPostVideoPreview | IPostImagePreview
}

export interface IPostVideoPreview {
  active: number
  created_at: string
  id: number
  src: string
  type: string
  updated_at: string
  video_id: number
  orientation: string
}
export interface IPostImagePreview {
  src: string
  type: string
  orientation: string
}

export interface IStatsData {
  overallRevenue: number
  purchasesCount: number
  purchasesSum: number
  tipsCount: number
  tipsSum: number
  conversionRate: number | boolean
  uniqueImpressions: number
  views: number
  uniqueViews: number
}

export interface IPostMediaCounter {
  [key: string]: number | null
}

export type PollType = 'poll' | 'yes/no' | 'ask'

export interface IPoll {
  type: PollType
  question: string
  pollBg: string
  pollBgImg: File | null
  answers: string[] | null
}
export interface IGoal {
  title: string
  amount: string
  goalBg: string
  goalBgImg: File | null
}

export interface IComment {
  comment: string
  comment_count: number
  like_count: number
  isLiked: boolean
  user_id: number
  entity_id: number
  entity_type: string
  updated_at: string
  created_at: string
  id: number
  photos: Array<IFile>
  videos: Array<IFile>
  sounds: Array<IFile>
  user?: IProfile | { first_name: string; last_name: string; id: number }
}

export interface IGroup {
  id: number
  name: string
  users: IGroupElement2[]
  date_added: Date
  default: number
  primary: number
  selected?: boolean
}

export interface IExtendedGroup extends IGroup {
  count: number
  avatars: string[]
}

export interface IGroupElement {
  avatars: string[];
  count: number;
};

export interface IGroupElement2 {
  avatar: {
    created_at: string
    id: number
    url: string
  }
  cropped_avatar: {
    created_at: string
    id: number
    url: string
  }
  fans: number
  id: number
  name: string
  online_status: boolean
  username: string
}

export interface InfiniteData<TData> {
  pages: TData[]
  pageParams: unknown[]
}

export interface IInfinitePage {
  nextCursor: number | undefined
  page: {
    data: { data: IPost[] }
  }
}
export interface IInfinitePages<TData> {
  nextCursor: number | undefined
  page: {
    data: { data: TData[] }
  }
}

export interface ITransactionsInfinitePage {
  data: {
    current_page: number
    last_page: number
    total: number
    data: {
      amount: number
      avatar: string
      date: string
      error: any
      name: string
      username: string
      orderId: number
      product: string
    }[]
    status: number
  }
}

export interface IInfiniteNotifications {
  nextCursor: number | undefined
  page: {
    data: { data: any }
  }
}

export interface IInfiniteCommentsPage {
  nextCursor: number | undefined
  page: {
    data: {
      data: IComment[]
    }
  }
}

export interface ITag {
  user_id: number
  start: number
  end: number
}

export interface INewPost {
  body: string
  tags: ITag[]
  groups: number[]
  categories: number[]
  price: number | null
  schedule_date: Date | null
  shareOnTwitter: boolean
  photos: {
    order: number
    orientation: string
    path: string
    text?: Partial<ITextObject>
  }[]
  sounds: { order: number; orientation: string; path: string }[]
  videos: { order: number; orientation: string; path: string }[]
}

export interface IProgressInfo {
  percentage: number
  cancel: () => void
  error: string
  fileName: string
  previewUrl: string
  storageUrl: string
  locked: boolean
  type: string
  orientation?: string
  duration?: number
  thumbnails?: string[]
  imagePreview?: string
  trimPreview?: { start: number; end: number }
  previewOn?: boolean
  id: number
  text?: ITextObject
  thumbType?: 'clip' | 'thumb'
}

export interface IMediaItem {
  id: number
  url: string
  caption?: any
  order: number
  created_at?: Date
  text?: ITextObject
}

export interface ICategory {
  id: number
  name: string
  posts: number
  premium: number
  stories: number
  messages: number
  selected: boolean
}

export interface IPlaylist {
  playlist_info: {
    id: number
    playlist_name: string
    user_id: number
  }
  media_counters: {
    id: number
    video_sum: number
    photo_sum: number
    sound_sum: number
  }
}

export interface ILanguage {
  id: number
  name: string
  code: string
}

export interface IAutoRecharge {
  enabled?: boolean
  is_active?: boolean
  minimum_amount?: number
  recharge_amount?: number
}

export interface ITipPayload {
  post_id?: number
  model_id?: number
  card_id?: number
  amount: string
  payment_method?: string
}

export interface ISubscribePayload {
  id: number
  subscription_plan_id: number
  payment_method: string
  card_id?: number
  promo_campaign_id?: number | null
}

export interface ISubscriptionHistoryItem {
  avatarSrc: string | null
  coverSrc: string
  croppedAvatarSrc: string | null
  userId: number
  userName: string
  newPosts: number
}
export interface ISubscriptionList {
  avatars: string[]
  count: number
  default: null
  id: number
  name: string
  selected: boolean
}

export type postType = 'story' | 'stream' | 'post' | 'message'

export interface ISchedule {
  groups: { name: string; count: number }[]
  id: number
  schedule_date: string
  thumb: {
    color: string | null
    thumb: string | null
  }
  live_id: number | null
  message_id: number | null
  post_id: number | null
  story_id: number | null
  type: postType
}

export interface IScheduledListDate {
  date: {
    dayOfMonth: number
    nameOfDay: number
  }
  list: IScheduleListElement[]
}

export interface IScheduleListElement {
  postId: number
  postType: postType
  imageUrl: string | null
  groups: {
    name: string
    participants_count: number
  }[]
  scheduledDate: Date
}

export interface ISalesTransaction {
  amount: number
  avatar: string | null
  date: string
  id: number
  name: string
  product: 'subscription' | 'tip'
  fee: number
  gross: number
}
