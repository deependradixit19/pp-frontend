import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { postDeposit } from '../../../../services/endpoints/payment'

// Context
import { useModalContext } from '../../../../context/modalContext'

//Components
import PriceCard from '../../../../pages/settings/pages/subscriptionOptions/components/PriceCard'
import FundsRadioGroup from '../AddCreditCard/components/FundsRadioGroup/FundsRadioGroup'
import Button from '../../Buttons/Button'

//Styling
import styles from './AddFunds.module.scss'

const AddFunds = ({ defaultCard }: { defaultCard: number }) => {
  const [funds, setFunds] = useState<number>(100)
  const [isAmountValid, setIsAmountValid] = useState<boolean>(true)

  const modalData = useModalContext()

  const { t } = useTranslation()

  const addDeposit = () => {
    if (typeof defaultCard === 'number' && isAmountValid) {
      postDeposit({ card_id: defaultCard, amount: funds })
      modalData.clearModal()
    }
  }

  const checkIsAmountValid = (amount: number) => {
    if (amount >= 10 && amount <= 200) {
      setIsAmountValid(true)
      return true
    } else {
      setIsAmountValid(false)
      return false
    }
  }

  return (
    <div className={styles.modalContainer}>
      <div className={styles.separator}></div>
      <PriceCard
        label={t('settings:addFundsPriceCardLabel')}
        price={funds}
        updatePrice={(val: number) => setFunds(Number(val))}
        validateFn={checkIsAmountValid}
        isValid={isAmountValid}
      />
      {!isAmountValid && (
        <small className={`subsOptions__fields__validation invalidPrice`}>You must enter valid amount!</small>
      )}
      <div className={styles.minMaxContainer}>
        <div className={styles.minMax}>
          Min <strong>$10</strong> Max <strong>$200</strong>
        </div>
      </div>
      <FundsRadioGroup selected={funds} onChange={(value: number) => setFunds(value)} />
      <div className={styles.footer}>
        <Button
          text='Close'
          color='grey'
          font='mont-14-normal'
          width='10'
          height='3'
          clickFn={() => modalData.clearModal()}
        />
        <Button text='Buy Now' color='blue' font='mont-14-normal' width='13' height='4' clickFn={() => addDeposit()} />
      </div>
    </div>
  )
}

export default AddFunds
