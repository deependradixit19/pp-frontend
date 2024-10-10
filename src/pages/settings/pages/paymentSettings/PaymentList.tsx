import { FC, useState } from 'react'
import './_paymentMethod.scss'
import { useTranslation } from 'react-i18next'
import { Icons } from '../../../../helpers/icons'

import WithHeaderSection from '../../../../layouts/WithHeaderSection/WithHeaderSection'
import LayoutHeader from '../../../../features/LayoutHeader/LayoutHeader'

import ActionCard from '../../../../features/ActionCard/ActionCard'
import InputCard from '../../../../components/Form/InputCard/InputCard'
import FixedBottomButton from '../../../../components/UI/FixedBottomButton/FixedBottomButton'
import Wire from './Wire'

const PaymentList: FC<{
  page: string
}> = ({ page }) => {
  const [paxumEmail, setPaxumEmail] = useState<string>('')

  const { t } = useTranslation()

  const validateEmail = () => {
    if (/\S+@\S+\.\S+/.test(paxumEmail) && paxumEmail.length > 0 && paxumEmail.length > 0) {
      return true
    } else {
      return false
    }
  }

  const renderHeader = () => {
    switch (page) {
      case 'wire':
        return <LayoutHeader type='basic' section={t('bankInformation')} title={t('wire')} />

      case 'paxum':
        return <LayoutHeader type='basic' section={t('paymentMethod')} title={t('paxum')} />

      default:
        return
    }
  }

  const renderPage = () => {
    switch (page) {
      case 'wire':
        return <Wire />

      case 'ach':
        return (
          <ActionCard
            icon={Icons.payment_plus}
            text=''
            subtext={t('addAchAccount')}
            customClass='paymentMethod__actionCard'
          />
        )

      case 'paxum':
        return (
          <InputCard
            type='text'
            label={t('email')}
            value={paxumEmail}
            changeFn={(val: string) => {
              setPaxumEmail(val)
            }}
            validate='email'
          />
        )
    }
  }

  const renderBottomButton = () => {
    switch (page) {
      case '?payment-method&paxum':
        return (
          <FixedBottomButton text={t('save')} disabled={!validateEmail()} customClass='paymentMethod__fixedbottombtn' />
        )

      default:
        return false
    }
  }

  return (
    <WithHeaderSection headerSection={<>{renderHeader()}</>}>
      <>
        {renderPage()}
        {renderBottomButton()}
      </>
    </WithHeaderSection>
  )
}

export default PaymentList
