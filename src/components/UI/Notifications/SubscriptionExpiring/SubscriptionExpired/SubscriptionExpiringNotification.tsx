import { FC, useCallback, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getLink } from '../../../../../helpers/appLinks'
import { toFixedNumber } from '../../../../../helpers/dataTransformations'
import { setSubscriptionRenewal } from '../../../../../services/endpoints/api_subscription'
import { addToast } from '../../../../Common/Toast/Toast'

import styles from '../../../../../features/NotificationCard/_NotificationCard.module.scss'
import Button from '../../../Buttons/Button'

const SubscriptionExpiringNotifcation: FC<{
  data: any
}> = ({ data }) => {
  const { t } = useTranslation()

  const [disableBtn, setDisableBtn] = useState(false)
  const handleSetDisableBtn = useCallback(() => {
    setDisableBtn(true)
  }, [setDisableBtn])

  const getBySubscriptionStatus = useCallback(
    (data: any) => {
      if (data?.subscription_status === 'will_expire' || data?.isToast) {
        return (
          <div className={`${styles.btnsRow}`}>
            <Button
              text={
                <p>
                  <Trans i18nKey={'notifications:enableRenewal'}>
                    subscribe
                    <span className={styles.contentText}>{{ price: toFixedNumber(data?.subscription?.price) }}</span>
                    mo
                  </Trans>
                </p>
              }
              customClass='notificationPriceButton'
              width='fit'
              color={'blue'}
              padding='1-15'
              disabled={disableBtn}
              clickFn={async () => {
                try {
                  handleSetDisableBtn()
                  await setSubscriptionRenewal(data?.subscription?.id)
                  addToast('success', t('renewalSwitchOnSuccess'))
                } catch (error) {
                  addToast('error', t('error:renewalSwitchOnError'))
                  console.error('renewal error: ', error)
                }
              }}
            />
          </div>
        )
      } else if (data?.subscription_status === 'renewed') {
        return (
          <>
            <br />
            {t('notifications:subscriptionWasRenewed')}
          </>
        )
      } else if (data?.subscription_status === 'expired') {
        return (
          <>
            <br />
            {t('notifications:subscriptionHasExpired')}
          </>
        )
      } else {
        return null
      }
    },
    [disableBtn, handleSetDisableBtn, t]
  )

  return (
    <>
      <Trans i18nKey={'notifications:subscriptionExpiring'}>
        subscription
        <Link to={getLink.profile(data?.sender?.id)}>{{ name: data?.sender?.name }}</Link>
        expired
      </Trans>
      {getBySubscriptionStatus(data)}
    </>
  )
}

export default SubscriptionExpiringNotifcation
