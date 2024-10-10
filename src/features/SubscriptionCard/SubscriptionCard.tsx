import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { IconStarGradient } from '../../assets/svg/sprite'
import './_subscription-card.scss'

type priceData = {
  id: number
  discount: number
  price: number
  month_count: number
  name: string
}

const SubscriptionCard: FC<{
  selected: boolean
  onClick: () => void
  data: priceData
  notInList?: boolean
  campaignDiscount?: number
}> = ({ data, selected, onClick, notInList = false, campaignDiscount }) => {
  const { t } = useTranslation()
  const discountedPrice = campaignDiscount ? ((data.price / data.month_count) * campaignDiscount) / 100 : null
  const price = discountedPrice ? data.price - discountedPrice : data.price
  return (
    <div
      onClick={onClick}
      className={`subscription-card-container ${selected ? 'subscription-card-container-selected' : ''}`}
    >
      <div className='subscription-card-selected-mark'></div>
      <div className='subscription-card-selected-star'>
        <IconStarGradient />
      </div>

      {!notInList && (
        <div className='subscrition-card-radio-outer'>
          <div className='subscrition-card-radio-inner'></div>
        </div>
      )}

      <div className='subscription-card-info-container'>
        <div className='subscrition-card-info-time'>
          <div className='subscrition-card-info-time-main'>{data.name}</div>
          {!notInList ? (
            data.discount > 0 ? (
              <div className='subscrition-card-info-time-discount'>
                {t('save')} {data.discount}%
              </div>
            ) : (
              campaignDiscount && (
                <div className='subscrition-card-info-time-discount'>
                  {t('save')} {campaignDiscount}%
                </div>
              )
            )
          ) : (
            <div className='subscrition-card-info-price-sub'>{t('payMonthlyCancelAnyTime')}</div>
          )}
        </div>

        <div className='subscrition-card-info-price'>
          {!notInList ? (
            <>
              <div className='subscrition-card-info-price-main'>{`$${Math.round(price * 100) / 100}`}</div>
              <div className='subscrition-card-info-price-sub'>
                {!campaignDiscount
                  ? `$${Math.round((price / data.month_count) * 100) / 100} / ${t('monthShort')}`
                  : `First month $${Math.floor(price * 100) / 100}, then $${
                      Math.round((data.price / data.month_count) * 100) / 100
                    } / ${t('monthShort')}`}
              </div>
            </>
          ) : !campaignDiscount ? (
            <div className='subscrition-card-info-price-main'>
              ${Math.round((price / data.month_count) * 100) / 100}{' '}
              <span className='subscrition-card-info-price-sub'>/ {t('monthShort')}</span>
            </div>
          ) : (
            <div className='subscrition-card-info-price-main subscrition-card-info-price-main-campaign'>
              First month ${Math.round(price * 100) / 100},<br /> then $
              {Math.round((data.price / data.month_count) * 100) / 100}{' '}
              <span className='subscrition-card-info-price-sub'>/ {t('monthShort')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SubscriptionCard
