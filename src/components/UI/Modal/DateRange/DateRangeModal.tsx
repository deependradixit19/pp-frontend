import dayjs from 'dayjs'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useModalContext } from '../../../../context/modalContext'
// Components
import Button from '../../Buttons/Button'
import DateRangePicker from '../../DateRangePicker/DateRangePicker'
// Styling
import './_dateModal.scss' // todo: convert to css modules

const DateRangeModal: FC<{
  confirmFn: ({ start, end }: { start: dayjs.Dayjs; end: dayjs.Dayjs }) => void
}> = ({ confirmFn }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<{
    start: dayjs.Dayjs
    end: dayjs.Dayjs
  }>()

  const modalData = useModalContext()
  const { t } = useTranslation()

  return (
    <div className='dateModal'>
      <div className='dateModal__body'>
        <DateRangePicker
          allowPartialRange
          onChange={(values: any) => {
            if (values.length < 2) {
              setSelectedPeriod(undefined)
              return
            }
            setSelectedPeriod({
              start: dayjs(values[0]),
              end: dayjs(values[1])
            })
          }}
        />
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
        <Button
          text={t('apply')}
          color='black'
          font='mont-14-normal'
          width='13'
          height='3'
          customClass='dateModal_date__button'
          disabled={!selectedPeriod}
          clickFn={() => {
            if (selectedPeriod) {
              confirmFn(selectedPeriod)
              modalData.clearModal()
            }
          }}
        />
      </div>
    </div>
  )
}

export default DateRangeModal
