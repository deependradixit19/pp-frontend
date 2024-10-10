import React, { FC, useEffect, useState } from 'react'
import './_friendRequestModal.scss'
import { useMutation, useQueryClient } from 'react-query'
import cx from 'classnames'

import { useTranslation } from 'react-i18next'
import { sendFriendRequest } from '../../../../services/endpoints/profile'
import Button from '../../Buttons/Button'
import { useModalContext } from '../../../../context/modalContext'
import { FriendRequestSentModal } from './FriendshipRequestSentModal/FriendRequestSentModal'
import UserInfo from '../../UserInfo/UserInfo'

export type FriendRequestModalProps = {
  id: number
  online: boolean
  avatar: string | null
  display_name: string
  username: string
  follower_count: number
  friend_count: number
  close: any
  additionalFn?: any
}

const FriendRequestModal: FC<FriendRequestModalProps> = props => {
  const { id, avatar, additionalFn } = props

  const [message, setMessage] = useState<string>('')
  const [showInput, setShowInput] = useState<boolean>(false)
  const [reqSent, setReqSent] = useState<boolean>(false)

  const queryClient = useQueryClient()
  const modalData = useModalContext()
  const { t } = useTranslation()

  const sendReq = useMutation(
    (id: number) => {
      return sendFriendRequest(id, message)
    },
    {
      onSettled: () => {
        setReqSent(true)
        queryClient.invalidateQueries('profile')
        if (additionalFn) {
          additionalFn()
        }
      }
    }
  )

  useEffect(() => {
    if (reqSent) {
      modalData.addModal(t('friendRequest'), <FriendRequestSentModal avatar={avatar} />)
    }
  }, [reqSent])

  return (
    <>
      <UserInfo user={props} avatar={avatar} showStats={true} />
      <div className='friendReqModal__message'>
        <p
          className={cx({
            inputShown: showInput
          })}
          onClick={() => setShowInput(!showInput)}
        >
          {t('addMessage')}
        </p>
        {showInput && (
          <textarea
            value={message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setMessage(e.currentTarget.value)
            }}
            maxLength={76}
          />
        )}
      </div>
      <Button
        text={t('sendRequest')}
        color='blue'
        font='mont-14-normal'
        width='fit'
        padding='3'
        height='3'
        customClass='friendReqModal__button'
        clickFn={() => sendReq.mutate(id)}
      />
    </>
  )
}

export default FriendRequestModal
