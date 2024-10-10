import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Button from '../../Buttons/Button'

import '../_notificationToast.scss'

interface Props {
  textPrimary?: string
  textSecondary?: string
  buttonText: string
  linkText: string
  linkUrl: string
  price: string
  clickFn: () => void
}

const SubscriptionRenewal: FC<Props> = ({
  textPrimary,
  textSecondary,
  buttonText,
  linkText,
  linkUrl,
  price,
  clickFn
}) => {
  const { t } = useTranslation()
  return (
    <div className='subscriptionRenewal'>
      <div className='subscriptionRenewal__text'>
        {textPrimary}{' '}
        <div className='subscriptionRenewal__link'>
          <Link to={linkUrl}>{linkText}</Link>
        </div>{' '}
        {textSecondary}
      </div>
      <div className='subscriptionRenewal__action'>
        <Button
          text={
            <p>
              {buttonText}{' '}
              <span>
                ${price} / {t('monthShort')}
              </span>
            </p>
          }
          color='blue'
          font='mont-14-normal'
          width='fit'
          padding='1-15'
          // height="3"
          clickFn={clickFn}
          customClass='notificationPriceButton'
        />
      </div>
    </div>
  )
}

export default SubscriptionRenewal
