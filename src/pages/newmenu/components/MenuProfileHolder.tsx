import { FC, useState } from 'react'
import './../_menu.scss'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { AllIcons } from '../../../helpers/allIcons'
import { useModalContext } from '../../../context/modalContext'

import ProfileImageModal from '../../../components/UI/Modal/ProfileImage/ProfileImageModal'
import ImgInCircle from '../../../components/UI/ImgInCircle/ImgInCircle'
import { getLinkedAccounts } from '../../../services/endpoints/settings'
import { IProfile } from '../../../types/interfaces/IProfile'
import { useChangeAccount } from '../../../helpers/hooks'

interface IAccountProps {
  id: number
  profileImg: string
  displayName: string
  username: string
  followerCount?: number
  friendCount?: number
  clickFn: () => void
}

const MenuProfileAccount: FC<IAccountProps> = ({
  id,
  profileImg,
  displayName,
  username,
  followerCount,
  friendCount,
  clickFn
}) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <div className='menu__profile__stats__model__account'>
      <div className='menu__profile__stats__model__img__container'>
        {profileImg ? (
          <div className='menu__profile__stats__model__img'>
            <img src={profileImg} alt={t('profilePhoto')} />
          </div>
        ) : (
          <div className='profileholder__profile__placeholder__model'>
            <img src={AllIcons.user_placeholder} alt={t('placeholder')} />
          </div>
        )}
      </div>

      <div className='menu__profile__stats__model__all__stats__container'>
        <p className='menu__profile__name menu__profile__stats__model__name'>{displayName}</p>
        <p className='menu__profile__stats__username menu__profile__stats__model__username' onClick={() => clickFn()}>
          @{username}
        </p>
        <div className='menu__profile__stats__model__num__container'>
          <p className='menu__profile__stats__num'>
            <span>{followerCount}</span> {t('Fans')}
          </p>
          <p className='menu__profile__stats__num'>
            <span>{friendCount}</span> {t('friends')}
          </p>
        </div>
      </div>
    </div>
  )
}

const MenuProfileHolder: FC<{
  id: number
  profileImg: string
  display_name: string
  role: string
  follower_count?: number
  friend_count?: number
  following_count?: number
  wallet_deposit?: number
  username: string
}> = ({
  id,
  profileImg,
  display_name,
  role,
  follower_count,
  friend_count,
  following_count,
  wallet_deposit,
  username
}) => {
  const [modelMenuOpen, setModelMenuOpen] = useState(false)

  const modalData = useModalContext()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { changeAccount } = useChangeAccount({})

  const { data, isLoading: isLoadingLinkedAccounts } = useQuery('linkedAccounts', getLinkedAccounts)

  const changeAvatar = () =>
    modalData.addModal(t('profilePhoto'), <ProfileImageModal />, undefined, undefined, 'profile__photo__modal')

  return (
    <div className='menu__profile'>
      <ImgInCircle
        id={id}
        type='profile'
        hasLoader={true}
        customClass='menu__profile__iic'
        hasCamera={true}
        cameraFn={changeAvatar}
      >
        {profileImg ? (
          <img src={profileImg} alt={t('profilePhoto')} />
        ) : (
          <div className='profileholder__profile__placeholder'>
            <img src={AllIcons.user_placeholder} alt={t('placeholder')} />
          </div>
        )}
      </ImgInCircle>
      <div className='menu__profile__info'>
        <p
          className={`menu__profile__name ${role === 'model' ? 'menu__profile__name__model' : ''}`}
          onClick={() => role === 'model' && setModelMenuOpen(!modelMenuOpen)}
        >
          {display_name}
          {role === 'model' && (
            <span
              className={`menu__profile__name__model__chevron__container ${
                modelMenuOpen && 'menu__profile__name__model__chevron__container__open'
              }`}
            >
              <img src={AllIcons.chevron_down} alt={t('icon')} />
              <img src={AllIcons.chevron_down_blue} alt={t('icon')} />
            </span>
          )}
        </p>
        <div
          className={`menu__profile__stats ${role === 'model' && 'menu__profile__stats__model'}  ${
            modelMenuOpen && 'menu__profile__stats__model_open'
          }`}
        >
          <>
            {role === 'model' ? (
              <div className='menu__profile__stats__model__list'>
                <MenuProfileAccount
                  id={id}
                  profileImg={profileImg}
                  displayName={display_name}
                  username={username}
                  followerCount={follower_count}
                  friendCount={friend_count}
                  clickFn={() => navigate(`/profile/${id}/all`)}
                />
                {data &&
                  !!data.data.length &&
                  data.data.map((profile: IProfile, idx: number) => (
                    <MenuProfileAccount
                      key={idx}
                      id={profile.id}
                      profileImg={profile.cropped_avatar?.url || profile.avatar?.url}
                      displayName={profile.display_name}
                      username={profile.username}
                      followerCount={profile.follower_count}
                      friendCount={profile.friend_count}
                      clickFn={() => changeAccount.mutate({ linked_id: profile.id })}
                    />
                  ))}
              </div>
            ) : (
              ''
            )}
            {role === 'fan' ? (
              <>
                {/* <p className="menu__profile__stats__num">
                  <span>{following_count}</span> Following
                </p> */}
                <p className='menu__profile__stats__num'>
                  {t('Balance')}:<span> ${wallet_deposit}</span>
                </p>
              </>
            ) : (
              ''
            )}
          </>
          {role === 'fan' && (
            <p className='menu__profile__stats__username' onClick={() => navigate(`/profile/${id}/all`)}>
              @{username}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default MenuProfileHolder
