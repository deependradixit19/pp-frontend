import { FC } from 'react'
import './_userCard.scss'

import { useTranslation } from 'react-i18next'
import AvatarHolder from '../AvatarHolder/AvatarHolder'
import Button from '../Buttons/Button'

const UserCardBlocked: FC<{
  user: any
}> = ({ user }) => {
  const { t } = useTranslation()
  return (
    <div className='userCard userCard--blocked'>
      <div className='userCard__avatar'>
        <AvatarHolder img={user.avatar.url} size='60' />
      </div>
      <div className='userCard__info'>
        <p className='userCard__info__name'>{user.name}</p>
        <p className='userCard__info__username'>{`@${user.username}`}</p>
      </div>
      <Button
        text={t('unblock')}
        color='transparent'
        type='transparent--black1px'
        font='mont-14-normal'
        height='3'
        width='fit'
        padding='2'
      />
    </div>
  )
}

export default UserCardBlocked
