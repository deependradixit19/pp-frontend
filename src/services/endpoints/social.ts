import axiosInstance from '../http/axiosInstance'

export const getProfileGroups = async () => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/user/extended-group`
  })
  return data
}
