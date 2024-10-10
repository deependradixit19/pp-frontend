import React, { FC } from 'react'
import { useWeekday } from '../../../helpers/hooks'
import { IScheduledListDate } from '../../../types/interfaces/ITypes'
import ScheduledListItem from '../ScheduledIListItem/ScheduledListItem'

// Components

// Styling
import styles from './ScheduledListDate.module.scss'

interface ScheduleListDateProps {
  onEditClick: (postType: string, postId: number) => any
  contentOnDate: IScheduledListDate
}

const ScheduledListDate: FC<ScheduleListDateProps> = ({ onEditClick, contentOnDate }) => {
  const weekday = useWeekday()
  return (
    <>
      {contentOnDate && (
        <div className={styles.container}>
          <div className={styles.number}>
            {contentOnDate.date.dayOfMonth < 10 ? `0${contentOnDate.date.dayOfMonth}` : contentOnDate.date.dayOfMonth}{' '}
            <span>{weekday.getWeekday(contentOnDate.date.nameOfDay, 'full')}</span>
          </div>
          <ul className={styles.list}>
            {contentOnDate.list.map(element => (
              <ScheduledListItem key={element.postId} onEditClick={onEditClick} listItem={element} />
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

export default ScheduledListDate
