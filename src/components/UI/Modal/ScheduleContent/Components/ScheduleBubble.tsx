import React, { FC } from 'react'

//Services
import { useGetMonthName } from '../../../../../helpers/hooks'

// Styling
import styles from './ScheduleBubble.module.scss'

const ScheduleBubble: FC<{
  date: Date
  title: string
  display: 'time' | 'date'
}> = ({ date, title, display = 'date' }) => {
  const dateName = useGetMonthName()

  const formatDate = () => {
    return {
      date: `${dateName.getMonthName(date.getMonth(), 'shorthand')} ${date.getDate()}, ${date.getFullYear()}`,
      time: `${
        date.getHours() > 12
          ? date.getHours() - 12 < 10
            ? `0${date.getHours() - 12}`
            : date.getHours() - 12
          : date.getHours() < 10
          ? `0${date.getHours()}`
          : date.getHours()
      }:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()} ${date.getHours() > 12 ? 'PM' : 'AM'}`
    }
  }
  return (
    <div className={styles.bubble}>
      <p className={styles.bubbleTitle}>{title}</p>
      <p className={styles.bubbleSubtitle}>{formatDate()[display]}</p>
    </div>
  )
}

export default ScheduleBubble
