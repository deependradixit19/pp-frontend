import { FC } from 'react'
import './_userMenu.scss'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getAccessToken } from '../../../services/storage/storage'
import { logoutUser } from '../../../services/endpoints/auth'

import { Icons } from '../../../helpers/icons'

interface Props {}

const UserMenu: FC<Props> = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const logout = () => logoutUser(navigate)

  return (
    <div className={`nav`}>
      <div className='user__menu'>
        {getAccessToken() ? (
          <>
            <button className='user__menu__button' onClick={logout}>
              <img src={Icons.back} alt={t('logout')} />
              {t('logout')}
            </button>
            <button className='user__menu__button' onClick={() => navigate('/settings/general')}>
              <img src={Icons.settings} alt={t('settings')} />
              {t('settings')}
            </button>
            <button className='user__menu__button' onClick={() => navigate('/menu')}>
              <img src={Icons.feed} alt={t('menu')} />
              {t('menu')}
            </button>
            <button className='user__menu__button' onClick={() => navigate('/fans/active')}>
              <img src={Icons.avatar} alt={t('Fans')} />
              {t('Fans')}
            </button>
            <button className='user__menu__button' onClick={() => navigate('/how-to/tutorials')}>
              <img src={Icons.support} alt={t('howTo')} />
              {t('howTo')}
            </button>
            {/* <button
              className="user__menu__button"
              onClick={() => {
                userData.role === "model"
                  ? navigate("/profile/15/posts")
                  : navigate("/profile/15/all");
              }}
            >
              <img src={Icons.avatar} alt="Check profile" />
              Check another profile
            </button> */}
          </>
        ) : (
          <button className='user__menu__button' onClick={() => navigate('/auth')}>
            <img style={{ transform: 'rotate(180deg)' }} src={Icons.back} alt={t('auth')} />
            {t('auth')}
          </button>
        )}
      </div>
    </div>
  )
}

export default UserMenu
