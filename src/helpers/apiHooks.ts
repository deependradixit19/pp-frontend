import { useInfiniteQuery, useQuery, UseQueryResult } from 'react-query'
import { getPendingStats } from '../services/endpoints/api_global'
import { getCurrentBalance, getPayoutsTransactions, getPendingBalance } from '../services/endpoints/earnings'

import { IInfinitePages, ISalesTransaction } from '../types/interfaces/ITypes'

export const useGetUnreadData = (
  enabled: boolean
): UseQueryResult<{
  [key: string]: number
}> => {
  return useQuery('pendingStats', getPendingStats, {
    refetchOnWindowFocus: false,
    enabled
  })
}

export const usePayoutTransactionsFeed = () => {
  return useInfiniteQuery<IInfinitePages<ISalesTransaction>, Error>(
    ['getPayouts'],
    ({ pageParam = 1 }) => getPayoutsTransactions({ page: pageParam }),
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.nextCursor
      },
      refetchOnWindowFocus: false
    }
  )
}
export const useGetPendingBalance = () => {
  return useQuery('getPendingBalance', getPendingBalance)
}
export const useGetCurrentBalance = () => {
  return useQuery('getCurrentBalance', getCurrentBalance)
}
