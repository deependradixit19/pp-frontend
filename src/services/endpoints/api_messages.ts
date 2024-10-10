import axios from 'axios'
import axiosInstance from '../http/axiosInstance'
import { IMessage } from '../../types/interfaces/IMessage'
import { attachPhoto, attachVideo, attachAudio } from './attachments'
import { StoryMessageType } from '../../types/types'

export const createChat = async (ids: {}, link?: string) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: link || `/api/chat/conversation/group`,
    data: ids
    // url: `api/chat/conversation/${id}`,
  })
  return data
}

export const getChatMessages = async (id: number | null, params: { page: number; search: string | null }) => {
  if (id) {
    const { data } = await axiosInstance({
      method: 'get',
      url: `api/chat/messages/${id}`,
      params
    })
    return data
  }
}

export const reactToMessage = async (type: string, message_id: number) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: `api/chat/messages/add_reaction`,
    data: {
      type,
      message_id
    }
  })
  return data
}

export const deleteChatMessage = async (message_id: number) => {
  const { data } = await axiosInstance({
    method: 'delete',
    url: `api/chat/message/${message_id}`
  })
  return data
}

export const sendChatMessage = async (
  message: IMessage,
  recipients?: {
    group?: number[] | number | null
    recipient?: number[] | number | null
    conversation_id?: number | null
  },
  type: string = 'text'
) => {
  let messageData = {
    ...message,
    group: recipients?.group,
    recipient: recipients?.recipient,
    conversation_id: recipients?.conversation_id,
    type
  }

  if (!recipients?.group) {
    delete messageData.group
  }

  if (!recipients?.recipient) {
    delete messageData.recipient
  }

  if (!recipients?.conversation_id) {
    delete messageData.conversation_id
  }

  const { data } = await axiosInstance({
    method: 'post',
    url: `api/chat/message`,
    data: messageData
  })
  return data
}

export const sendStoryMessage = async (payload: StoryMessageType) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: `api/chat/message`,
    data: payload
  })
  return data
}

export const deleteChat = async (id: number | null) => {
  if (id) {
    const { data } = await axiosInstance({
      method: 'delete',
      url: `api/chat/conversation/${id}`
    })
    return data
  }
}

export const getChats = async (params: { page: number; search: string | null; sort: string | null }) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `api/chat/conversations`,
    params
  })
  return data
}

export const getChatParticipants = async (id: number | null) => {
  if (id) {
    const { data } = await axiosInstance({
      method: 'get',
      url: `api/chat/conversation/users/${id}`
    })
    return data
  }
}

export const getQuickChats = async () => {
  const { data } = await axiosInstance({
    method: 'GET',
    url: 'api/chat/quick-contacts'
  })

  return data
}

export const typing = async (conversation_id: number) => {
  const { data } = await axiosInstance({
    method: 'POST',
    url: `api/chat/typing`,
    data: {
      conversation_id
    }
  })
  return data
}

export const notTyping = async (conversation_id: number) => {
  const { data } = await axiosInstance({
    method: 'POST',
    url: `api/chat/noTyping`,
    data: {
      conversation_id
    }
  })
  return data
}

export const muteConversation = async (params: { new_message: 0 | 1; other_user_id: number }) => {
  const { data } = await axiosInstance({
    method: 'PUT',
    url: '/api/user/notification-setting-types',
    data: {
      new_message: params.new_message,
      other_user_id: params.other_user_id,
      type: 'in_app'
    }
  })

  return data
}

export const getMassMessages = async () => {
  const { data } = await axiosInstance({
    method: 'GET',
    url: '/api/chat/mass-messages'
  })

  return data
}

export const getGifById = async (id: number | string) => {
  const { data } = await axios({
    method: 'GET',
    url: `https://api.giphy.com/v1/gifs/${id}?api_key=${process.env.REACT_APP_GIPHY_KEY}`
  })

  return data
}

export const purchaseMessage = async (params: { message_id: number; payment_method: string }) => {
  const { data } = await axiosInstance({
    method: 'post',
    data: params,
    url: '/api/chat/messages/buy'
  })

  return data
}

export const getPolls = async () => {
  const { data } = await axiosInstance({
    method: 'GET',
    url: '/api/post/poll/ask-poll'
  })

  return data
}

export const deleteMassMessage = async (id: number | string) => {
  const { data } = await axiosInstance({
    method: 'DELETE',
    url: `/api/chat/mass-message/${id}`
  })

  return data
}
