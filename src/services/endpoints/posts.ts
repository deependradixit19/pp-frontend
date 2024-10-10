import { ITipPayload } from '../../types/interfaces/ITypes'
import axiosInstance from '../http/axiosInstance'

type Post = {
  shareOnTwitter: boolean
  sounds: {
    path: any
    locked: any
    order: number
  }[]
  price: number | null
  schedule_date: Date | null
  groups: number[]
  videos: {
    path: any
    orientation: any
    active_thumbnail: null
    locked: any
    video_clip: {
      start: any
      end: any
    } | null
    order: number
  }[]
  body: string
  photos: {
    path: string
    orientation: string | undefined
    locked: boolean
    order: number
  }[]
}

export const uploadPost = async (post: Post) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: '/api/post',
    data: post
  })
  return data
}

export const deletePost = async (postId: number) => {
  const { data } = await axiosInstance({
    method: 'delete',
    url: `/api/post/${postId}`
  })
  return data
}

export const uploadPoll = async (poll: any) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: '/api/post/poll',
    data: poll
  })
  return data
}
export const uploadGoal = async (goal: any) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: '/api/post/goal',
    data: goal
  })
  return data
}

export const sendTipToPost = async (payload: ITipPayload) => {
  const { data } = await axiosInstance({
    method: 'POST',
    url: '/api/user/tipp-post',
    data: payload
  })
  return data
}

export const pinPost = async (postId: number) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: `/api/post/pin/${postId}`
  })
  return data
}

export const answerPoll = async (variables: any) => {
  const { pollId, answer, answerId } = variables
  let answerData
  if (answer) {
    answerData = {
      answer
    }
  }
  if (answerId) {
    answerData = {
      answer_id: answerId
    }
  }
  const { data } = await axiosInstance({
    method: 'post',
    url: `/api/post/poll/${pollId}/answer`,
    data: answerData
  })
  return data
}

export const editPost = async (post: any, id: number) => {
  const { data } = await axiosInstance({
    method: 'put',
    url: `/api/post/${id}`,
    data: post
  })
  return data
}

export const editPostPrice = async (price: { price: number | string }, id: number) => {
  const { data } = await axiosInstance({
    method: 'put',
    url: `/api/post/change-post-price/${id}`,
    data: price
  })
  return data
}

export const purchasePremiumPost = async (postId: number) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: '/api/post/buy',
    data: { post_id: postId }
  })
  return data
}

export const getUserGroups = async () => {
  const { data } = await axiosInstance({
    method: 'get',
    url: '/api/user/groups'
  })

  return data
}

export const getGroupsForSinglePost = async (id: number) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/user/groups?post_id=${id}`
  })

  return data
}

export const getSinglePost = async (postId: number) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/post/${postId}`
  })

  return data
}

export const getPaginatedPost = async (postId: number) => {
  const data = await getSinglePost(postId)

  return {
    pages: [
      {
        page: {
          data: {
            data: [
              {
                ...data?.data
              }
            ]
          }
        }
      }
    ]
  }
}

export const getPostComments = async (id: number, page: number) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/post/${id}/comments?page=${page}`
  })
  return data
}

export const getPostCommentsInfinite = async (id: number, currentPage: number = 1) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/post/${id}/comments?page=${currentPage}`
  })
  return {
    nextCursor: currentPage < data.meta['last_page'] ? currentPage + 1 : undefined,
    prevCursor: currentPage > 1 ? currentPage - 1 : undefined,
    page: {
      data
    }
  }
}

export const postNewComment = async (id: number, comment: string) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: `/api/comment/post/${id}`,
    data: { comment }
  })
  return data
}

export const postNewReply = async (tmpData: { id: number; reply: string }) => {
  const { id, reply } = tmpData
  const { data } = await axiosInstance({
    method: 'post',
    url: `/api/comment/comment/${id}`,
    data: { comment: reply }
  })
  return data
}

export const getCommentReplies = async (id: number) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/comment/${id}/comments`
  })
  return data
}

export const getComment = async (id: number) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/comment/${id}`
  })
  return data
}

export const postStorySeen = async (id: number) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: `/api/story/view/${id}`
  })
  return data
}
