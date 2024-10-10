import { FC } from 'react'
import style from './_typing_status.module.scss'
import messageStyle from '../Message/_message.module.scss'

const TypingStatus: FC<{ user: any }> = ({ user }) => {
  return (
    <div className={`${style.container} ${messageStyle.last_message_margin}`}>
      <div className={style.icon}>
        <img src={user.avatar} alt='avatar' />
      </div>
      <div className={style.card_container}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default TypingStatus
