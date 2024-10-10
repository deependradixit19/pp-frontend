import React from 'react'

// styling
import styles from './FundsRadioGroup.module.scss'

const mockOptions: { label: string; value: number }[] = [
  {
    label: '$10',
    value: 10
  },
  {
    label: '$30',
    value: 30
  },
  {
    label: '$50',
    value: 50
  },
  {
    label: '$100',
    value: 100
  },
  {
    label: '$200',
    value: 200
  }
]

export default function FundsRadioGroup({
  options = mockOptions,
  selected,
  onChange
}: {
  options?: { label: string; value: string | number }[]
  selected: string | number
  onChange: Function
}) {
  const setSelectedClass = (selected: string | number, optionValue: string | number) => {
    if (selected === optionValue) {
      return 'radioLabelSelected'
    }

    return 'radioLabel'
  }
  return (
    <div className={styles.groupContainer}>
      {options.map(option => (
        <label htmlFor={option.label} className={styles[setSelectedClass(selected, option.value)]}>
          <input
            id={option.label}
            type='radio'
            name='FundsRadioGroup'
            value={option.value}
            onChange={event => !!onChange && onChange(parseInt(event.target.value))}
          />
          <span className={styles.text}>{option.label}</span>
        </label>
      ))}
    </div>
  )
}
