import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Icons } from '../../../helpers/icons'

const PostSchedule: FC<{
  price: number | null
  removePrice: any
  scheduleDate: Date | null
  removeSchedule: any
}> = ({ price, removePrice, scheduleDate, removeSchedule }) => {
  const { t } = useTranslation()
  return (
    <div style={{ justifyContent: scheduleDate ? 'space-between' : 'flex-end' }} className='newpost__schedule'>
      {scheduleDate && (
        <div className='newpost__schedule__time'>
          <p>
            {t('sheduledFor')}{' '}
            <span>
              {new Date(scheduleDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
              })}
            </span>
          </p>
          <img src={Icons.close} alt={t('removeDate')} onClick={removeSchedule} />
        </div>
      )}
      {price ? (
        <div className='newpost__schedule__price'>
          <p>${price}</p>
          <img src={Icons.close} alt={t('removeDate')} onClick={removePrice} />
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default PostSchedule
