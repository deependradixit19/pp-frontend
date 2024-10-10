import { FC } from 'react'

import { useTranslation } from 'react-i18next'
import ShowMore from '../../../../components/Common/ShowMore/ShowMore'
import { formatedDate, someTimeAgo } from '../../../../lib/dayjs'
import { IPost } from '../../../../types/interfaces/ITypes'
import { MinimizeIcon } from '../../Preview'
import PreviewActions from '../../PreviewActions/PreviewActions'
import styles from './singlePostPreview.module.scss'
import placeholderAvatar from '../../../../assets/images/user_placeholder.png'
import { usePreviewContext } from '../../../../context/previewContext'
import PostInfoTop from '../../../Post/components/PostInfoTop/PostInfoTop'
import { useOrientation } from '../../../../helpers/helperHooks'
import { renderPostText } from '../../../../helpers/postHelpers'
import ImagePreview from '../../ImagePreview'
import { IconSwipeUp, IconUpcomingLive } from '../../../../assets/svg/sprite'
import { extractMedia } from '../../../../helpers/media'

interface Props {
  post: IPost
  showControls: boolean
  isFirstPost: boolean
  hasNextPage: boolean
  minimizeFn: (fileIndex: number, type: string) => void
  toggleControls: () => void
}

const SinglePostPreviewLive: FC<Props> = ({
  post,
  showControls,
  isFirstPost,
  hasNextPage,
  minimizeFn,
  toggleControls
}) => {
  const deviceOrientation = useOrientation()
  const { t } = useTranslation()
  const { userId, query, minimized, setCommentsActive } = usePreviewContext()

  const postFile = {
    userId: post.user_id,
    name: post.user?.display_name,
    text: post.body,
    mentions: post.tags,
    media: extractMedia(post),
    minimizedName: post.user?.display_name,
    minimizedAvatar: post.user?.cropped_avatar?.url ?? post.user?.avatar?.url ?? placeholderAvatar
  }

  if (!post.live || !deviceOrientation) return null
  return (
    <div className='preview__file--wrapper'>
      <MinimizeIcon {...{ minimized, post, showControls }} onClick={() => minimizeFn(0, 'video')} />
      {showControls && !minimized && (
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
          />
        </>
      )}
      <div className={`preview__file ${post.live.img_orientation.toLowerCase()}`}>
        <PostInfoTop pinned={false} live={!!post.live.active} liveEnded={!!post.live.finished} customClass='preview' />
        {minimized ? ( //
          <div className='preview__minimized'>
            <img
              className='preview__file__image preview__file__image--minimized'
              src={post.live.img_url}
              alt={t('preview')}
            />
            <div className='preview__minimized__content'>
              <div className='preview__minimized__content--top'>
                <div className='header__avatar'>
                  <img src={postFile.minimizedAvatar} alt={t('placeholder')} />
                </div>
                <div className='header__name'>{postFile.minimizedName}</div>
              </div>
              <div className='preview__minimized__content--bottom'>
                <div className='content__text'>{renderPostText(postFile.text || '', postFile.mentions)}</div>
              </div>
            </div>
          </div>
        ) : (
          <div onClick={toggleControls}>
            <img className='preview__background' src={post.live.img_url} alt={t('background')} />
            <ImagePreview src={post.live.img_url} />
            {post.live.schedule_date && (
              <div className='post__files__file__upcoming'>
                <IconUpcomingLive />
                <p>{t('upcomingLiveStream')}</p>
                <div className='post__files__file__upcoming__date'>
                  {formatedDate(post.live.schedule_date, 'MMM D, h:mm A')}
                </div>
              </div>
            )}
            {isFirstPost && (
              <div className='preview__swipe--icon'>
                <IconSwipeUp
                  opacity={
                    deviceOrientation.type.includes('portrait')
                      ? post.live.img_orientation.toLowerCase() === 'landscape'
                        ? 0.5
                        : 1
                      : 1
                  }
                />
                <p
                  style={{
                    opacity: deviceOrientation.type.includes('portrait')
                      ? post.live.img_orientation.toLowerCase() === 'landscape'
                        ? 0.5
                        : 1
                      : 1
                  }}
                >
                  {t('swipeUpForNextPost')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SinglePostPreviewLive
