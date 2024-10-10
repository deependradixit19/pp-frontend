import { FC } from 'react'

// Import Swiper styles
import 'swiper/css/bundle'

import { InfiniteData, useQueryClient } from 'react-query'
import { IInfinitePage, IPost } from '../../../types/interfaces/ITypes'

import styles from './singlePostPreview.module.scss'
import placeholderAvatar from '../../../assets/images/user_placeholder.png'

import SinglePostPreviewMedia from './SinglePostPreviewMedia/SinglePostPreviewMedia'
import SinglePostPreviewLive from './SinglePostPreviewLive/SinlgePostPreviewLive'
import SinglePostPreviewStory from './SinglePostPreviewStory/SinglePostPreviewStory'
import { useTipPost } from '../../../helpers/hooks'
import { usePreviewContext } from '../../../context/previewContext'
import SinglePostPreviewGoal from './SinglePostPreviewGoal/SinglePostPreviewGoal'
import SinglePostPreviewPoll from './SinglePostPreviewPoll/SinglePostPreviewPoll'
import SinglePostPreviewText from './SinglePostPreviewText/SinglePostPreviewText'
import SinglePostPreviewPremiumMedia from './SinglePostPreviewMedia/SinglePostPreviewPremiumMedia'
import { extractMedia } from '../../../helpers/media'

interface Props {
  post: IPost
  showControls: boolean
  isFirstPost: boolean
  hasNextPage: boolean
  isInViewport: boolean
  minimizeFn: (fileIndex: number, type: string) => void
  toggleControls: () => void
}

const SinglePostPreview: FC<Props> = ({
  post,
  showControls,
  isFirstPost,
  hasNextPage,
  isInViewport,
  minimizeFn,
  toggleControls
}) => {
  const queryClient = useQueryClient()
  const { query, selectedPostData } = usePreviewContext()

  const cachedData = queryClient.getQueryData<InfiniteData<IInfinitePage>>(query)

  const onTipMutate = (tipAmount: number) => {
    if (cachedData) {
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
                  post.goal && post.id === selectedPostData.id
                    ? {
                        ...post,
                        goal: {
                          ...post.goal,
                          tipped: post.goal?.tipped + tipAmount
                        }
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

  const { setPostTip } = useTipPost({
    onMutate: val => onTipMutate(val),
    onError: onMutateError
  })

  const postFile = {
    name: post.user?.display_name,
    text: post.body,
    mentions: post.tags,
    media: extractMedia(post),
    minimizedName: post.user?.display_name,
    minimizedAvatar: post.user?.cropped_avatar?.url ?? post.user?.avatar?.url ?? placeholderAvatar
  }

  if (post.price && !post.is_purchased) {
    return (
      <SinglePostPreviewPremiumMedia
        post={post}
        showControls={showControls}
        isFirstPost={isFirstPost}
        minimizeFn={minimizeFn}
        toggleControls={toggleControls}
        hasNextPage={hasNextPage}
      />
    )
  }
  if (!postFile.media.length && postFile.text) {
    return (
      <SinglePostPreviewText
        post={post}
        showControls={showControls}
        isFirstPost={isFirstPost}
        minimizeFn={minimizeFn}
        toggleControls={toggleControls}
        hasNextPage={hasNextPage}
      />
    )
  }
  if (!postFile.media.length && post.poll) {
    return (
      <SinglePostPreviewPoll
        post={post}
        showControls={showControls}
        isFirstPost={isFirstPost}
        minimizeFn={minimizeFn}
        toggleControls={toggleControls}
        hasNextPage={hasNextPage}
      />
    )
  }
  if (!postFile.media.length && post.goal) {
    return (
      <SinglePostPreviewGoal
        post={post}
        showControls={showControls}
        isFirstPost={isFirstPost}
        minimizeFn={minimizeFn}
        toggleControls={toggleControls}
        tipFn={(amount: number) => {
          setPostTip.mutate({ post_id: post.id, amount: amount.toString()})
        }}
        disabled={setPostTip.isLoading}
        hasNextPage={hasNextPage}
      />
    )
  }
  if (!postFile.media.length && post.stories && !!post.stories.length) {
    return (
      <SinglePostPreviewStory
        post={post}
        showControls={showControls}
        isFirstPost={isFirstPost}
        minimizeFn={minimizeFn}
        toggleControls={toggleControls}
        hasNextPage={hasNextPage}
        isInViewport={isInViewport}
      />
    )
  }
  if (!postFile.media.length && post.live) {
    return (
      <SinglePostPreviewLive
        post={post}
        showControls={showControls}
        isFirstPost={isFirstPost}
        minimizeFn={minimizeFn}
        toggleControls={toggleControls}
        hasNextPage={hasNextPage}
      />
    )
  }
  return (
    <SinglePostPreviewMedia
      post={post}
      showControls={showControls}
      isFirstPost={isFirstPost}
      minimizeFn={minimizeFn}
      toggleControls={toggleControls}
      hasNextPage={hasNextPage}
    />
  )
}

export default SinglePostPreview
