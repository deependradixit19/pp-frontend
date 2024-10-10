import axiosInstance from '../http/axiosInstance'

export const getReportTypes = async (type: string) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/report/types?type=${type}`
  })
  return data
}

export const reportPost = async (postId: number, message: string, reportType: number) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: `/api/report/post/${postId}`,
    data: {
      message: message,
      report_type_id: reportType
    }
  })
  return data
}

export const restrictUser = async (userId: number) => {
  const { data } = await axiosInstance({
    method: 'POST',
    url: 'api/user/restrict',
    data: {
      user_id: userId
    }
  })

  return data
}

export const blockUser = async (userId: number) => {
  const { data } = await axiosInstance({
    method: 'POST',
    url: '/api/user/block',
    data: {
      user_id: userId
    }
  })

  return data
}

export const reportUser = async (
  userId: number,
  reportData: {
    text: string
    report_type_id: number
  }
) => {
  const { data } = await axiosInstance({
    method: 'POST',
    url: `/api/report/user/${userId}`,
    data: reportData
  })

  return data
}

export const reportMessage = async (messageId: number, reportData: { report_type_id: number; text: string }) => {
  const { data } = await axiosInstance({
    method: 'POST',
    url: `api/report/message/${messageId}`,
    data: reportData
  })

  return data
}
