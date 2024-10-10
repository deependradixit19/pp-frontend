import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { InfiniteData, useQueryClient } from 'react-query'
import {
  IGoalResponse,
  IInfinitePage,
  IPost,
  ISubscriptionHistoryItem
} from '../../../../../../types/interfaces/ITypes'

import styles from './mediaItemPoll.module.scss'
import { useTipPost } from '../../../../../../helpers/hooks'
import PostGoal from '../../../../../../features/Post/components/PostGoal'

interface Props {
  goal: IGoalResponse
  postId: number
}

const MediaItemGoal: FC<Props> = ({ goal, postId }) => {
  const { background_color, background_src } = goal

  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { setPostTip } = useTipPost({ onMutate: val => onTipMutate(val) })

  const cachedData = queryClient.getQueryData<{
    like: IPost[]
    purchase: IPost[]
    subscriptions: ISubscriptionHistoryItem[]
    watched: IPost[]
  }>(['getMediaData'])

  const onTipMutate = (tipAmount: number) => {
    if (cachedData) {
      console.log({ cachedData })
      // const newData = {
      //   ...cachedData,
      //   pages: cachedData.pages.map((singleFeedPage) => {
      //     return {
      //       ...singleFeedPage,
      //       page: {
      //         ...singleFeedPage.page,
      //         data: {
      //           ...singleFeedPage.page.data,
      //           data: singleFeedPage.page.data.data.map((post) =>
      //             post.goal && post.id === postId
      //               ? {
      //                   ...post,
      //                   goal: {
      //                     ...post.goal,
      //                     tipped: post.goal?.tipped + tipAmount,
      //                   },
      //                 }
      //               : post
      //           ),
      //         },
      //       },
      //     };
      //   }),
      // };
      // queryClient.setQueryData(['getMediaData'], newData);
    }
  }
  const onMutateError = () => {
    queryClient.setQueryData(['getMediaData'], cachedData)
  }
  return (
    <div
      style={{
        backgroundImage: background_color ?? `url(${background_src})`
      }}
      className={styles.wrapper}
    >
      <PostGoal
        goalData={goal}
        setTip={val =>
          setPostTip.mutate(
            { post_id: postId, amount: val.toString() },
            {
              onError: () => onMutateError()
            }
          )
        }
        isMyPost={false}
        disabled={setPostTip.isLoading}
      />
    </div>
  )
}

export default MediaItemGoal
