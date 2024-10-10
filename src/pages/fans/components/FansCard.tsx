import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import bg from '../../../assets/images/home/bg6.png'

const FansCard: FC<{
  title: string
  people?: number
  posts?: number
  avatars?: any
  customClass?: string
}> = ({ title, people, posts, avatars, customClass }) => {
  const { t } = useTranslation()
  return (
    <div className={`fans__card ${customClass ? customClass : ''}`}>
      <div className='fans__card__left'>
        <p className='fans__card__title'>{title}</p>
        <p className='fans__card__stats'>
          {people} {t('people')} {posts ? <span className='fans__card__stats__dot'></span> : ''}{' '}
          {posts ? `${posts} ${t('posts')}` : ''}
        </p>
      </div>
      <div className='fans__card__right'>
        <div className='fans__card__avatar'>
          <img className='fans__card__avatar__img' src={bg} alt={t('profileAvatar')} />
        </div>
        <div className='fans__card__avatar'>
          <img className='fans__card__avatar__img' src={bg} alt={t('profileAvatar')} />
        </div>
        <div className='fans__card__avatar'>
          <img className='fans__card__avatar__img' src={bg} alt={t('profileAvatar')} />
        </div>
      </div>
    </div>
  )
}

export default FansCard
