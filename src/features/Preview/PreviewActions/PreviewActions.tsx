import { FC } from 'react'
import { useQueryClient } from 'react-query'

import {
  IconHeartOutline,
  IconChatOutline,
  IconHeartFill,
  IconPostStats,
  IconLiveCircleTip
} from '../../../assets/svg/sprite'
import './_previewActions.scss'
import placeholderAvatar from '../../../assets/images/user_placeholder.png'
import { useLikePost } from '../../../helpers/hooks'
import { IPost, IStatsData } from '../../../types/interfaces/ITypes'
import { useModalContext } from '../../../context/modalContext'
import StatsPopup from '../../../components/UI/StatsPopup/StatsPopup'

interface Props {
  // userId: number;
  // filter: string;
  query: any[]
  postId: number
  isMyPost: boolean
  isLiked: boolean
  likes: number
  comments: number
  stats: IStatsData
  setCommentsActive: (value: boolean) => void
  // setActivePost: () => void;
}

interface InfiniteData<TData> {
  pages: TData[]
  pageParams: unknown[]
}

interface IInfinitePage {
  nextCursor: number | undefined
  page: {
    data: { data: IPost[] }
  }
}

const PreviewActions: FC<Props> = ({ query, postId, isMyPost, isLiked, likes, comments, stats, setCommentsActive }) => {
  const queryClient = useQueryClient()
  const modalData = useModalContext()

  // console.log({ isMyPost });

  const cachedData = queryClient.getQueryData<InfiniteData<IInfinitePage>>(query)
  const onLikeMutate = () => {
    if (cachedData) {
      const newLikeState = isLiked ? 'unlike' : 'like'
      const newData = {
        ...cachedData,
        pages: cachedData.pages.map(singleFeedPage => {
          return {
            ...singleFeedPage,
            page: {
              ...singleFeedPage.page,
              data: {
                ...singleFeedPage.page.data,
                data: singleFeedPage.page.data.data.map(post =>
                  post.id === postId
                    ? {
                        ...post,
                        isLiked: !post.isLiked,
                        likes_count: newLikeState === 'like' ? post.likes_count + 1 : post.likes_count - 1
                      }
                    : post
                )
              }
            }
          }
        })
      }

      queryClient.setQueryData(query, newData)
    }
  }
  const onMutateError = () => {
    queryClient.setQueryData(query, cachedData)
  }
  const { likePost } = useLikePost(postId, onLikeMutate, onMutateError)

  return (
    <div className='previewActions'>
      <div className='previewActions__avatar'>
        <div className='previewActions__avatar--ring'>
          <img src={placeholderAvatar} alt='placeholder' />
        </div>
      </div>
      {isMyPost && (
        <div
          className='previewAction'
          onClick={() =>
            modalData.addModal(
              '',
              <StatsPopup statsData={stats} closeStats={() => modalData.clearModal()} />,
              true,
              true,
              'previewStats'
            )
          }
        >
          <IconPostStats />

          <span>{200}</span>
        </div>
      )}

      <div className='previewAction' onClick={() => likePost.mutate()}>
        {isLiked ? <IconHeartFill /> : <IconHeartOutline color='#fff' />}

        <span>{likes}</span>
      </div>
      <div
        className='previewAction'
        onClick={() => {
          setCommentsActive(true)
          // setActivePost();
        }}
      >
        <IconChatOutline />
        <span>{comments}</span>
      </div>
      {!isMyPost && (
        <div
          className='previewAction'
          onClick={() => {
            console.log('open tip modal')
          }}
        >
          <IconLiveCircleTip />
        </div>
      )}
    </div>
  )
}

export default PreviewActions
