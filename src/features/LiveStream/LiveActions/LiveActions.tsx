import { FC } from 'react'
import './_liveActions.scss'

import { useTranslation } from 'react-i18next'
import placeholderAvatar from '../../../assets/images/user_placeholder.png'
import { IconActionTip, IconChatOutline, IconLiveCircleTip } from '../../../assets/svg/sprite'

interface Props {
  role: string
  openTipModal: () => void
  toggleComments: () => void
}

const LiveActions: FC<Props> = ({ openTipModal, toggleComments, role }) => {
  const { t } = useTranslation()
  return (
    <div className={`liveActions liveActions__${role}`}>
      <div className='liveActions__avatar'>
        <div className='liveActions__avatar--ring'>
          <img src={placeholderAvatar} alt='placeholder' />
        </div>
      </div>
      {role === 'creator' && (
        <div className='liveAction' onClick={openTipModal}>
          <IconActionTip />

          <span>$500</span>
        </div>
      )}
      <div className='liveAction' onClick={toggleComments}>
        <IconChatOutline />
        <span>50</span>
      </div>
      {role === 'viewer' && (
        <div className='liveAction liveAction__viewer' onClick={openTipModal}>
          <IconLiveCircleTip />

          <span>{t('tip')}</span>
        </div>
      )}
    </div>
  )
}

export default LiveActions
