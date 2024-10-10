import { FC } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { IconChatOutlineTransparentBg } from '../../../../../assets/svg/sprite'
import Button from '../../../../../components/UI/Buttons/Button'
import { useModalContext } from '../../../../../context/modalContext'
import ActionCard from '../../../../../features/ActionCard/ActionCard'
import { getCalimedTrialUsers } from '../../../../../services/endpoints/api_subscription'
import style from './_claimed_users_modal.module.scss'

const ClaimedUsersModal: FC<{ users: [] }> = ({ users }) => {
  const dateArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const modalData = useModalContext()

  return (
    <div className={style.container}>
      <div className={style.users_container}>
        {users.length > 0 &&
          users.map((user: any) => {
            const today = new Date()
            const userJoin = user.join_date ? new Date(user.join_date.replace(' ', '-')) : new Date()
            return (
              <ActionCard
                customClass={style.user_card}
                text={user.name}
                subtext={`@${user.username.toLowerCase()}`}
                avatar={
                  <div className={style.user_avatar}>
                    <img src={user.avatar.src} alt='avatar' />
                  </div>
                }
                description={
                  <div className={style.user_claimed}>
                    Claimed{' '}
                    <span>
                      {today.toDateString() === userJoin.toDateString()
                        ? 'Today'
                        : `${dateArray[userJoin.getMonth()]} ${userJoin.getDate()}, ${userJoin.getFullYear()}`}
                    </span>
                  </div>
                }
                customHtml={
                  <Link to={`/chat/${user.avatar.user_id}`} onClick={() => modalData.clearModal()}>
                    <div className={style.user_chat_link}>
                      <IconChatOutlineTransparentBg color='#2894ff' />
                    </div>
                  </Link>
                }
              />
            )
          })}
      </div>
      <div className={style.close_container}>
        <button className={style.button_close} onClick={() => modalData.clearModal()}>
          Close
        </button>
      </div>
    </div>
  )
}

export default ClaimedUsersModal
