import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useModalContext } from '../../../../context/modalContext'
// Components
import Button from '../../Buttons/Button'
import InlineDatePicker from '../../InlineDatePicker/InlineDatePicker'
import InlineTimePicker from '../../InlineTimePicker/InlineTimePicker'
// Styling
import './_dateModal.scss'

const scheduledPosts = [
  { scheduled: new Date(2022, 6, 15) },
  { scheduled: new Date(2022, 6, 15) },
  { scheduled: new Date(2022, 6, 15) },
  { scheduled: new Date(2022, 6, 15) },
  { scheduled: new Date(2022, 6, 15) },
  { scheduled: new Date(2022, 6, 15) },
  { scheduled: new Date(2022, 6, 16) },
  { scheduled: new Date(2022, 6, 18) },
  { scheduled: new Date(2022, 6, 19) },
  { scheduled: new Date(2022, 6, 19) },
  { scheduled: new Date(2022, 6, 19) },
  { scheduled: new Date(2022, 6, 19) },
  { scheduled: new Date(2022, 6, 20) },
  { scheduled: new Date(2022, 6, 20) },
  { scheduled: new Date(2022, 6, 25) }
]

const scheduledPostsWithType = scheduledPosts.map(post => ({
  scheduled: post.scheduled,
  type: 'someType' // Replace 'someType' with the appropriate string value based on your requirements
}));

const DateModal: FC<{
  confirmFn: (val: Date) => void
  maxDate?: Date
  noNextStep?: boolean
  noMinDate?: boolean
  startTab?: string
}> = ({ confirmFn, noNextStep, noMinDate, maxDate, startTab = 'date' }) => {
  const [activeTab, setActiveTab] = useState(startTab)
  const [date, setDate] = useState<Date>(new Date())

  const modalData = useModalContext()
  const { t } = useTranslation()

  const getSelectedTime = (hours: number, minutes: number) => {
    let tempDate = date
    tempDate.setHours(hours)
    tempDate.setMinutes(minutes)
    setDate(tempDate)
    var utc = new Date(date.getTime() + date.getTimezoneOffset() * 60000)
  }

  return (
    <div className='dateModal'>
      <div className='dateModal__body'>
        {activeTab === 'date' && (
          <InlineDatePicker
            onChange={(date) => {
              console.log(date);
              if(date instanceof Date) {
                setDate(date);
              }
            }}
            value={date}
            scheduledPosts={scheduledPostsWithType}
            // dotsColor={'red'}
            minDate={!noMinDate ? new Date() : undefined}
            maxDate={maxDate}
          />
        )}
        {activeTab === 'time' && <InlineTimePicker getSelectedTime={getSelectedTime} />}
      </div>
      <div className='dateModal__actions'>
        <Button
          text={t('cancel')}
          color='grey'
          font='mont-14-normal'
          width='13'
          height='3'
          customClass='dateModal_date__button'
          clickFn={() => {
            modalData.clearModal()
          }}
        />
        {activeTab === 'date' && (
          <Button
            text={!noNextStep ? t('next') : t('save')}
            color='black'
            font='mont-14-normal'
            width='13'
            height='3'
            customClass='dateModal_date__button'
            clickFn={() => {
              if (!noNextStep) {
                setActiveTab('time')
              } else {
                confirmFn(date)
                modalData.clearModal()
              }
            }}
          />
        )}
        {activeTab === 'time' && (
          <Button
            text={t('save')}
            color='black'
            font='mont-14-normal'
            width='13'
            height='3'
            customClass='dateModal_date__button'
            clickFn={() => {
              confirmFn(
                // new Date(date.getTime() + date.getTimezoneOffset() * 60000)
                date
              )
              modalData.clearModal()
            }}
          />
        )}
      </div>
    </div>
  )
}

export default DateModal
