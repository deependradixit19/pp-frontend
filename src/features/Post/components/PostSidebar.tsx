import { FC } from 'react'
import { useTranslation } from 'react-i18next'

// Components
import {
  IconLiveCircleTip,
  IconChatOutline,
  IconHeartFill,
  IconHeartOutline,
  IconPostStats
} from '../../../assets/svg/sprite'
import TipModal from '../../../components/UI/Modal/Tip/TipModal'
// Context
import { useModalContext } from '../../../context/modalContext'
// Styling
import './_postSidebar.scss'
import { toFixedNumber } from '../../../helpers/util'

interface Props {
  showStats: boolean
  hideTip: boolean
  // hideComment: boolean;
  like: {
    status: boolean
    count: number
  }
  modelData: {
    postId: number
    modelId: number
    avatarSrc: string
  }
  commentsCount: number
  isEnabled: boolean
  amount: number
  likePost: () => void
  openStats: () => void
  openComments: () => void
  onTipModal?: () => void
}
const PostSidebar: FC<Props> = ({
  showStats,
  hideTip,
  like,
  modelData,
  commentsCount,
  isEnabled,
  amount,
  likePost,
  openStats,
  openComments,
  onTipModal
}) => {
  const modalData = useModalContext()
  const { t } = useTranslation()

  const addTip = () => {
    modalData.addModal(t('tipAmount'), <TipModal tipType='post' modelData={modelData} />)
    onTipModal?.()
  }

  return (
    <div className='postSidebar'>
      {showStats && (
        <div className='postSidebar__action'>
          <div
            onClick={() => {
              openStats()
            }}
          >
            <IconPostStats />
          </div>
          <p>${Number.isInteger(amount) ? amount : toFixedNumber(amount, 2)}</p>
        </div>
      )}

      <div className='postSidebar__action'>
        <div
          onClick={() => {
            if (!isEnabled) return
            likePost()
          }}
        >
          {like.status ? <IconHeartFill /> : <IconHeartOutline color={isEnabled ? '#fff' : '#afafaf'} />}
        </div>
        <p>{like.count}</p>
      </div>

      <div className='postSidebar__action'>
        <div
          onClick={() => {
            if (!isEnabled) return
            openComments()
          }}
        >
          <IconChatOutline color={isEnabled ? '#fff' : '#afafaf'} />
        </div>
        <p>{commentsCount}</p>
      </div>
      {!hideTip && (
        <div className='postSidebar__action'>
          <div
            onClick={() => {
              if (!isEnabled) return
              addTip()
            }}
          >
            <IconLiveCircleTip color={isEnabled ? '#fff' : '#afafaf'} />
          </div>
        </div>
      )}
    </div>
  )
}

export default PostSidebar
