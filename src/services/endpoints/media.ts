import axiosInstance from '../http/axiosInstance'

export const createPlaylist = async (name: string) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: `/api/media`,
    data: {
      playlist_name: name
    }
  })
  return data
}

export const getPlaylists = async (searchTerm?: string) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/media/playlist/all`,
    params: {
      ...(searchTerm && { searchTerm })
    }
  })

  return data
}

export const getPlaylistById = async (id: number) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/media/${id}`
  })
  return data
}

export const getPlaylistFeed = async (params: {
  searchTerm: string
  filter: string
  page: number
  playlistId: number
}) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/media/${params.playlistId}`,
    params
  })
  return {
    nextCursor: params.page < data.meta['last_page'] ? params.page + 1 : undefined,
    page: {
      data
    }
  }
}

export const addToPlaylist = async (variables: { playlistId: number; postIds: number[] }) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: `/api/media/playlist/${variables.playlistId}`,
    data: {
      post_id: variables.postIds
    }
  })
  return data
}

export const getMediaData = async (params: { model_id: string | null }) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/media-home`,
    params: params.model_id ? { searchTerm: params.model_id } : {}
  })
  return data
}
export const getMediaAutocomplete = async (params: { searchTerm: string }) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/autocomplete`,
    params
  })
  return data
}

export const getPurchasesFeed = async (queryParams: {
  searchTerm: string
  filter: string
  page: number
  per_page?: number
}) => {
  const { page } = queryParams

  const url = `/api/purchase/purchased-history`
  const { data } = await axiosInstance({
    method: 'get',
    url,
    params: queryParams
  })
  return {
    nextCursor: page < data.meta['last_page'] ? page + 1 : undefined,
    page: {
      data
    }
  }
}
export const getWatchedHistoryFeed = async (queryParams: { searchTerm: string; filter: string; page: number }) => {
  const { page } = queryParams

  // const url = `/api/history/watched-history?type=${filter}&search=${search}&per_page=10&page=${currentPage}`;
  const { data } = await axiosInstance({
    method: 'get',
    url: '/api/history/watched-history',
    params: queryParams
    // url,
  })
  return {
    nextCursor: page < data.meta['last_page'] ? page + 1 : undefined,
    page: {
      data
    }
  }
}

export const deleteWatchedHistory = async () => {
  const { data } = await axiosInstance({
    method: 'delete',
    url: '/api/history/watched'
  })

  return { data }
}
export const deleteSingleWatchedPost = async (postId: number) => {
  const { data } = await axiosInstance({
    method: 'delete',
    url: `/api/history/watched/${postId}`
  })

  return { data }
}
export const getLikedHistoryFeed = async (params: { searchTerm: string; filter: string; page: number }) => {
  // const url = `/api/like/liked-history?type=${filter}&per_page=10&page=${currentPage}`;
  const { data } = await axiosInstance({
    method: 'get',
    url: '/api/like/liked-history',
    params
  })
  return {
    nextCursor: params.page < data.meta['last_page'] ? params.page + 1 : undefined,
    page: {
      data
    }
  }
}
