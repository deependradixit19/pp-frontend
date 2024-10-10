import { FC, useState } from 'react'
import { useQuery } from 'react-query'
import './_priceModal.scss'
import { useTranslation } from 'react-i18next'
import { useModalContext } from '../../../../context/modalContext'
import Button from '../../Buttons/Button'
import { getMinPrices } from '../../../../services/endpoints/api_global'
import { addToast } from '../../../Common/Toast/Toast'

const PriceModal: FC<{
  updatePrice: (val: number | string) => void
}> = ({ updatePrice }) => {
  const [price, setPrice] = useState<number | string>('')

  const modalData = useModalContext()
  const { t } = useTranslation()

  const { data, isLoading } = useQuery('min-max-prices', getMinPrices)

  return (
    <div className='priceModal'>
      <div className='priceModal__info'>
        {!isLoading ? (
          <p>
            {t('minimum')} <b>${data?.min_premium_video_price} USD</b>{' '}
          </p>
        ) : (
          'Loading...'
        )}
      </div>
      <div className='priceModal__body'>
        <div className='priceModal__input'>
          <input
            type='number'
            value={price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPrice(e.currentTarget.value ? parseInt(e.currentTarget.value) : '')
            }
          />
          <div className='priceModal--dollar'>$</div>
        </div>

        <Button
          text={t('save')}
          color='blue'
          font='mont-14-normal'
          width='13'
          height='3'
          customClass='priceModal__button'
          disabled={isLoading}
          clickFn={() => {
            if (!isLoading && data) {
              if (price < data.min_premium_video_price) {
                addToast('error', `${t('minPriceIs')} $${data.min_premium_video_price}`)
                return
              }
              if (price > data.max_premium_video_price) {
                addToast('error', `${t('maxPriceIs')} $${data.max_premium_video_price}`)
                return
              }

              updatePrice(price)
              modalData.clearModal()
            }
          }}
        />
      </div>
    </div>
  )
}

export default PriceModal
