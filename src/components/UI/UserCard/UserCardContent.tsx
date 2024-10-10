import { FC, useState } from 'react'
import './_userCard.scss'
import { useTranslation } from 'react-i18next'
import AvatarHolder from '../AvatarHolder/AvatarHolder'
import * as spriteIcons from '../../../assets/svg/sprite'

const UserCardContent: FC<{
  user: any
  cardContent: JSX.Element | JSX.Element[]
  hasDropDown?: boolean
  dropDownContent?: JSX.Element | JSX.Element[]
  customIconClass?: string
  iconSize?: string
}> = ({ user, cardContent, hasDropDown, dropDownContent, customIconClass, iconSize }) => {
  const [dropDownOpen, setDropDownOpen] = useState(false)

  const { t } = useTranslation()

  return (
    <div className='userCard userCard--earnings'>
      <div className='userCard--earnings--content'>
        <div className='userCard__avatar'>
          <AvatarHolder img={user.avatar.url} size={iconSize || '60'} customClass={customIconClass || ''} />
        </div>
        {cardContent}
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

export default UserCardContent
