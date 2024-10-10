import Calendar, { CalendarProps } from 'react-calendar'

import 'react-calendar/dist/Calendar.css'
import { useUserContext } from '../../../context/userContext'
import { getDateTimeLocale } from '../../../lib/dayjs'
import '../InlineDatePicker/_inlineDatePicker.scss'
import styles from './_DateRangePicker.module.scss'

export default function DateRangePicker(props: CalendarProps): JSX.Element {
  const userData = useUserContext()

  return (
    <Calendar
      className={styles.dateRangePicker}
      selectRange={true}
      locale={getDateTimeLocale(userData.language.code.toLowerCase())}
      {...props}
    />
  )
}
