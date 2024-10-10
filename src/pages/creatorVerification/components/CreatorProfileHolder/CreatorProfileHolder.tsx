import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ImgInCircle from '../../../../components/UI/ImgInCircle/ImgInCircle'
import cover_placeholder from '../../../../assets/images/home/cover_placeholder.png'
import { AllIcons } from '../../../../helpers/allIcons'
import { Icons } from '../../../../helpers/icons'
import ProfileImageModal from '../../../../components/UI/Modal/ProfileImage/ProfileImageModal'

interface Props {
  cover: string
  id: number
  avatar: string
  display_name: string
  follower_count: number
  friend_count: number
  username: string
}

const CreatorProfileHolder: FC<Props> = ({
  cover,
  id,
  avatar,
  display_name,
  follower_count,
  friend_count,
  username
}) => {
  const [avatarModalOpen, setAvatarModalOpen] = useState(false)
  const [coverModalOpen, setCoverModalOpen] = useState(false)

  const { t } = useTranslation()

  return (
    <>
      {avatarModalOpen && (
        <div
          className={`modal modal__uploadImages modal--active`}
          // onClick={(e: any) => e.target === e.currentTarget && clearModal()}
        >
          <div className={`modal__card `}>
            <div className='modal__title'>
              {t('profileImage')}
              <img
                className='modal__card__withoutTitle__close'
                onClick={() => setAvatarModalOpen(false)}
                src={Icons.close}
                alt={t('close')}
              />
            </div>
            <ProfileImageModal closeNestedModal={() => setAvatarModalOpen(false)} />
          </div>
        </div>
      )}
      {coverModalOpen && (
        <div
          className={`modal modal__uploadImages modal--active`}
          // onClick={(e: any) => e.target === e.currentTarget && clearModal()}
        >
          <div className={`modal__card `}>
            <div className='modal__title'>
              {t('coverImage')}
              <img
                className='modal__card__withoutTitle__close'
                onClick={() => setAvatarModalOpen(false)}
                src={Icons.close}
                alt={t('close')}
              />
            </div>
            <ProfileImageModal isCover={true} closeNestedModal={() => setCoverModalOpen(false)} />
          </div>
        </div>
      )}
      <div
        className='profilecover'
        style={{
          backgroundImage: `url(${cover || cover_placeholder})`
        }}
      ></div>
      <div className='profileholder profileholder__profile'>
        <ImgInCircle
          id={id}
          type='profile'
          hasLoader={true}
          hasCamera={true}
          cameraFn={() => setAvatarModalOpen(true)}
          // isLive={online}
        >
          {avatar ? (
            <img src={avatar || ''} alt={t('profileImage')} />
          ) : (
            <div className='profileholder__profile__placeholder'>
              <img src={AllIcons.user_placeholder} alt={t('placeholder')} />
            </div>
          )}
        </ImgInCircle>
        <div className='iic__camera iic__camera__cover' onClick={() => setCoverModalOpen(true)}>
          <img src={Icons.camera} alt={t('changeCover')} />
        </div>
        <div className='profileholder__info'>
          <p className={`profileholder__name`}>{display_name}</p>
          <div className='profileholder__username'>
            <p className='profileholder__username--followers'>
              <span>{follower_count}</span> {t('Fans')}
            </p>
            <div className='profileholder__username--border'></div>
            <p className='profileholder__username--friends'>
              <span>{friend_count}</span> {t('friends')}
            </p>
            <div className='profileholder__username--border'></div>
            <p className='profileholder__username--name'>@{username}</p>
          </div>
          {/* <p className="profileholder__quote">
            <img src={Icons.quotes} alt="quotes" /> One day or day one, you
            decide
          </p> */}
        </div>
      </div>
    </>
  )
}

export default CreatorProfileHolder
