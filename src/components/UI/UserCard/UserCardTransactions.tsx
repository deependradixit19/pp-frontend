import { FC } from 'react'
import './_userCard.scss'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import AvatarHolder from '../AvatarHolder/AvatarHolder'
import * as spriteIcons from '../../../assets/svg/sprite'
import { toFixedNumber } from '../../../helpers/dataTransformations'

const productToType = {
  post: 'post',
  'add deposit': 'deposit',
  'tipp model': 'tip',
  'tipp post': 'tip',
  'tipp story': 'tip',
  'tipp stream': 'tip',
  subscription: 'subscription',
  message: 'message'
}

const UserCardTransactions: FC<{
  transaction: any
}> = ({ transaction }) => {
  const { t } = useTranslation()
  return (
    <div className='userCard userCard__transactions'>
      <div className='userCard__transactions__content'>
        <div className='userCard__transactions__content--left'>
          <div className='userCard__avatar'>
            <AvatarHolder img={transaction.avatar} size='80' />
          </div>
          <div className='userCard__info'>
            <p className='userCard__info__name'>{transaction.name}</p>
            <p className='userCard__info__username'>@{transaction.username}</p>
            <p
              className={`userCard__info__type userCard__info__type__${
                productToType[transaction.product as keyof typeof productToType]
              }`}
            >
              {t(productToType[transaction.product as keyof typeof productToType])}
            </p>
          </div>
        </div>
        <div className='userCard__transactions__content--right'>
          <div className='userCard__values'>
            <div className='userCard__values__amount'>
              {transaction.error && <spriteIcons.IconProcessingError />}
              <p className='userCard__values__amount--price'>${toFixedNumber(transaction.amount, 2)}</p>
            </div>
            {transaction.error && <p className='userCard__values__amount--error'>{t('couldNotProcess')}</p>}
            <p className='userCard__values__date'>{dayjs(transaction.date).format('lll')}</p>
            <p className='userCard__values__order'>
              {t('orderId')}: {transaction.orderId}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserCardTransactions
