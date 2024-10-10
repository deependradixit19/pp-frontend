import axiosInstance from '../http/axiosInstance'

export const getCreators = async (params: { type: string; search: string | null; page: number }) => {
  const { data } = await axiosInstance({
    method: 'GET',
    url: '/api/user/browse-creators',
    params
  })

  return data
}

export const getFreeCreators = async (params: { type: string; search: string | null; page: number }) => {
  const { data } = await axiosInstance({
    method: 'GET',
    url: '/api/user/free-creators',
    params
  })

  return data
}

export const getCreatorsRecentSearch = async () => {
  const { data } = await axiosInstance({
    method: 'GET',
    url: '/api/user/recent-search'
  })

  return data
}

export const deleteCreatorsRecentSearch = async (payload: { search_id: number[] }) => {
  const { data } = await axiosInstance({
    method: 'DELETE',
    url: '/api/user/recent-search',
    data: payload
  })

  return data
}
