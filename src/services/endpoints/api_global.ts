import axiosInstance from '../http/axiosInstance'

export const getPendingStats = async () => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `api/user/pending-requests`
  })
  return data
}

export const getSearchedCreators = async (term: string) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `api/user/search`,
    params: {
      role: 'model',
      q: term
    }
  })

  return data
}

export const getBannedWords = async () => {
  const { data } = await axiosInstance({
    method: 'GET',
    url: '/api/banned-words'
  })

  return data
}

export const putBannedWord = async (params: {
  id: number | string
  type: 'post' | 'comment' | 'stories' | 'message'
}) => {
  const { data } = await axiosInstance({
    method: 'PUT',
    url: `/api/banned-word/${params.id}`,
    data: {
      type: params.type
    }
  })

  return data
}

export const getMinPrices = async () => {
  const { data } = await axiosInstance({
    method: 'GET',
    url: '/api/min-max-price'
  })

  return data
}
