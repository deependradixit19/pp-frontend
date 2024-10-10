import axiosInstance from '../http/axiosInstance'

export const getSubscriptionLists = async () => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/subscription/lists`
  })
  return data
}

export const createSubscripitonList = async (name: string) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: `/api/subscription/list/create`,
    data: { name }
  })
  return data
}

export const updateSubscriptionList = async (id: number, name: string) => {
  const { data } = await axiosInstance({
    method: 'put',
    url: `/api/subscription/list/${id}`,
    data: { name }
  })
  return data
}

export const addUsersToSubscriptionList = async (id: number, users: number[]) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: `/api/subscription/list/${id}/add-users`,
    data: { users }
  })
  return data
}

export const deleteSubscriptionList = async (id: number) => {
  const { data } = await axiosInstance({
    method: 'delete',
    url: `/api/subscription/list/${id}`
  })
  return data
}

export const selectSubscriptionLists = async (selected: number[]) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: `/api/subscription/list/select`,
    data: { selected }
  })
  return data
}
