import { FC, useEffect, useRef, useState } from 'react'
import './_footer.scss'
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom'
import { useQueryClient, UseQueryResult } from 'react-query'
import { useTranslation } from 'react-i18next'
import { AllIcons } from '../../helpers/allIcons'
import { useUserContext } from '../../context/userContext'
import avatarPlaceholder from '../../assets/images/user_placeholder.png'
import VerifyNav from '../../components/UI/VerifyNav/VerifyNav'
import { getProfileGroups } from '../../services/endpoints/social'
import { useGetUnreadData } from '../../helpers/apiHooks'
import FooterPopup from './FooterPopup'
import { IconGoLive } from '../../assets/svg/sprite'

const Footer: FC<{
  verifyNavOpen?: boolean
  setVerifyNavOpen?: (velue: boolean) => void
}> = ({ verifyNavOpen = false, setVerifyNavOpen }) => {
  const [postPopupActive, setPostPopupActive] = useState<boolean>(false)
  const userData = useUserContext()
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const prefetchCategories = async () => {
    await queryClient.prefetchQuery('allGroups', getProfileGroups)
  }

  const { id } = useParams<{ id?: string }>()
  const { t } = useTranslation()
  const refButton = useRef<HTMLDivElement>(null)
  const { data, error }: UseQueryResult<{ [key: string]: number }> = useGetUnreadData(!!userData.id)

  return (
    <div className='footer__wrapper'>
      <footer className='footer'>
        {postPopupActive && (
          <FooterPopup
            postPopupActive={postPopupActive}
            setPostPopupActive={setPostPopupActive}
            refButton={refButton}
          />
        )}

        <Link className='footer__link' to={userData?.role === 'model' ? `/profile/${userData.id}/all` : '/'}>
          <img
            src={
              (userData?.role === 'model' && location.pathname === `/profile/${userData.id}/all`) ||
              (userData?.role !== 'model' && location.pathname === '/')
                ? AllIcons.footer_home_active
                : AllIcons.footer_home
            }
            alt={t('home')}
          />
        </Link>
        {userData?.role === 'model' ? (
          <Link className='footer__link' to='/notifications'>
            {data?.notifications ? <div className='footer__link__status'>{data?.notifications}</div> : ''}
            <img
              src={
                ['/notifications', '/notifications/fans', '/notifications/site'].includes(location.pathname)
                  ? AllIcons.footer_notifications_active
                  : AllIcons.footer_notifications
              }
              alt={t('notifications')}
            />
          </Link>
        ) : (
          <Link className='footer__link' to='/media'>
            <img
              src={location.pathname === '/media' ? AllIcons.footer_media_active : AllIcons.footer_media}
              alt={t('media')}
            />
          </Link>
        )}
        {userData?.role === 'model' ? (
          <div
            onMouseOver={() => prefetchCategories()}
            className={`footer__link footer__link--addpost${postPopupActive ? ' footer__link--addpost--active' : ''}`}
            ref={refButton}
            onClick={() => {
              setPostPopupActive(!postPopupActive)
            }}
          >
            <img src={AllIcons.footer_addpost} alt='Add post' />
          </div>
        ) : (
          <Link className='footer__link' to='/subscriptions'>
            <img
              src={
                location.pathname.includes('/subscriptions') ? AllIcons.footer_search_active : AllIcons.footer_search
              }
              alt={t('Fans')}
            />
          </Link>
        )}
        <Link className='footer__link' to='/messages/inbox'>
          {data && data.messages > 0 && <div className='footer__link__status'>{data?.messages}</div>}
          <img
            src={location.pathname.includes('/messages') ? AllIcons.footer_chat_active : AllIcons.footer_chat}
            alt={t('chat')}
          />
        </Link>
        {/* <Link className="footer__link" to="/menu">
        <img
          className="footer__link--avatar"
          src={
            userData.cropped_avatar.url ||
            userData.avatar.url ||
            avatarPlaceholder
          }
          alt="Profile"
        />
      </Link> */}
        <div
          className='profile__menu'
          //  onClick={() => setMenuOpen(!menuOpen)}
          onClick={() => navigate('/menu')}
        >
          <img
            className='footer__link--avatar'
            src={userData.cropped_avatar?.url || userData.avatar?.url || avatarPlaceholder}
            alt={t('profile')}
          />
        </div>
      </footer>
      <VerifyNav active={verifyNavOpen} setActive={setVerifyNavOpen} />
    </div>
  )
}

export default Footer
