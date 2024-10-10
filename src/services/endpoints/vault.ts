import axiosInstance from '../http/axiosInstance'

export const getVault = async (type: string, category?: string) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: '/api/user/vault',
    params: {
      type
    }
  })

  return data?.data
}

export const getAllVaultMedia = async (
  type: string,
  page: number,
  category: string | null,
  options: {
    grouped: string | boolean
    filter: string
    sort: string
    sortAsc: string
    mapExistingPostId?: boolean
    filterExisting?: number[]
  },
  to_user: number | null
) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: '/api/user/vault',
    params: {
      type,
      category,
      to_user
    }
  })
  let ungroupedArray: any = []
  let groupedArray: any = []
  let chunkArray: any = []
  let existingIds: number[] = []
  const sliceIntoChunks = (arr: [], chunkSize: number) => {
    const res: any[] = []
    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize)
      res.push(chunk)

      if (chunk.length === 0) return
    }
    return res
  }

  if (data?.data) {
    groupedArray = data.data
    if (!options.grouped) {
      for (let i = 0; i < data?.data.length; i++) {
        if (data?.data[i].post) {
          if (data?.data[i].post.photos?.length > 0) {
            for (let j = 0; j < data?.data[i].post.photos.length; j++) {
              ungroupedArray.push({
                post_id: data.data[i].id,
                id: `${data.data[i].id}-${i}-${Math.random()}`,
                created_at: data.data[i].created_at,
                story: null,
                message: null,
                post: {
                  ...data.data[i].post,
                  photos: [data.data[i].post.photos[j]],
                  photos_preview: [data.data[i].post.photos_preview[j]],
                  videos: [],
                  videos_preview: []
                }
              })
            }
          }
          if (data?.data[i].post.videos?.length > 0) {
            for (let j = 0; j < data?.data[i].post.videos.length; j++) {
              ungroupedArray.push({
                post_id: data.data[i].id,
                id: `${data.data[i].id}-${i}-${Math.random()}`,
                created_at: data.data[i].created_at,
                story: null,
                message: null,
                post: {
                  ...data.data[i].post,
                  videos: [data.data[i].post.videos[j]],
                  videos_preview: [data.data[i].post.videos_preview[j]],
                  photos: [],
                  photos_preview: []
                }
              })
            }
          }
        }
        if (data?.data[i].story) {
          ungroupedArray.push({
            post_id: data.data[i].id,
            id: `${data.data[i].id}-${i}-${Math.random()}`,
            created_at: data.data[i].created_at,
            story: data?.data[i].story,
            message: null,
            post: null
          })
        }
        if (data?.data[i]?.message?.message) {
          // photos_preview and video_preview missing for messages
          if (data?.data[i].message.message.photos && data?.data[i].message.message.photos?.length > 0) {
            for (let j = 0; j < data?.data[i].message.message.photos.length; j++) {
              ungroupedArray.push({
                post_id: data.data[i].id,
                id: `${data.data[i].id}-${i}-${Math.random()}`,
                created_at: data.data[i].created_at,
                story: null,
                message: {
                  ...data.data[i].message,
                  message: {
                    ...data.data[i].message.message,
                    photos: [data.data[i].message?.message?.photos[j]],
                    videos: [],
                    videos_preview: []
                  }
                },
                post: null
              })
            }
          }
          if (data?.data[i].message.message.videos?.length > 0) {
            for (let j = 0; j < data?.data[i].message.message.videos.length; j++) {
              ungroupedArray.push({
                post_id: data.data[i].id,
                id: `${data.data[i].id}-${i}-${Math.random()}`,
                created_at: data.data[i].created_at,
                story: null,
                message: {
                  ...data.data[i].message,
                  message: {
                    ...data.data[i].message.message,
                    videos: [data.data[i].message.message.videos[j]],
                    photos: [],
                    photos_preview: []
                  }
                },
                post: null
              })
            }
          }
        }
      }
    }

    const filterArray = (array: [], filter: string) => {
      if (filter === 'photos') {
        return array.filter(
          (item: any) =>
            item.post?.photos.length > 0 || item.message?.message?.photos.length > 0 || !!item.story?.image_src
        )
      }
      if (filter === 'videos') {
        return array.filter(
          (item: any) =>
            item.post?.videos.length > 0 || item.message?.message?.videos.length > 0 || !!item.story?.video_src
        )
      }
      return array
    }

    const sortArray = (array: [], sort: string, asc: string) => {
      if (sort === 'most_recent') {
        return array.sort((a: any, b: any) =>
          asc === 'asc'
            ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      }
      if (sort === 'most_purchased') {
        return array.sort((a: any, b: any) => {
          let newA = a
          let newB = b

          if (a.post) newA = a.post.purchases_count
          if (b.post) newB = b.post.purchases_count
          if (a.message) newA = a.message.purchases_count
          if (b.message) newB = b.message.purchases_count

          return asc === 'asc' ? newA - newB : newB - newA
        })
      }
      if (sort === 'most_viewed') {
        return array.sort((a: any, b: any) =>
          asc === 'asc' ? a.post.unique_views - b.post.unique_views : b.post.unique_views - a.post.unique_views
        )
      }
      if (sort === 'most_liked') {
        return array.sort((a: any, b: any) =>
          asc === 'asc' ? a.post.like_count - b.post.like_count : b.post.like_count - a.post.like_count
        )
      }
      if (sort === 'highest_tips') {
        return array.sort((a: any, b: any) =>
          asc === 'asc' ? a.post.tips_sum - b.post.tips_sum : b.post.tips_sum - a.post.tips_sum
        )
      }
      if (sort === 'most_comment') {
        return array.sort((a: any, b: any) =>
          asc === 'asc' ? a.post.comment_count - b.post.comment_count : b.post.comment_count - a.post.comment_count
        )
      }

      return array
    }

    if (options.mapExistingPostId) {
      existingIds = data?.data.map((item: any) => item.id)
    }

    if (!options.grouped) {
      if (options.filterExisting) {
        ungroupedArray = ungroupedArray.filter((item: any) => !options.filterExisting?.includes(item.id))
      }
      ungroupedArray = filterArray(ungroupedArray, options.filter)
      ungroupedArray = sortArray(ungroupedArray, options.sort, options.sortAsc)
      chunkArray = sliceIntoChunks(ungroupedArray, 20)
    } else {
      if (options.filterExisting) {
        groupedArray = groupedArray.filter((item: any) => !options.filterExisting?.includes(item.id))
      }
      groupedArray = filterArray(groupedArray, options.filter)
      groupedArray = sortArray(groupedArray, options.sort, options.sortAsc)
      chunkArray = sliceIntoChunks(groupedArray, 20)
    }
  }

  return {
    data: chunkArray ? chunkArray[page] : [],
    nextPage: page + 1 < chunkArray.length ? page + 1 : null,
    existingIds: existingIds
  }
}

export const addMediaToCategory = async (categoryId: number, vaults: number[]) => {
  const { data } = await axiosInstance({
    method: 'POST',
    url: `/api/post/add-vault-to-media-category`,
    data: {
      category_id: categoryId,
      vaults
    }
  })
  return data
}

export const deleteFromVault = async (ids: []) => {
  const { data } = await axiosInstance({
    method: 'DELETE',
    url: '/api/user/vault',
    data: {
      ids
    }
  })

  return data
}
