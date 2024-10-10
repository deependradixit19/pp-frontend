import { FC } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'
import style from './_mass-message-card.module.scss'
import { useUserContext } from '../../../../../../context/userContext'
import {
  IconAudioOutline,
  IconCameraOutline,
  IconExcMarkCircle,
  IconImageOutline,
  IconLockFill
} from '../../../../../../assets/svg/sprite'
import { IMassMessage } from '../../../../../../types/interfaces/IMessage'
import { deleteMassMessage } from '../../../../../../services/endpoints/api_messages'
import { addToast } from '../../../../../Common/Toast/Toast'

const MassMessageCard: FC<{ message: IMassMessage }> = ({ message }) => {
  const { t } = useTranslation()
  const userData = useUserContext()
  const queryClient = useQueryClient()

  const date = new Date(message.sent_date)

  const monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = monthArray[date.getMonth()]
  const year = date.getFullYear()
  const day = ('0' + date.getDate()).slice(-2)

  const deleteMutation = useMutation(() => deleteMassMessage(message.id), {
    onSuccess: () => {
      queryClient.invalidateQueries('conversations')
      queryClient.invalidateQueries('mass-messages')
      addToast('success', t('successfullyDeleted'))
    }
  })

  return (
    <div className={style.container}>
      <div className={style.top_container}>
        <div className={style.media_container}>
          <div className={style.media_wrapper}>
            <img src={userData.avatar.url} alt='message media' />
            {message.message_price > 0 && (
              <div className={style.price_container}>
                <div className={style.price_background}></div>
                <IconLockFill />
                {message.message_price}
              </div>
            )}
          </div>
          <div className={style.media_count_container}>
            {message.videos_count > 0 && (
              <div className={style.media_count}>
                <IconCameraOutline color='#828C94' width='16' height='12' />
                {message.videos_count}
              </div>
            )}
            {message.photos_count > 0 && (
              <div className={style.media_count}>
                <IconImageOutline color='#828C94' width='12' height='12' />
                {message.photos_count}
              </div>
            )}
            {message.sounds_count > 0 && (
              <div className={style.media_count}>
                <IconAudioOutline color='#828C94' width='12' height='14' />
                {message.sounds_count}
              </div>
            )}
          </div>
        </div>
        <div className={style.stats_container}>
          {message.message_price > 0 && (
            <div className={style.stat}>
              <div>{t('purchased')}</div>
              <div className={`${style.stat_value}`}>
                <div className={style.stat_value_count_container}>
                  <div className={style.stat_value_count}>{message.purchased_count}</div>
                </div>
                ${message.message_price}
              </div>
            </div>
          )}
          <div className={style.stat}>
            <div>{t('sent')}</div>
            <div className={`${style.stat_value}`}>{message.sent}</div>
          </div>
          <div className={style.stat}>
            <div>{t('viewed')}</div>
            <div className={`${style.stat_value}`}>{message.viewed}</div>
          </div>
          <div className={style.stat}>
            <div>{t('category')}</div>
            <div className={`${style.stat_value} ${style.stat_value_none}`}>{message.category}</div>
          </div>
        </div>
      </div>
      <div className={style.text_container}>{message.body && message.body}</div>
      <div className={style.bottom_container}>
        <div className={style.bottom_date}>
          Sent{' '}
          <span>
            {month} {day}, {year} 12:43 AM
          </span>
        </div>
        <button
          className={style.unsend_btn}
          onClick={() => deleteMutation.mutate()}
          disabled={deleteMutation.isLoading}
        >
          {t('Unsend')}
          <IconExcMarkCircle color='#828C94' width='16' height='16' />
        </button>
      </div>
    </div>
  )
}

export default MassMessageCard
