import { FC, useState } from 'react'
import './_userCard.scss'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import AvatarHolder from '../AvatarHolder/AvatarHolder'
import * as spriteIcons from '../../../assets/svg/sprite'

const UserCardEarnings: FC<{
  user: any
  earningsCardType: string
  userCardSubType: string
  hasDropDown?: boolean
  dropDownContent?: JSX.Element | JSX.Element[]
  customIconClass?: string
  iconSize?: string
  created?: string
  earnings?: number
}> = ({
  user,
  earningsCardType,
  userCardSubType,
  hasDropDown,
  dropDownContent,
  customIconClass,
  iconSize,
  created,
  earnings
}) => {
  const [dropDownOpen, setDropDownOpen] = useState(false)
  const { t } = useTranslation()
  const renderBadge = () => {
    const badgeTypeFn = () => {
      if (earningsCardType === t('subscription')) {
        return 'typeBadge--blue'
      } else if (earningsCardType.includes('tipp')) {
        return 'typeBadge--green'
      } else if (earningsCardType === t('processing')) {
        return 'typeBadge--blue'
      } else if (earningsCardType === t('paid')) {
        return 'typeBadge--green'
      } else if (earningsCardType === t('post')) {
        return 'typeBadge--yellow'
      } else if (earningsCardType === t('message')) {
        return 'typeBadge--pink'
      }
    }
    const badgeTextFn = () => {
      if (earningsCardType.includes('tipp')) {
        return t('tip')
      }
      return earningsCardType
    }
    return (
      <div className={`typeBadge ${badgeTypeFn()}`}>
        <span>{badgeTextFn()}</span>
      </div>
    )
  }

  return (
    <div className='userCard userCard--earnings'>
      <div className='userCard--earnings--content'>
        <div className='userCard__avatar'>
          <AvatarHolder img={user.avatar.url} size={iconSize || '80'} customClass={customIconClass || ''} />
        </div>
        {userCardSubType === 'sale' ? (
          <div className='userCard__info'>
            <p className='userCard__info__name'>{user.name}</p>
            {renderBadge()}
          </div>
        ) : (
          ''
        )}
        {userCardSubType === 'payout' ? (
          <div className='userCard__info'>
            <p className='userCard__info__name'>
              <span>{t('invoice')}</span> #456712
            </p>
            {renderBadge()}
          </div>
        ) : (
          ''
        )}
        <div className='earnings'>
          <p className='earnings--money'>${earnings}</p>

          <p className='earnings--date'>{dayjs(created).format('MMM DD, YYYY hh:mm A')}</p>
        </div>
        {hasDropDown && (
          <button
            className={`earnings-dropdown-button ${dropDownOpen && 'earnings-dropdown-button-open'}`}
            onClick={() => setDropDownOpen(!dropDownOpen)}
          >
            <div className='earnings-dropdown-button-icon'>
              <spriteIcons.IconDownChevron />
            </div>
          </button>
        )}
      </div>

      {hasDropDown && (
        <div className={`earnings-dropdown ${dropDownOpen && 'earnings-dropdown-open'}`}>
          {dropDownContent ? dropDownContent : t('noContent')}
        </div>
      )}
    </div>
  )
}

export default UserCardEarnings
