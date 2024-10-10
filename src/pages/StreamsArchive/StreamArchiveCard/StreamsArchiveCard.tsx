import React, { FC } from 'react'

// Services
import { useGetMonthName } from '../../../helpers/hooks'
// Styling
import styles from './StreamsArchiveCard.module.scss'

interface IStreamInfo {
  date: Date
  image: string
  duration: Date
  profit?: number
}

const StreamsArchiveCard: FC<{ streamInfo: IStreamInfo }> = ({ streamInfo }) => {
  const monthName = useGetMonthName()
  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url("${streamInfo.image}")`,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}
    >
      <Bubble
        useCase='date'
        content={`${monthName.getMonthName(streamInfo.date.getMonth(), 'shorthand')} ${streamInfo.date.getDate()}`}
      />
      {streamInfo.profit && <Bubble useCase='profit' content={`$${streamInfo.profit}`} />}
      <Bubble useCase='duration' content={`${streamInfo.duration.getHours()}:${streamInfo.duration.getMinutes()}`} />
    </div>
  )
}

const Bubble: FC<{
  useCase: 'date' | 'duration' | 'profit'
  content: string
}> = ({ useCase = 'date', content }) => {
  return <div className={`${styles.bubble} ${styles[useCase]}`}>{content}</div>
}

export default StreamsArchiveCard
