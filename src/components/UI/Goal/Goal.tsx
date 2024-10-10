import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './goal.module.scss'

interface Props {
  title: string
  amount: string
  validationError: string
  handleTitleChange: (title: string) => void
  handleAmountChange: (amount: string) => void
}

const Goal: FC<Props> = ({ title, amount, validationError, handleTitleChange, handleAmountChange }) => {
  const { t } = useTranslation()
  return (
    <div className={styles.goal}>
      <div className={styles.header}>
        <input
          type='text'
          value={title}
          name='goalTitle'
          id='goalTitle'
          placeholder={`${t('goal')}...`}
          maxLength={25}
          onKeyPress={e => {
            const target = e.target as HTMLInputElement
            if (amount && target.value.length >= 25) {
              e.preventDefault()
            }
          }}
          onChange={e => handleTitleChange(e.target.value)}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.inputGroup}>
          <input
            value={amount}
            type='number'
            name='goalAmount'
            id='goalAmount'
            placeholder={amount ? '' : t('setGoalAmount')}
            maxLength={25}
            onKeyPress={e => {
              const target = e.target as HTMLInputElement
              if (amount && target.value.length >= 9) {
                e.preventDefault()
              }
            }}
            onChange={e => handleAmountChange(e.target.value)}
            onBlur={e => {
              const value = e.target.value.replace(/^0+(?=\d)/, '')
              handleAmountChange(value)
            }}
          />
          {amount && <div className={styles.dollar}>$</div>}
          {amount && <label htmlFor='goalAmount'>{t('setGoalAmount')}</label>}
        </div>
      </div>
      {validationError && <div className={styles.error}>{validationError}</div>}
    </div>
  )
}

export default Goal
