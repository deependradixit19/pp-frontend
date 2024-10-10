import axiosInstance from '../http/axiosInstance'

export const getPayoutsTransactions = async (params: { page: number }) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/user/payout/transactions`,
    params
  })

  return {
    nextCursor: params.page < data?.data?.['last_page'] ? params.page + 1 : undefined,
    prevCursor: params.page > 1 ? params.page - 1 : undefined,
    page: {
      data: data?.data
    }
  }
}
export const getPendingBalance = async () => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/user/payout/balance`
  })

  return data
}
export const getCurrentBalance = async () => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/transactions/balance`
  })

  return data
}
// export const getEarningsGraphData = async (byPeriod: string) => {
//   const { data } = await axiosInstance({
//     method: 'get',
//     url: '/api/user/analytic/sales',
//     params: {
//       period: byPeriod,
//     },
//   });

//   return data;
// };
export const getEarningsGraphData = async ({ dateFrom, dateTo }: { dateFrom: string; dateTo: string }) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: '/api/user/analytic/creator-earnings',
    params: {
      date_from: dateFrom,
      date_to: dateTo,
      chart: true
    }
  })

  return data
}
export const getPayoutsInvoices = async (params: { page: number; search?: string }) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/user/payout/lists`,
    params: {
      page: params.page,
      ...(params.search && { search: params.search })
    }
  })

  return {
    nextCursor: params.page < data?.data?.['last_page'] ? params.page + 1 : undefined,
    prevCursor: params.page > 1 ? params.page - 1 : undefined,
    page: {
      data: data?.data
    }
  }
}
