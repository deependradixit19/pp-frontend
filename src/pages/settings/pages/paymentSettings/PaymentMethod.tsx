import { FC, useState } from 'react'
import './_paymentMethod.scss'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from 'react-query'
import { Icons } from '../../../../helpers/icons'

import WithHeaderSection from '../../../../layouts/WithHeaderSection/WithHeaderSection'
import LayoutHeader from '../../../../features/LayoutHeader/LayoutHeader'
import ActionCard from '../../../../features/ActionCard/ActionCard'
import { useUserContext } from '../../../../context/userContext'
import { putBasicPayoutSettings } from '../../../../services/endpoints/payout'
import { addToast } from '../../../../components/Common/Toast/Toast'

const PaymentMethod: FC = () => {
  const { t } = useTranslation()
  const profile = useUserContext()
  const queryClient = useQueryClient()
  const [paymentMethodSelected, setPaymentMethodSelected] = useState<string>(profile.payout_method)
  const { mutate } = useMutation(
    (vars: { freq: string; method: string }) =>
      putBasicPayoutSettings({ payout_frequency: vars.freq, payout_method: vars.method }),
    {
      onMutate: vars => {
        setPaymentMethodSelected(vars.method)
      },
      onSettled: () => {
        queryClient.invalidateQueries('loggedProfile')
      },
      onError: () => {
        addToast('error', t('error:payoutSettings'))
      },
      onSuccess: () => {
        addToast('success', t('successSettingPayout'))
      }
    }
  )

  const paymentOptions = [
    // {
    //   link: '/settings/general/payout-settings/payment-method/ach',
    //   icon: Icons.payment_bank,
    //   text: t('ach'),
    //   hasRadio: true,
    //   inputId: 'payment_ach',
    //   toggleActive: paymentMethodSelected === 'ach',
    //   toggleFn: () => setPaymentMethodSelected('ach'),
    //   hasArrow: true,
    //   customClass: `paymentMethod__actionCard ${
    //     paymentMethodSelected === 'ach'
    //       ? 'paymentMethod__actionCard--selected'
    //       : ''
    //   }`,
    // },
    {
      link: '/settings/general/payout-settings/payment-method/wire',
      icon: Icons.payment_bank,
      text: t('wire'),
      hasRadio: true,
      inputId: 'payment_wire',
      toggleActive: paymentMethodSelected === 'wire',
      toggleFn: () => mutate({ method: 'wire', freq: profile.payout_frequency }),
      hasArrow: true,
      customClass: `paymentMethod__actionCard ${
        paymentMethodSelected === 'wire' ? 'paymentMethod__actionCard--selected' : ''
      }`
    }
    // {
    //   link: '/settings/general/payout-settings/payment-method/paxum',
    //   icon: Icons.payment_paxum,
    //   text: t('paxum'),
    //   hasRadio: true,
    //   inputId: 'payment_paxum',
    //   toggleActive: paymentMethodSelected === 'paxum',
    //   toggleFn: () => setPaymentMethodSelected('paxum'),
    //   hasArrow: true,
    //   customClass: `paymentMethod__actionCard ${
    //     paymentMethodSelected === 'paxum'
    //       ? 'paymentMethod__actionCard--selected'
    //       : ''
    //   }`,
    // },
  ]

  return (
    <WithHeaderSection headerSection={<LayoutHeader type='basic' section={t('account')} title={t('payoutMethod')} />}>
      <>
        {paymentOptions.map(
          (
            opt: {
              link: string
              icon: string
              text: string
              hasRadio: boolean
              inputId: string
              toggleActive: boolean
              toggleFn: () => void
              hasArrow: boolean
              customClass: string
            },
            key: number
          ) => (
            <ActionCard
              key={key}
              link={opt.link}
              icon={opt.icon}
              text={opt.text}
              hasRadio={opt.hasRadio}
              inputId={opt.inputId}
              toggleActive={opt.toggleActive}
              toggleFn={opt.toggleFn}
              hasArrow={opt.hasArrow}
              customClass={opt.customClass}
            />
          )
        )}
      </>
    </WithHeaderSection>
  )
}

export default PaymentMethod
