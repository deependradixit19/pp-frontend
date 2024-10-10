import axiosInstance from '../http/axiosInstance'
import { setQueryParameters } from '../../helpers/util'
import { QueryParams } from '../../types/types'
import { ISubscribePayload, ITipPayload } from '../../types/interfaces/ITypes'

/* -------------------------
Get profile
--------------------------*/
export const getProfile = async () => {
  const { data } = await axiosInstance({
    method: 'get',
    url: '/api/user/profile'
  })
  return data?.data
}

export const getPerformer = async (id: any) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/user/${id}/profile`
  })
  return data?.data
}

export const getFanDetails = async (id: number) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/user/analytic/fan/${id}`
  })
  return data
}

export const subscribeToUser = async ({
  id,
  subscription_plan_id,
  payment_method,
  card_id,
  promo_campaign_id
}: ISubscribePayload) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: `/api/subscription/${id}`,
    data: { subscription_plan_id, payment_method, card_id, promo_campaign_id }
  })
  return data
}

export const sendTipToModel = async (payload: ITipPayload) => {
  const { data } = await axiosInstance({
    method: 'POST',
    url: '/api/user/tipp-model',
    data: payload
  })
  return data
}

export const sendFriendRequest = async (id: number, message: string) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: `/api/friendship/send/${id}`,
    data: {
      message
    }
  })
  return data
}

export type FriendsSorting = {
  sort: 'name' | 'created_at'
  order: 'desc' | 'asc' | ''
}

export const getFriendRequests = async (params?: QueryParams) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: setQueryParameters('/api/friendship/pending', params)
  })
  return data
}

export const getFriends = async (params?: QueryParams) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: setQueryParameters('/api/friendship/friends', params)
  })
  return data
}

export const deleteFriend = async (id: number) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: `/api/friendship/cancel/${id}`
  })
  return data
}

/* -------------------------
Get profile
--------------------------*/
export const putAvatarImage = (data: { avatar?: string; cropped_avatar?: string }) => {
  return axiosInstance({
    method: 'put',
    url: '/api/user/change-avatar',
    data: data
  })
}

export const putCoverImage = (data: { cover?: string; cropped_cover?: string }) => {
  return axiosInstance({
    method: 'put',
    url: '/api/user/change-cover',
    data: data
  })
}

export const putUserCountry = (country_id: number) => {
  return axiosInstance({
    method: 'put',
    url: '/api/user/country',
    data: { country_id }
  })
}

/* -------------------------
Model verification
--------------------------*/

export const postModelVerification = async (userData: any) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: `/api/user/model-verification`,
    data: userData
  })
  return data
}

export const postConfirmVerify = async (userId: number) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: `/api/admin/model-approve`,
    data: {
      model_id: userId,
      action: 'approve' //decline
    }
  })
  return data
}

/* -------------------------
Delete User
--------------------------*/

export const deleteUser = async (params: { code: string; delete_reason: string }) => {
  const { data } = await axiosInstance({
    method: 'POST',
    url: '/api/user/delete-user',
    data: params
  })

  return data
}

export const sendDeleteCode = async () => {
  const { data } = await axiosInstance({
    method: 'GET',
    url: '/api/user/send-delete-code'
  })

  return data
}
