import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import cover_placeholder from '../../../../../assets/images/home/cover_placeholder.png'

const ProfileCover: FC<{
  cover: string | null
  photo_count: number | undefined
  premium_video_count: number | undefined
  video_count: number | undefined
  hideCount: boolean | undefined
}> = ({ cover, photo_count, premium_video_count, video_count, hideCount }) => {
  const { t } = useTranslation()
  return (
    <div
      className='profilecover'
      style={{
        backgroundImage: `url(${cover || cover_placeholder})`
      }}
    >
      {!hideCount && (
        <div className='profilecover__stats'>
          <div className='profilecover__stats--block'>
            <div className='profilecover__stats--value'>{photo_count}</div>
            <span>{t('posts')}</span>
          </div>
          <div className='profilecover__stats--block profilecover__stats--block--premium'>
            <div className='profilecover__stats--value'>{premium_video_count}</div>
            <span>{t('Premium')}</span>
          </div>
          <div className='profilecover__stats--block'>
            <div className='profilecover__stats--value'>{video_count}</div>
            <span>{t('videos')}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileCover
