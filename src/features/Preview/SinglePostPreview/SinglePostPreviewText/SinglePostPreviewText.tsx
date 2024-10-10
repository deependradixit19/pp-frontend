import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import ShowMore from '../../../../components/Common/ShowMore/ShowMore'
import { someTimeAgo } from '../../../../lib/dayjs'
import { IPost } from '../../../../types/interfaces/ITypes'
import { MinimizeIcon } from '../../Preview'
import PreviewActions from '../../PreviewActions/PreviewActions'
import styles from './singlePostPreview.module.scss'
import placeholderAvatar from '../../../../assets/images/user_placeholder.png'
import { IFile } from '../../../../types/interfaces/IFile'
import { usePreviewContext } from '../../../../context/previewContext'
import { useOrientation } from '../../../../helpers/helperHooks'
import { renderPostText } from '../../../../helpers/postHelpers'
import { IconSwipeUp } from '../../../../assets/svg/sprite'

interface Props {
  post: IPost
  showControls: boolean
  isFirstPost: boolean
  hasNextPage: boolean
  minimizeFn: (fileIndex: number, type: string) => void
  toggleControls: () => void
}

const SinglePostPreviewText: FC<Props> = ({
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

  const extractMedia = (post: IPost) => {
    let tmpArr: Array<IFile> = []

    if (post.photos) {
      tmpArr = [...post.photos]
    }
    if (post.videos) {
      tmpArr = [...tmpArr, ...post.videos]
    }
    if (post.sounds) {
      tmpArr = [...tmpArr, ...post.sounds]
    }

    return tmpArr
  }
  const postFile = {
    userId: post.user_id,
    name: post.user?.display_name,
    text: post.body,
    mentions: post.tags,
    media: extractMedia(post),
    minimizedName: post.user?.display_name,
    minimizedAvatar: post.user?.cropped_avatar?.url ?? post.user?.avatar?.url ?? placeholderAvatar
  }

  if (!postFile.text || !deviceOrientation) return null
  return (
    <div className='preview__file--wrapper preview__file--textOnly'>
      <MinimizeIcon {...{ minimized, post, showControls }} onClick={() => minimizeFn(0, 'text')} />
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
        {minimized ? (
          <div className='preview__minimized'>
            <div className='preview__file__thumb'>
              {/* <div className="preview__background"></div> */}
              <div className='preview__text'>
                {renderPostText(postFile.text, postFile.mentions)}
                {/* {postFile.text} */}
              </div>
            </div>
            <div className='preview__minimized__content'>
              <div className='preview__minimized__content--top'>
                <div className='header__avatar'>
                  <img src={postFile.minimizedAvatar} alt={t('placeholder')} />
                </div>
                <div className='header__name'>{postFile.minimizedName}</div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className='preview__background'></div>
            <div className='preview__text'>
              {renderPostText(postFile.text, postFile.mentions)}
              {/* {postFile.text} */}
            </div>
            {isFirstPost && (
              <div className='preview__swipe--icon'>
                <IconSwipeUp />
                <p>{t('swipeUpForNextPost')}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default SinglePostPreviewText
