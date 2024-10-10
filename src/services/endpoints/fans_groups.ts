import axiosInstance from '../http/axiosInstance'

export const getFansGroups = async () => {
  const { data } = await axiosInstance({
    method: 'GET',
    url: '/api/user/groups'
  })
  return data
}

export const createFansGroup = async (name: string) => {
  const { data } = await axiosInstance({
    method: 'POST',
    url: '/api/user/create_group',
    data: {
      name,
      participants: []
    }
  })
  return data
}

export const editFansGroup = async (id: number, updatedData: { participants?: number[] | null; name: string }) => {
  const { data } = await axiosInstance({
    method: 'PUT',
    url: `/api/user/update_group/${id}`,
    data: updatedData
  })
  return data
}

export const deleteFansGroup = async (id: number) => {
  const { data } = await axiosInstance({
    method: 'DELETE',
    url: `/api/user/group/${id}`
  })
  return data
}

export const getUsersFromFansGroup = async (id: number, params: {}) => {
  const { data } = await axiosInstance({
    method: 'GET',
    url: `/api/user/group/${id}`,
    params
  })
  return data
}

export const getUserFans = async (params: {}) => {
  const { data } = await axiosInstance({
    method: 'GET',
    url: '/api/user/get-fans',
    params
  })
  return data
}

export const addFanToGroups = async (userId: number, groupIds: string[] | number[]) => {
  const { data } = await axiosInstance({
    method: 'POST',
    url: `/api/subscription/list/${userId}/add-groups`,
    data: { groups: groupIds }
  })

  return data
}

export const getGroupsFromFan = async (id: number) => {
  const { data } = await axiosInstance({
    method: 'GET',
    url: `/api/user/subscriber/groups/${id}`
  })

  return data
}
