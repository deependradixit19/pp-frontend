import axiosInstance from '../http/axiosInstance'

/* -------------------------
Get Feed
--------------------------*/
//filter = all/photo/video
export const getUsersFeed = async (id: string, filter: string, currentPage: number = 1) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/user/${id}/feed?type=all&media_category=1&page=${currentPage}`
  })
  return data
}

export const getUsersFeedInfinite = async (
  id: number | undefined,
  params: any
  // currentPage: number
) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/user/${id}/feed?type=all&media_category=1&page=1`,
    
  })

  return {
    nextCursor: params.page < data.meta['last_page'] ? params.page + 1 : undefined,
    prevCursor: params.page > 1 ? params.page - 1 : undefined,
    page: {
      data
    }
  }
}

export const getHomeFeed = async (params: any, page: number) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/user/home`,
    params: { ...params, page }
  })
  return {
    nextCursor: page < data.meta['last_page'] ? page + 1 : undefined,
    page: {
      data
    }
  }
}

export const likePost = async (id: any) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: `/api/like/post/${id}`
  })
  return data
}
