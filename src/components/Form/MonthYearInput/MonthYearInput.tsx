import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePreviousState } from '../../../helpers/hooks'
import './_month-year-input.scss'

const MonthYearInput: FC<{
  month: string
  year: string
  monthChangeFn: (val: any) => void
  yearChangeFn: (val: any) => void
  handleError: (value: boolean) => void
  hasError: boolean
  label: string
  minYear: number
  maxYear: number
  placeholder?: string
  customClass?: string
}> = ({
  month,
  year,
  monthChangeFn,
  yearChangeFn,
  handleError,
  hasError,
  label,
  placeholder,
  customClass,
  minYear,
  maxYear
}) => {
  const monthRef = useRef<any>()
  const yearRef = useRef<any>()
  const [monthFocused, setMonthFocused] = useState(false)
  const [yearFocused, setYearFocused] = useState(false)

  const yearPrevState: any = usePreviousState(year)
  const [hideSeparator, setHideSeparator] = useState(true)

  const { t } = useTranslation()

  useEffect(() => {
    if (month.trim().length > 0) {
      setHideSeparator(false)
    }
    if (month.trim().length < 1 && year.trim().length < 1) {
      setHideSeparator(true)
    }
    if (month.trim().length === 2) {
      yearRef.current.focus()
    }
    if (yearPrevState !== undefined) {
      if (yearPrevState.trim().length - year.trim().length === 1 && year === '') {
        monthRef.current.focus()

        yearRef.current.blur()
        setYearFocused(false)
      }
    }
    if (hasError && month.trim().length === 2 && year.trim().length === 2) {
      handleError(false)
    }
  }, [month, year, hasError])

  const clickFocusFunction = () => {
    if (yearRef.current && monthRef.current) {
      if (month.trim().length < 1) {
        monthRef.current.focus()
      }
      if (month.trim().length > 0 && year.trim().length < 1) {
        yearRef.current.focus()
      }
      if (month.trim().length > 0 && year.trim().length > 0) {
        yearRef.current.focus()
      }
    }
  }

  const handleMonthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const onlyNumRegEx = /^[0-9\b]+$/

    if (e.target.value === '' || onlyNumRegEx.test(e.target.value)) {
      if (e.target.value !== '') {
        if (parseInt(e.target.value) >= 12) {
          monthChangeFn('12')
          return
        }
        // if (parseInt(e.target.value) <= 1) {
        //   monthChangeFn('1');
        //   return;
        // }
      }
      monthChangeFn(e.target.value)
    }
  }

  const handleYearChange = (e: ChangeEvent<HTMLInputElement>) => {
    const onlyNumRegEx = /^[0-9\b]+$/

    if (e.target.value === '' || onlyNumRegEx.test(e.target.value)) {
      if (e.target.value !== '' && e.target.value.length === 2) {
        if (parseInt(e.target.value) <= minYear) {
          yearChangeFn(minYear.toString())
          return
        }
        if (parseInt(e.target.value) >= maxYear) {
          yearChangeFn(maxYear.toString())
          return
        }
      }
      yearChangeFn(e.target.value)
    }
  }

  return (
    <>
      <div
        key={1}
        className={`month-year-input-wrapper 
                        ${month.trim().length > 0 || year.trim().length > 0 ? 'month-year-input-wrapper-filled' : ''} 
                        ${monthFocused || yearFocused ? 'month-year-input-wrapper-focused' : ''}
                        ${customClass ? customClass : ''}
                      `}
      >
        <div className='month-year-input-background-click' onClick={clickFocusFunction}></div>
        <div
          className={`month-year-input-wrapper-border ${hasError ? 'month-year-input-wrapper-border-error' : ''}`}
        ></div>
        <input
          value={month}
          onChange={handleMonthChange}
          ref={monthRef}
          type='text'
          maxLength={2}
          className='month-year-input-field'
          onFocus={() => setMonthFocused(true)}
          onBlur={() => {
            if (month.length < 2) {
              !hasError && handleError(true)
            }
            setMonthFocused(false)
          }}
          onKeyPress={() => month.trim().length === 2 && yearRef.current.focus()}
        />
        <div className={`month-year-input-separator ${!hideSeparator ? 'month-year-input-separator-show' : ''}`}>/</div>
        <input
          value={year}
          onChange={handleYearChange}
          ref={yearRef}
          disabled={month.trim().length < 1 && year.trim().length < 1 ? true : false}
          type='text'
          maxLength={2}
          className='month-year-input-field'
          onFocus={() => setYearFocused(true)}
          onBlur={() => {
            if (year.length < 2) {
              !hasError && handleError(true)
            }
            setYearFocused(false)
          }}
          onKeyUp={(e: any) => e.key === 'Backspace' && year === '' && monthRef.current.focus()}
        />
        <div
          className={`month-year-input-label ${
            month.trim().length > 0 || year.trim().length > 0 ? 'month-year-input-label-filled' : ''
          } ${monthFocused || yearFocused ? 'month-year-input-label-focused' : ''}`}
          onClick={clickFocusFunction}
        >
          <div
            className={`month-year-input-label-text ${
              monthFocused || yearFocused ? 'month-year-input-label-text-focused' : ''
            }`}
          >
            {t('expiration')}
          </div>
        </div>
        {placeholder && (
          <div
            className={`month-year-input-placeholder ${
              month.trim().length > 0 || year.trim().length > 0 ? 'month-year-input-placeholder-filled' : ''
            }`}
          >
            {placeholder}
          </div>
        )}
      </div>
    </>
  )
}

export default MonthYearInput
