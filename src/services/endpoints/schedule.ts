import axiosInstance from '../http/axiosInstance'

export const getScheduledContent = async () => {
  const { data } = await axiosInstance({
    method: 'get',
    url: '/api/user/schedules'
  })
  return data
}

export const postContentNow = async (id: number) => {
  const { data } = await axiosInstance({
    method: 'put',
    url: `/api/user/schedules/post-now/${id}`
  })
  return data
}

export const deleteScheduledPostFn = async (id: number) => {
  const { data } = await axiosInstance({
    method: 'DELETE',
    url: `api/user/schedules/delete/${id}`
  })
  return data
}
