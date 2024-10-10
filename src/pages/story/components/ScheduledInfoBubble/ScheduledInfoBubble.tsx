import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

// Services
import { useGetMonthName } from '../../../../helpers/hooks'
import { Icons } from '../../../../helpers/icons'

// Styling
import styles from './ScheduledInfoBubble.module.scss'

const ScheduledInfoBubble: FC<{ date: Date; removeSchedule: () => void; customClass?: string }> = ({
  date,
  removeSchedule,
  customClass = ''
}) => {
  const { t } = useTranslation()
  const dateName = useGetMonthName()

  const formatDate = () => {
    const hours = `${
      date.getHours() > 12
        ? date.getHours() - 12 < 10
          ? `0${date.getHours() - 12}`
          : date.getHours() - 12
        : date.getHours() < 10
        ? `0${date.getHours()}`
        : date.getHours()
    }`
    const minutes = `${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`

    return `${dateName.getMonthName(date.getMonth(), 'shorthand')} ${date.getDate()}, ${hours} : ${minutes} ${
      date.getHours() > 12 ? 'PM' : 'AM'
    }`
  }

  return (
    <div className={`${styles.container} ${customClass}`}>
      {t('scheduledFor')} <span>{formatDate()}</span>
      <img src={Icons.close} alt={t('removeDate')} onClick={removeSchedule} />
    </div>
  )
}

export default ScheduledInfoBubble
