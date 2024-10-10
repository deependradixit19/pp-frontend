import { FC, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs, { ManipulateType } from 'dayjs'
import * as spriteIcons from '../../assets/svg/sprite'
import DropDownSelect from '../DropdownSelectNew/DropDownSelect'
import { useModalContext } from '../../context/modalContext'
import DateRangeModal from '../../components/UI/Modal/DateRange/DateRangeModal'
import { getShortIsoDate } from '../../lib/dayjs'
import styles from './AnalyticsPeriodDropdown.module.scss'
import { useUserContext } from '../../context/userContext'

interface IAnalyticsPeriodDropdown {
  selectedPeriodId: string
  onSelectPeriod: (categoryId: { start: string; end: string }) => void
}

export const getLastPeriodFn = (value: number, timeUnit: string) => () => {
  const current = dayjs()

  return {
    start: current.subtract(value, timeUnit as ManipulateType).toISOString(),
    end: current.toISOString()
  }
}

export const selectedToPeriod = {
  '7': getLastPeriodFn(6, 'day'), // if I put 7 it gets 8 dates...
  '30': getLastPeriodFn(29, 'day'), // similar here...
  '12month': getLastPeriodFn(11, 'month')
  // 'this_period': getLastPeriodFn(15, 'day'), // todo: remove when redoing this feature
}

const AnalyticsPeriodDropdown: FC<IAnalyticsPeriodDropdown> = ({ selectedPeriodId, onSelectPeriod }) => {
  const { t } = useTranslation()
  const profile = useUserContext()
  const [search, setSearch] = useState('')
  const modalData = useModalContext()
  const [selectedPeriodValue, setSelectedPeriodValue] = useState<string>(selectedPeriodId)

  const periods = useMemo(
    () => [
      { value: '7', label: t('last7Days') },
      { value: '30', label: t('last30Days') },
      { value: '12month', label: t('last12Months') },
      { value: 'this_period', label: t('thisPeriod') },
      { value: 'custom_period', label: t('customDates') }
    ],
    [t]
  )

  const handlePeriodSelect = useCallback(
    (selectedValue: string) => {
      setSelectedPeriodValue(selectedValue)
      const getPeriodFn = selectedToPeriod[selectedValue as keyof typeof selectedToPeriod]

      if (getPeriodFn) {
        onSelectPeriod(getPeriodFn())
        return
      }

      switch (selectedValue) {
        case 'this_period':
          if (profile.payout_frequency === 'weekly') {
            onSelectPeriod({
              start: getShortIsoDate(dayjs().isoWeekday(1)),
              end: getShortIsoDate(dayjs())
            })
          } else if (profile.payout_frequency === 'monthly') {
            onSelectPeriod({
              start: getShortIsoDate(dayjs().date(1)),
              end: getShortIsoDate(dayjs())
            })
          } else {
            onSelectPeriod(getLastPeriodFn(15, 'day')())
          }
          // todo: based on payout frequency in settings
          // This period is unique to the user.
          // Its dependent on when that they have selected in their settings
          // If the user selected Monthly,
          // then this period would be the current month,
          // last period would be last month
          // if they have Manual set.
          // This period would simply be since they last requested a payment
          break
        case 'custom_period':
          // open calendar and pick
          modalData.addModal(
            t('customDateRange'),
            <DateRangeModal
              confirmFn={({ start, end }) => {
                onSelectPeriod({
                  start: getShortIsoDate(start),
                  end: getShortIsoDate(end)
                })
              }}
            />
          )
          break
        default:
          console.error('Unknown period option selected')
          break
      }
    },
    [modalData, onSelectPeriod, t]
  )

  return (
    <DropDownSelect
      customClass={styles.analyticsPeriodDropdown}
      notSearchable // so it doesn't open keyboard and reduce viewport
      icon={
        <div className='analytics-dropdown-icon'>
          <spriteIcons.IconCalendarLinesWhite />
        </div>
      }
      options={periods}
      placeholder={t('date')}
      search={search}
      setSearch={setSearch}
      selectedOption={selectedPeriodValue}
      setSelectedOption={handlePeriodSelect}
    />
  )
}

export default AnalyticsPeriodDropdown
