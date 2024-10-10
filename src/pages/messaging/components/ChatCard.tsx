import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import './../_messages.scss'
import { useNavigate } from 'react-router-dom'

import AvatarHolder from '../../../components/UI/AvatarHolder/AvatarHolder'
import avatarPlaceholder from '../../../assets/images/user_placeholder.png'
import { someTimeAgo } from '../../../lib/dayjs'
import { useUserContext } from '../../../context/userContext'

const ChatCard: FC<{
  chat: any
}> = ({ chat }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const userData = useUserContext()

  return (
    <div
      className='messages__chatcard'
      onClick={() => {
        if (chat.other_users.length === 0) {
          sessionStorage.setItem(`convId-${userData.id}`, chat.last_message.message.conversation_id)
        }
        navigate(`/chat/${chat.other_users[0] ? chat.other_users[0].id : chat.id}`)
      }}
    >
      <div className='messages__chatcard__avatar'>
        <AvatarHolder
          img={
            chat.other_users
              ? chat?.other_users[0]?.avatar?.url || chat?.other_users[0]?.croppedAvatar?.url || avatarPlaceholder
              : chat?.user?.avatar?.url || avatarPlaceholder
          }
          size='60'
          isOnline={true}
        />
      </div>
      <div className='messages__chatcard__info'>
        <p className='messages__chatcard__info__name'>
          <span className='messages__chatcard__info__name__n'>
            {(chat?.other_users?.length > 0 && chat?.other_users[0]?.name) || t('deletedUser')}
          </span>
          {chat?.other_users?.length > 0 && chat?.other_users[0]?.username && (
            <span className='messages__chatcard__info__username'>@{chat?.other_users[0]?.username}</span>
          )}
        </p>
        <p className='messages__chatcard__info__message'>
          {chat.last_message?.message?.body || chat.conversation?.last_message?.body}
        </p>
      </div>
      <div className='messages__chatcard__stats'>
        <div
          className={`messages__chatcard__stats__time ${
            chat.unread_messages === 0 ? 'messages__chatcard__stats__time_no_margin' : ''
          }`}
        >
          {chat.last_message
            ? someTimeAgo(new Date(`${chat.last_message?.message.created_at}`))
            : chat.conversation?.last_message
            ? someTimeAgo(new Date(`${chat.conversation.last_message.created_at}`))
            : someTimeAgo(chat.created_at || '')}
        </div>
        {chat.unread_messages > 0 && <div className='messages__chatcard__stats__number'>{chat.unread_messages}</div>}
      </div>
    </div>
  )
}

export default ChatCard
