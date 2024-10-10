import { FC } from 'react'
import './_chatCard.scss'
import { useNavigate } from 'react-router-dom'
import { iChatCard } from '../../types/iTypes'

import AvatarHolder from '../../components/UI/AvatarHolder/AvatarHolder'

const ChatCard: FC<iChatCard> = ({ conversation_id, avatar, name, username, message, time, number }) => {
  const navigate = useNavigate()

  return (
    <div className='chatCard' onClick={() => navigate(`/dm/${conversation_id}/chat`)}>
      <div className='chatCard__avatar'>
        <AvatarHolder img={avatar} size='60' isOnline={true} />
      </div>
      <div className='chatCard__info'>
        <p className='chatCard__info__name'>
          <span className='chatCard__info__name__n'>{name}</span>{' '}
          <span className='chatCard__info__username'>@{username}</span>
        </p>
        <p className='chatCard__info__message'>{message}</p>
      </div>
      <div className='chatCard__stats'>
        <div className='chatCard__stats__time'>{time.split('T')[0]}</div>
        <div className='chatCard__stats__number'>{number}</div>
      </div>
    </div>
  )
}

export default ChatCard
