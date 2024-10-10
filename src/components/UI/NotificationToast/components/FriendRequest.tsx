import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { IconClose } from '../../../../assets/svg/sprite'
import Button from '../../Buttons/Button'
import SvgIconButton from '../../Buttons/SvgIconButton'

import '../_notificationToast.scss'

interface Props {
  text?: string
  linkUrl?: string
  onAcceptCb: () => void
  onDeclineCb: () => void
}

const FriendRequest: FC<Props> = ({ linkUrl, text, onAcceptCb, onDeclineCb }) => {
  const { t } = useTranslation()
  const [answered, setAnswered] = useState(false)

  return (
    <div className='friendRequest'>
      {text && <div className='friendRequest__text'>{t('notifications:hasSentYouAFriendRequest')}</div>}

      {linkUrl && (
        <div className='friendRequest__link'>
          <Link to={linkUrl}>{t('notifications:hasSentYouAFriendRequest')}</Link>
        </div>
      )}
      <div className='friendRequest__actions'>
        <SvgIconButton
          icon={<IconClose />}
          clickFn={() => {
            setAnswered(true)
            onDeclineCb()
          }}
          type='circle'
          customClass='circleButton'
          disabled={answered}
        />
        <Button
          customClass='friendRequest__actions__accept'
          text={t('accept')}
          color='blue'
          font='mont-14-normal'
          disabled={answered}
          // width="7"
          // height="3"
          clickFn={() => {
            setAnswered(true)
            onAcceptCb()
          }}
        />
      </div>
    </div>
  )
}

export default FriendRequest
