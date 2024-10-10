import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import './_sidebarSuggestions.scss'
import { AllIcons } from '../../helpers/allIcons'
import { useUserContext } from '../../context/userContext'
import * as spriteIcons from '../../assets/svg/sprite'
import avatarPlaceholder from '../../assets/images/user_placeholder.png'
function SidebarSuggestions() {
  const { t } = useTranslation()
  const userData = useUserContext()
  const navigate = useNavigate()

  return (
    <>
      <div className='header-right'>
        <Link
          className={``}
          to={{
            pathname: '/messages/inbox'
          }}
        >
          <img src={AllIcons.chat_bubble} alt={t('message')} className='header-icon' width='24px' height='24px' />
        </Link>
        <Link
          className={``}
          to={{
            pathname: '/notifications'
          }}
        >
          <img
            src={AllIcons.footer_notifications}
            alt={t('notifications')}
            className='header-icon'
            width='24px'
            height='24px'
          />
        </Link>
        <div className='profile__menu' onClick={() => navigate('/menu')}>
          <img
            className='header-avatar'
            src={userData.cropped_avatar?.url || userData.avatar?.url || avatarPlaceholder}
            alt={t('profile')}
          />
        </div>
        <span className='dropdown-button'>
          <spriteIcons.IconDownChevron />
        </span>
      </div>
    </>
  )
}

export default SidebarSuggestions
