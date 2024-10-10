import { FC } from 'react'
import './_userCard.scss'
import { useTranslation } from 'react-i18next'
import dayjs, { Dayjs } from 'dayjs'
import AvatarHolder from '../AvatarHolder/AvatarHolder'
import Button from '../Buttons/Button'
import { toFixedNumber } from '../../../helpers/dataTransformations'

const UserCardPayouts: FC<{
  avatarUrl: string
  invoiceNmbr: number
  amount: number
  date: string | Date | Dayjs
  earningsCardType: string
  customIconClass?: string
  iconSize?: string
}> = ({ avatarUrl, invoiceNmbr, amount, date, earningsCardType, customIconClass, iconSize }) => {
  const { t } = useTranslation()
  const buttonDetails = () => {
    const buttonTypeFn = () => {
      if (earningsCardType === 'processing') {
        return 'transparent--lightblue'
      } else if (earningsCardType === 'paid') {
        return 'transparent--cyan'
      } else if (earningsCardType === 'failed') {
        return 'transparent--dark1px'
      }
    }
    return (
      <Button
        text={t(earningsCardType) || ''}
        color='transparent'
        type={buttonTypeFn()}
        font='mont-11-normal'
        height='2'
        width='fit'
        padding='1'
      />
    )
  }

  return (
    <div className='userCard userCard--earnings'>
      <div className='userCard--earnings--content'>
        <div className='userCard__avatar'>
          <AvatarHolder img={avatarUrl} size={iconSize || '60'} customClass={customIconClass || ''} />
        </div>
        <div className='userCard__info__column'>
          <div className='userCard__info earnings userCard__info__row'>
            <p className='userCard__info__name'>
              <span>{t('invoice')}</span> #{invoiceNmbr}
            </p>
            <p className='earnings--money'>${toFixedNumber(amount, 2)}</p>
          </div>
          <div className='earnings userCard__info userCard__info__row'>
            {buttonDetails()}
            <p className='earnings--date'>{dayjs(date).format('lll')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserCardPayouts
