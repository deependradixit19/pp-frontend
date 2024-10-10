import { FC } from 'react'
import { IScheduledListDate } from '../../../types/interfaces/ITypes'

// Components
import ScheduledListDate from '../ScheduledListDate/ScheduledListDate'

// Styling
import './ScheduleList.module.scss'

interface ScheduleListProps {
  onEditClick: (postType: string, postId: number) => any
  list: IScheduledListDate[]
}

const ScheduleList: FC<ScheduleListProps> = ({ onEditClick, list }) => {
  return (
    <>
      {list.map((element, index) => (
        <ScheduledListDate key={index} onEditClick={onEditClick} contentOnDate={element} />
      ))}
    </>
  )
}

export default ScheduleList
