import { FC } from 'react'
import './_userCard.scss'
import { useTranslation } from 'react-i18next'
import { useModalContext } from '../../../context/modalContext'
import { AllIcons } from '../../../helpers/allIcons'

import FanModal from '../../../features/FanModal/FanModal'
import AvatarHolder from '../AvatarHolder/AvatarHolder'
import IconButton from '../Buttons/IconButton'

const UserCardFan: FC<{
  user: any
  type: string
  listBtn?: () => void
  chatBtn?: () => void
}> = ({ user, type, listBtn, chatBtn }) => {
  const modalData = useModalContext()
  const { t } = useTranslation()

  if (type === 'with-buttons') {
    return (
      <div
        className='userCard userCard--fan'
        onClick={() => modalData.addModal('', <FanModal user={user} />, true, false, 'userCard__fan--modal')}
      >
        <div className='userCard__avatar'>
          <AvatarHolder img={user.avatar.url} size='60' />
        </div>
        <div className='userCard__info'>
          <p className='userCard__info__name'>{user.name}</p>
          <p className='userCard__info__username'>{user.username}</p>
        </div>
        <div className='userCard__buttons'>
          <IconButton
            icon={AllIcons.button_list_black}
            size='medium'
            type='white'
            customClass='userCard__buttons__button'
            clickFn={listBtn}
          />
          <IconButton
            icon={AllIcons.chat_bubble_blue}
            size='medium'
            type='white'
            customClass='userCard__buttons__button'
            clickFn={chatBtn}
          />
        </div>
      </div>
    )
  } else {
    return (
      <div className='userCard userCard--fan'>
        <div className='userCard__avatar'>
          <AvatarHolder img={user.avatar.url} size='60' />
        </div>
        <div className='userCard__info'>
          <p className='userCard__info__name'>{user.name}</p>
          <p className='userCard__info__username'>{user.username}</p>
        </div>
        <div className='userCard__stats'>
          <p className='userCard__stats__expire'>
            {t('expires')} <span>Oct 5, 2021</span>
          </p>
          <p className='userCard__stats__money'>
            {t('moneySpent')} <span>$500</span>
          </p>
        </div>
      </div>
    )
  }
}

export default UserCardFan
