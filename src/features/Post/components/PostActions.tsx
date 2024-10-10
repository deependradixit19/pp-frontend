import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { AllIcons } from '../../../helpers/allIcons'
// Context
import { useModalContext } from '../../../context/modalContext'
import { usePreviewContext } from '../../../context/previewContext'
// Components
import TipModal from '../../../components/UI/Modal/Tip/TipModal'
import StoryAction from '../../../pages/storyPreview/components/StoryAction/StoryAction'
import {
  IconChatOutline,
  IconHeartFill,
  IconHeartOutline,
  IconLockFill,
  IconPostStats
} from '../../../assets/svg/sprite'

const PostActions: FC<{
  like: {
    status: boolean
    count: number
  }
  likePost: () => void
  whoIsWatching: string

  isLocked?: boolean
  price: number | null
  isPurchased: boolean

  counter?: { [key: string]: number | null }
  activeFile?: string

  avatar: string
  hasTip?: boolean

  hasComments?: boolean
  comments?: number

  hasGraph?: boolean
  graph?: number

  openStats?: () => void
  openComments?: () => void
}> = ({
  like,
  likePost,
  whoIsWatching,
  isLocked,
  price,
  isPurchased,
  counter,
  activeFile,
  avatar,
  hasTip,
  hasComments,
  comments,
  hasGraph,
  graph,
  openStats,
  openComments
}) => {
  const modalData = useModalContext()
  const previewData = usePreviewContext()
  const { t } = useTranslation()

  // const toggleTipModal = () => modalData.addModal(t('tip'), <TipModal avatar={avatar} />)

  return (
    <>
      <div className='post__actions'>
        {whoIsWatching === 'model' && (
          <StoryAction icon='PostStats' text='$200' onClickAction={() => openStats && openStats()} />
        )}

        <StoryAction icon={like.status ? 'HeartFill' : 'HeartOutline'} text={like.count.toString()} />

        <StoryAction
          icon='ChatOutline'
          text={comments?.toString()}
          onClickAction={() => openComments && openComments()}
        />

        {/* {hasComments &&
        whoIsWatching !== 'model-on-model' &&
        whoIsWatching !== 'user' ? (
          <div className="post__action">
            <img src={AllIcons.preview_chat} alt="Comments" />
            <p>{comments}</p>
          </div>
        ) : (
          ''
        )} */}

        {/* {isPurchased &&
        hasGraph &&
        whoIsWatching !== 'model-on-model' &&
        whoIsWatching !== 'user' ? (
          <div className="post__action">
            <img src={AllIcons.post_graph} alt="Graph" />
            <p>${graph}</p>
          </div>
        ) : (
          ''
        )} */}

        {/* {isPurchased && hasTip ? (
          <div
            className="post__action post__action--tip"
            onClick={toggleTipModal}
          >
            <img src={AllIcons.post_tip} alt="Tip" />
          </div>
        ) : (
          ''
        )} */}
      </div>
      {price && whoIsWatching === 'model' && (
        <div className='post__price'>
          <IconLockFill />

          <p className='post__price__text'>${price}</p>
        </div>
      )}

      {/* {price &&
      !isPurchased &&
      (whoIsWatching === 'model' || whoIsWatching === 'model-on-friend') ? (
        <div className="post__locked">
          <div className="post__locked__lock">
            <img src={AllIcons.post_lock} alt="Locked" />
          </div>

          <p className="post__locked__text">${price}</p>
        </div>
      ) : (
        ''
      )} */}

      {isPurchased ? (
        <div>
          {counter?.imgs ? (
            <div className='post__counter'>
              <div className={`post__counter__item ${activeFile === 'img' ? 'post__counter__item--active' : ''}`}>
                <img src={AllIcons.post_image} alt='Post pic number' />
                {counter?.img} / {counter?.imgs}
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      ) : (
        ''
      )}
    </>
  )
}

export default PostActions
