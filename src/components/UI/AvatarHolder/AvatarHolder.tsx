import { FC } from 'react'
import './_avatarHolder.scss'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Icons } from '../../../helpers/icons'

// import bg1 from "../../../assets/images/home/bg1.png";
import avatarPlaceholder from '../../../assets/images/user_placeholder.png'

interface AvatarHolderProps {
  userId?: number
  img: string
  size: string
  customClass?: string
  isOnline?: boolean
  isLive?: boolean
  hasHeart?: boolean
  hasDollar?: boolean
  hasDiamond?: boolean
  hasStory?: boolean
  storyRead?: boolean
}

const AvatarHolder: FC<AvatarHolderProps> = ({
  userId,
  img,
  size,
  customClass,
  isOnline,
  isLive,
  hasHeart,
  hasDollar,
  hasDiamond,
  hasStory,
  storyRead
}) => {
  const { t } = useTranslation()
  return (
    <div
      className={`avatarholder ${
        hasStory ? (storyRead ? 'avatarholder__story--read' : 'avatarholder__story--unread') : ''
      } avatarholder--${size} ${customClass ? customClass : ' '}`}
    >
      {/* {hasStory ? (
        <div className="avatarholder__story">
          <div
            className={
              storyRead
                ? "avatarholder__story--read"
                : "avatarholder__story--unread"
            }
          />
        </div>
      ) : (
        ""
      )} */}
      {isOnline ? <div className='avatarholder__online' /> : ''}
      {isLive ? <div className='avatarholder__live'>{t('live')}</div> : ''}

      {userId ? (
        <Link to={`/profile/${userId}/all`}>
          <img src={img || avatarPlaceholder} alt='Avatar' />
        </Link>
      ) : (
        <img src={img || avatarPlaceholder} alt='Avatar' />
      )}
      {hasHeart || hasDollar || hasDiamond ? (
        <div className='avatarholder__blueicon'>
          {hasHeart && <img className='avatarholder__blueicon--heart' src={Icons.avatar_heart} alt={t('heart')} />}
          {hasDollar && <img className='avatarholder__blueicon--dollar' src={Icons.avatar_dollar} alt={t('dollar')} />}
          {hasDiamond && (
            <img className='avatarholder__blueicon--diamond' src={Icons.avatar_diamond} alt={t('diamond')} />
          )}
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default AvatarHolder
