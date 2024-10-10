import { FC, ReactNode } from 'react'
import { IconModalClose, IconSettingsOutlineLiveStream } from '../../../assets/svg/sprite'
import './_liveModal.scss'

interface Props {
  title: string
  onClose: () => void
  customClass?: string
  type?: string
  hideCloseButton?: boolean
  showConnectionSettings?: () => void
  children: ReactNode | ReactNode[]
}

const LiveModal: FC<Props> = ({
  children,
  title,
  onClose,
  customClass,
  type,
  hideCloseButton = false,
  showConnectionSettings
}) => {
  return (
    <div className={`livemodal livemodal--${customClass ? customClass : ''}`}>
      {type === 'start' && (
        <div className='livemodal__settings' onClick={showConnectionSettings}>
          <IconSettingsOutlineLiveStream />
        </div>
      )}
      {type === 'noCard' ? (
        <div className='livemodal__content'>{children}</div>
      ) : (
        <div className='livemodal__card'>
          <div className='livemodal__card--bg'></div>

          {!hideCloseButton && (
            <div className='livemodal__card--close' onClick={onClose}>
              <IconModalClose color='#A3A3A3' />
            </div>
          )}

          <div className='livemodal__card--title'>{title}</div>
          <div className='livemodal__card--content'>{children}</div>
        </div>
      )}
    </div>
  )
}

export default LiveModal
