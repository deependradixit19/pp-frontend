import axiosInstance from '../http/axiosInstance'

export const getModelFriends = async (
  modelId: number,
  params: {
    search: string
    page: number
    perPage?: number
    sort: 'asc' | 'desc'
  }
) => {
  const { data } = await axiosInstance({
    method: 'GET',
    url: `api/friendship/model/friends/${modelId}`,
    params
  })

  return data
}

export const handleFriendRequest = async (friendId: number, accept: boolean) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: `/api/friendship/${accept ? 'accept' : 'deny'}/${friendId}`
  })
  return data
}
