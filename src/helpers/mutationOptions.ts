import { produce } from 'immer'
import { InfiniteData, QueryClient } from 'react-query'
import { IInfinitePage } from '../types/interfaces/ITypes'

export const pagedPostEngageMutationOptions = (queryClient: QueryClient, dataQuery: any[]) => {
  // console.log({dataQuery});
  return {
    onMutate: (postId: number) => {
      // await queryClient.cancelQueries(dataQuery);
      const previousData = queryClient.getQueryData<InfiniteData<IInfinitePage>>(dataQuery)
      queryClient.setQueryData<InfiniteData<IInfinitePage> | undefined>(dataQuery, old =>
        produce(old, draft => {
          draft?.pages.some(pageData => {
            return pageData.page.data.data.some(post => {
              if (post.id === postId) {
                post.is_engage = true
                return true
              }
              return false
            })
          })
        })
      )

      return { previousData, dataQuery }
    },
    onError: (err: any, variables: any, context: any) => {
      if (context?.dataQuery && context?.previousData) {
        queryClient.setQueryData<InfiniteData<IInfinitePage>>(context.dataQuery, context.previousData)
      }
    }
  }
}
