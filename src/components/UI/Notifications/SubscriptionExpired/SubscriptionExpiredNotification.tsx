import { FC, useCallback, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useModalContext } from '../../../../context/modalContext'

import styles from '../../../../features/NotificationCard/_NotificationCard.module.scss'

import { getLink } from '../../../../helpers/appLinks'
import { toFixedNumber } from '../../../../helpers/dataTransformations'
import Button from '../../Buttons/Button'
import FullSubscribeModal from '../../Modal/FullSubscribeModal/FullSubscribeModal'

const SubscriptionExpiredNotifcation: FC<{
  data: any
}> = ({ data }) => {
  const [disableBtn, setDisableBtn] = useState(false)
  const modalData = useModalContext()
  const { t } = useTranslation()

  const handleSetDisableBtn = useCallback(() => {
    setDisableBtn(true)
  }, [setDisableBtn])

  const getBySubscriptionStatus = useCallback(
    (data: any) => {
      if (data?.subscription_status === 'expired' || data?.isToast) {
        return (
          <div className={`${styles.btnsRow}`}>
            <Button
              text={
                <p>
                  <Trans i18nKey={'notifications:subscribeFor'}>
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
              clickFn={() => {
                modalData.addModal(
                  '',
                  <FullSubscribeModal
                    id={data?.sender?.id}
                    avatar={data?.sender?.avatar}
                    displayName={data?.sender?.name}
                    username={data?.sender?.username}
                    onSubscribe={() => {
                      handleSetDisableBtn()
                    }}
                  />,
                  true,
                  false,
                  'notificationSubscribeModal'
                )
              }}
            />
          </div>
        )
      } else if (data?.subscription_status === 'will_expire' || data?.subscription_status === 'renewed') {
        return (
          <>
            <br />
            {t('notifications:subscriptionWasRenewed')}
          </>
        )
      } else {
        return null
      }
    },
    [disableBtn, handleSetDisableBtn, modalData, t]
  )

  return (
    <>
      <Trans i18nKey={'notifications:subscriptionExpired'}>
        subscription
        <Link to={getLink.profile(data?.sender?.id)}>{{ name: data?.sender?.name }}</Link>
        expired
      </Trans>
      {getBySubscriptionStatus(data)}
    </>
  )
}

export default SubscriptionExpiredNotifcation
