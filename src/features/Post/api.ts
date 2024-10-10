import axiosInstance from '../../services/http/axiosInstance'

export const likePost = async (id: any) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: `/api/like/post/${id}`
  })
  return data
}
