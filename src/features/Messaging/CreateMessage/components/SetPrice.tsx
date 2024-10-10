import React, { FC, useState } from 'react'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import { IMessage } from '../../../../types/interfaces/IMessage'
import Button from '../../../../components/UI/Buttons/Button'
import { IProgressInfo } from '../../../../types/interfaces/ITypes'
import { getMinPrices } from '../../../../services/endpoints/api_global'
import { addToast } from '../../../../components/Common/Toast/Toast'

const SetPrice: FC<{
  message: IMessage
  setMessage: (message: IMessage) => void
  setPriceModalActive: (val: boolean) => void
  progressInfos: { val: IProgressInfo[] }
  setProgressInfos: any
}> = ({ message, setMessage, setPriceModalActive, progressInfos, setProgressInfos }) => {
  const [tempPrice, setTempPrice] = useState<string>('')

  const { t } = useTranslation()

  const { data, isLoading } = useQuery('min-max-prices', getMinPrices)

  return (
    <div className='directmessage__price'>
      {/* <div
        className="directmessage__price__files"
        onClick={() => setPriceModalActive(false)}
      >
        {message.previewMedia.map((item: string, i: number) => (
          <img src={item} key={i} alt="Preview uploaded files" />
        ))}
      </div> */}
      <div className='directmessage__price__info'>
        <p>
          {!isLoading ? (
            <>
              {t('minimum')} <b>${data.min_message_price} USD</b> {t('or')} {t('free')}, {t('maximum')} $
              {data.max_message_price} USD
            </>
          ) : (
            'Loading...'
          )}
        </p>
        <div className='directmessage__price__actions'>
          <div className='directmessage__price__actions--input'>
            <input
              type='number'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempPrice(e.currentTarget.value)}
              value={tempPrice}
            />
          </div>
          <Button
            text={t('save')}
            color='blue'
            font='mont-16-bold'
            width='12'
            height='5'
            clickFn={() => {
              if (parseFloat(tempPrice) < parseFloat(data.min_message_price)) {
                addToast('error', `${t('minPriceIs')} $${data.min_message_price}`)
                return
              }
              if (parseFloat(tempPrice) > parseFloat(data.max_message_price)) {
                addToast('error', `${t('maxPriceIs')} $${data.max_message_price}`)
                return
              }
              const tmpInfo = progressInfos.val.map(info => {
                return { ...info, locked: true }
              })
              setProgressInfos({ val: tmpInfo })
              setMessage({ ...message, price: parseFloat(tempPrice) })
              setPriceModalActive(false)
            }}
            disabled={isLoading || !tempPrice}
          />
        </div>
      </div>
    </div>
  )
}

export default SetPrice
