import { FC } from 'react'

import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import ShowMore from '../../../../components/Common/ShowMore/ShowMore'
import { someTimeAgo } from '../../../../lib/dayjs'
import { IPost } from '../../../../types/interfaces/ITypes'
import PreviewActions from '../../PreviewActions/PreviewActions'
import styles from './singlePostPreview.module.scss'
import placeholderAvatar from '../../../../assets/images/user_placeholder.png'
import { usePreviewContext } from '../../../../context/previewContext'
import { useOrientation } from '../../../../helpers/helperHooks'
import { IconSwipeUp } from '../../../../assets/svg/sprite'
import PostPoll from '../../../Post/components/PostPoll'
import { useAnswerPoll } from '../../../../helpers/hooks'
import { extractMedia } from '../../../../helpers/media'

interface Props {
  post: IPost
  showControls: boolean
  isFirstPost: boolean
  hasNextPage: boolean
  minimizeFn: (fileIndex: number, type: string) => void
  toggleControls: () => void
}

const SinglePostPreviewPoll: FC<Props> = ({ post, showControls, isFirstPost, hasNextPage, toggleControls }) => {
  const queryClient = useQueryClient()
  const deviceOrientation = useOrientation()
  const { t } = useTranslation()
  const { userId, query, setCommentsActive } = usePreviewContext()

  const { setPollAnswer } = useAnswerPoll({})

  const postFile = {
    userId: post.user_id,
    name: post.user?.display_name,
    text: post.body,
    mentions: post.tags,
    media: extractMedia(post),
    minimizedName: post.user?.display_name,
    minimizedAvatar: post.user?.cropped_avatar?.url ?? post.user?.avatar?.url ?? placeholderAvatar
  }

  if (!post.poll || !deviceOrientation) return null
  return (
    <div className='preview__file--wrapper'>
      {showControls && (
        <>
          <ShowMore
            userId={postFile.userId}
            name={postFile.name}
            time={someTimeAgo(post.created_at)}
            tags={['#bowieblue', '#bluechowchow']}
            text={postFile.text ? postFile.text : ''}
            mentions={postFile.mentions}
          />
          <PreviewActions
            // userId={userId}
            // filter={filter}
            stats={{
              overallRevenue: post.overall_revenue,
              purchasesCount: post.purchases_count,
              purchasesSum: post.purchases_sum,
              tipsCount: post.tips_count,
              tipsSum: post.tips_sum,
              conversionRate: post.conversion_rate,
              uniqueImpressions: post.unique_impressions,
              views: post.views,
              uniqueViews: post.unique_views
            }}
            query={query}
            postId={post.id}
            isMyPost={userId === post.user?.id}
            isLiked={post.isLiked}
            likes={post.likes_count}
            comments={post.comment_count}
            setCommentsActive={setCommentsActive}
            // setActivePost={() => setSelectedPostData(post)}
          />
        </>
      )}
      <div
        onClick={e => {
          e.stopPropagation()
          toggleControls()
        }}
        className='preview__file preview__file--no-media'
      >
        <div
          className='preview__background'
          style={{
            backgroundImage: post.poll.background_color
              ? post.poll.background_color
              : `url(${post.poll.background_src})`
          }}
        ></div>
        <div className='preview__poll'>
          <PostPoll
            pollData={post.poll}
            setAnswer={ans =>
              setPollAnswer.mutate(ans, {
                onSettled: () => queryClient.invalidateQueries(query)
              })
            }
            isMyPost={userId === post.user_id}
          />
        </div>
        {isFirstPost && (
          <div className='preview__swipe--icon'>
            <IconSwipeUp />
            <p>{t('swipeUpForNextPost')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SinglePostPreviewPoll
