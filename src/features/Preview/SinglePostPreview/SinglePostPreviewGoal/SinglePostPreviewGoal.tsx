import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import ShowMore from '../../../../components/Common/ShowMore/ShowMore'
import { someTimeAgo } from '../../../../lib/dayjs'
import { IPost } from '../../../../types/interfaces/ITypes'
import PreviewActions from '../../PreviewActions/PreviewActions'
import styles from './singlePostPreview.module.scss'
import placeholderAvatar from '../../../../assets/images/user_placeholder.png'
import { useUserContext } from '../../../../context/userContext'
import { usePreviewContext } from '../../../../context/previewContext'
import { useOrientation } from '../../../../helpers/helperHooks'
import { IconSwipeUp } from '../../../../assets/svg/sprite'
import PostGoal from '../../../Post/components/PostGoal'
import { extractMedia } from '../../../../helpers/media'

interface Props {
  post: IPost
  showControls: boolean
  isFirstPost: boolean
  disabled: boolean
  hasNextPage: boolean
  minimizeFn: (fileIndex: number, type: string) => void
  toggleControls: () => void
  tipFn: (amount: number) => void
}

const SinglePostPreviewGoal: FC<Props> = ({
  post,
  showControls,
  isFirstPost,
  disabled,
  hasNextPage,
  toggleControls,
  tipFn
}) => {
  const userData = useUserContext()
  const deviceOrientation = useOrientation()
  const { t } = useTranslation()
  const { userId, query, setCommentsActive } = usePreviewContext()

  const postFile = {
    userId: post.user_id,
    name: post.user?.display_name,
    text: post.body,
    mentions: post.tags,
    media: extractMedia(post),
    minimizedName: post.user?.display_name,
    minimizedAvatar: post.user?.cropped_avatar?.url ?? post.user?.avatar?.url ?? placeholderAvatar
  }

  if (!post.goal || !deviceOrientation) return null
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
          const el = e.target as HTMLElement
          if (el.classList.contains('goalBox__options') || el.classList.contains('goalBox__option')) {
            return
          }
          toggleControls()
        }}
        className='preview__file preview__file--no-media'
      >
        <div
          className='preview__background'
          style={{
            backgroundImage: post.goal.background_color
              ? post.goal.background_color
              : `url(${post.goal.background_src})`
          }}
        ></div>
        <div className='preview__poll'>
          <PostGoal
            goalData={post.goal}
            setTip={val => tipFn(val)}
            isMyPost={post.user_id === userData.id}
            disabled={disabled}
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

export default SinglePostPreviewGoal
