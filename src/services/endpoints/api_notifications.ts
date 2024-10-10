import axiosInstance from '../http/axiosInstance'

// export const getNotifications = async (page: number) => {
//   const { data } = await axiosInstance({
//     method: "get",
//     url: `api/user/notification?page=${page}`,
//   });
//   return data;
// };
export const getNotifications = async (currentPage: number = 1, filter: string) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `api/user/notification?type=${filter}&page=${currentPage}`
  })
  return {
    nextCursor: currentPage < data.meta['last_page'] ? currentPage + 1 : undefined,
    prevCursor: currentPage > 1 ? currentPage - 1 : undefined,
    page: {
      data
    }
  }
}

export const getUserActivity = async (
  currentPage: number = 1,
  filter: {
    type?: string
    userId: number
  }
) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `api/user/notification?type=${filter.type ?? 'all'}&user_id=${filter.userId}&page=${currentPage}` // todo: set the correct url/path
  })
  return {
    nextCursor: currentPage < data.meta['last_page'] ? currentPage + 1 : undefined,
    prevCursor: currentPage > 1 ? currentPage - 1 : undefined,
    page: {
      data
    }
  }
}

export const apiNotificationsAsRead = async () => {
  const { data } = await axiosInstance({
    method: 'put',
    url: `/api/user/notification/unread-as-read`
  })

  return data
}

export const apiNotificationAsRead = async (notificationId: number) => {
  const { data } = await axiosInstance({
    method: 'put',
    url: `/api/user/notification/${notificationId}`
  })

  return data
}
