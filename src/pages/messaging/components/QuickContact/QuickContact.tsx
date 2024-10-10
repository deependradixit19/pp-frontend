import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import avatarPlaceholder from '../../../../assets/images/user_placeholder.png'
import style from './_quick-contact.module.scss'

const QuickContact: FC<{
  user: {
    amount_of_messages: number
    conversation_id: number
    other_user_id: number
    user_name: string
    avatar: string
  }
}> = ({ user }) => {
  const navigate = useNavigate()

  return (
    <div className={style.container} onClick={() => navigate(`/chat/${user.other_user_id}`)}>
      <div className={style.avatar}>
        <img src={user.avatar || avatarPlaceholder} alt='user avatar' />
      </div>
      <div className={style.user_name}>{user.user_name}</div>
    </div>
  )
}

export default QuickContact
