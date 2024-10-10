import { FC, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// Services
import { IconCalendarLinesWhite, IconNewStory } from '../../../../assets/svg/sprite'
import { useModalContext } from '../../../../context/modalContext'

// Components
import ScheduleBubble from './Components/ScheduleBubble'
import NewStream from '../NewStream/NewStream'

// Styling
import styles from './ScheduleContent.module.scss'

const ScheduleContent: FC<{ date: Date }> = ({ date }) => {
  const { t } = useTranslation()
  const modalData = useModalContext()

  const linkQueryParams = useMemo(() => {
    const month: string = '0' + (date.getMonth() + 1)
    const day: string = '0' + date.getDate().toString()
    const hours: string = '0' + date.getHours().toString()
    const minutes: string = '0' + date.getMinutes().toString()
    const seconds: string = '0' + date.getSeconds().toString()

    return `?date=${date.getFullYear()}-${month.slice(-2)}-${day.slice(-2)}T${hours.slice(-2)}:${minutes.slice(
      -2
    )}:${seconds.slice(-2)}`
  }, [date])

  const openNewStreamModal = () => modalData.addModal('Schedule', <NewStream date={date} />, false)
  return (
    <div>
      <div className={styles.bubblesContainer}>
        <ScheduleBubble date={date} display='date' title={t('date')} />
        <ScheduleBubble date={date} display='time' title={t('time')} />
      </div>
      <div className={styles.actionContainer}>
        <Link className={styles.action} to={`/new/post/create${linkQueryParams}`} onClick={modalData.clearModal}>
          <IconCalendarLinesWhite width={20} height={20} color='#2894FF' />
          <span>{t('scheduleNewPost')}</span>
        </Link>
        <div className={styles.action} onClick={openNewStreamModal}>
          <IconCalendarLinesWhite width={20} height={20} color='#2894FF' />
          <span>{t('scheduleStream')}</span>
        </div>
        <div className={styles.action}>
          <IconCalendarLinesWhite width={20} height={20} color='#2894FF' />
          <span>{t('scheduleMassMessage')}</span>
        </div>
        <Link className={styles.action} to={`/new/story${linkQueryParams}`} onClick={modalData.clearModal}>
          <IconNewStory width='20' height='20' />
          <span>{t('scheduleStory')}</span>
        </Link>
      </div>
    </div>
  )
}

export default ScheduleContent
