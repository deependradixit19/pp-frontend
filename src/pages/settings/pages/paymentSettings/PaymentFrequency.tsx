import { FC, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from 'react-query'
import dayjs from 'dayjs'
import LayoutHeader from '../../../../features/LayoutHeader/LayoutHeader'
import WithHeaderSection from '../../../../layouts/WithHeaderSection/WithHeaderSection'
import { IconCalendarOutline } from '../../../../assets/svg/sprite'
import ActionCard from '../../../../features/ActionCard/ActionCard'
import styles from './_PaymentFrequency.module.scss'
import { useUserContext } from '../../../../context/userContext'
import { putBasicPayoutSettings } from '../../../../services/endpoints/payout'
import { addToast } from '../../../../components/Common/Toast/Toast'

const PaymentFrequency: FC = () => {
  const { t } = useTranslation()
  const profile = useUserContext()
  const queryClient = useQueryClient()
  const [currentFrequency, setCurrentFrequency] = useState(profile.payout_frequency)
  const { mutate } = useMutation(
    (vars: { freq: string; method: string }) =>
      putBasicPayoutSettings({ payout_frequency: vars.freq, payout_method: vars.method }),
    {
      onMutate: vars => {
        setCurrentFrequency(vars.freq)
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

  return (
    <>
      <WithHeaderSection
        customClass={styles.whs}
        withoutBorder={false}
        headerSection={
          <LayoutHeader type='basic' section={t('settings:payoutSettings')} title={t('payoutFrequency')} />
        }
      >
        {/* <ActionCard
          icon={<IconCalendarOutline />}
          text={t('manual')}
          hasRadio={true}
          toggleActive={currentFrequency === 'manual'}
          clickFn={() => mutate({ freq: 'manual', method: profile.payout_method })}
        /> */}
        <ActionCard
          icon={<IconCalendarOutline />}
          text={t('weekly')}
          hasRadio={true}
          toggleActive={currentFrequency === 'weekly'}
          clickFn={() => mutate({ freq: 'weekly', method: profile.payout_method })}
        />
        {currentFrequency === 'weekly' && (
          <p className={styles.nextPayout}>
            {t('onceYourBalanceIsOver')} <span>{dayjs().add(1, 'week').isoWeekday(1).format('ll')}</span>
          </p>
        )}
        <ActionCard
          icon={<IconCalendarOutline />}
          text={t('monthly')}
          hasRadio={true}
          toggleActive={currentFrequency === 'monthly'}
          clickFn={() => mutate({ freq: 'monthly', method: profile.payout_method })}
        />
        {currentFrequency === 'monthly' && (
          <p className={styles.nextPayout}>
            {t('onceYourBalanceIsOver')} <span>{dayjs().add(1, 'month').date(1).format('ll')}</span>
          </p>
        )}
      </WithHeaderSection>
    </>
  )
}

export default PaymentFrequency
