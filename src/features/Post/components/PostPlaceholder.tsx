import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { AllIcons } from '../../../helpers/allIcons'
import Button from '../../../components/UI/Buttons/Button'

interface Props {
  btnFn: () => void
  btnText: string
  user: any
}

const PostPlaceholder: FC<Props> = ({ btnFn, btnText, user }) => {
  const { t } = useTranslation()
  return (
    <div className='post__placeholder__mom gradient'>
      <img src={AllIcons.post_lock_outline_dark} alt='Post locked' />
      <Button
        text={btnText}
        color='black'
        font='mont-14-bold'
        height='3'
        width='fit'
        padding='2'
        customClass='post__placeholder__mom__button'
        clickFn={() => btnFn()}
      />
      <p className='post__placeholder__mom__text'>
        {t('toSee')}{' '}
        <span>
          {user?.username}
          {t('s')}
        </span>
        {t('posts')}
      </p>
      <div className='post__placeholder__mom__info'>
        <div className='info__box'>
          <div className='info__box--top'>{user?.photo_count || 0}</div>
          <div className='info__box--bottom'>{t('photos')}</div>
        </div>
        <div className='info__box central'>
          <div className='info__box--top'>{user?.premium_video_count || 0}</div>
          <div className='info__box--bottom'>{t('premium')}</div>
        </div>
        <div className='info__box'>
          <div className='info__box--top'>{user?.video_count || 0}</div>
          <div className='info__box--bottom'>{t('videos')}</div>
        </div>
      </div>
    </div>
  )
}

export default PostPlaceholder
