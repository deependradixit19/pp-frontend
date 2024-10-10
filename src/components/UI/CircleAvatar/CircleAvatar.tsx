import { FC } from 'react'
import './_circleAvatar.scss'
import { useTranslation } from 'react-i18next'
import placeholderAvatar from '../../../assets/images/user_placeholder.png'

interface Props {
  imgUrl?: string
}

const CircleAvatar: FC<Props> = ({ imgUrl }) => {
  const { t } = useTranslation()
  return (
    <div className='circleAvatar'>
      <div className='circleAvatar__inner'>
        <img src={imgUrl ? imgUrl : placeholderAvatar} alt={t('avatarImage')} />
      </div>
      <span></span>
      <span></span>
    </div>
  )
}

export default CircleAvatar
