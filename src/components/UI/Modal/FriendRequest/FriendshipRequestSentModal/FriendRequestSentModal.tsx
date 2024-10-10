import React from 'react'

import { useTranslation } from 'react-i18next'
import AvatarHolder from '../../../AvatarHolder/AvatarHolder'
import Button from '../../../Buttons/Button'
import { IconRequestSent } from '../../../../../assets/svg/sprite'

import { FriendRequestModalProps } from '../FriendRequestModal'
import { useModalContext } from '../../../../../context/modalContext'

import './FriendshipRequestSentModal.scss'

type FriendRequestSentModalProps = Pick<FriendRequestModalProps, 'avatar'>

export const FriendRequestSentModal = (props: FriendRequestSentModalProps) => {
  const { avatar } = props
  const { clearModal } = useModalContext()
  const { t } = useTranslation()

  return (
    <div>
      <div className='friendReqSentModal__user'>
        <div className='avatar'>
          <AvatarHolder img={avatar || ''} size='80' />
          <IconRequestSent />
        </div>
        <p>{t('yourFriendRequestHasBeenSent')}</p>
        <Button
          color='black'
          height='3'
          font='mont-14-normal'
          text={t('close')}
          customClass={'friendReqSentModalButton'}
          clickFn={clearModal}
        />
      </div>
    </div>
  )
}
