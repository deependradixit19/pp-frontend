import axiosInstance from '../http/axiosInstance'

export const getMediaCategories = async () => {
  const { data } = await axiosInstance({
    method: 'GET',
    url: '/api/user/media-categories'
  })
  return data
}

export const getMediaCategoriesForSinglePost = async (id: number) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/user/media-categories?post_id=${id}`
  })

  return data
}

export const createMediaCategories = async (name: string) => {
  const { data } = await axiosInstance({
    method: 'POST',
    url: '/api/user/media-categories',
    data: { name }
  })
  return data
}

export const editMediaCategories = async (name: string, id: any) => {
  const { data } = await axiosInstance({
    method: 'PUT',
    url: `/api/user/media-categories/${id}`,
    data: { name }
  })
  return data
}

export const deleteMediaCategory = async (id: any) => {
  const { data } = await axiosInstance({
    method: 'DELETE',
    url: `/api/user/media-categories/${id}`
  })
  return data
}
