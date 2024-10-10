import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Button from '../../../../components/UI/Buttons/Button'

interface Props {}
const EmptyFeedPost: FC<Props> = ({}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <>
      <div className='post-tags-wrapper'>
        <div className={`post__files__file post__files__file--empty`}>
          <div className='post__cta'>
            {/* <div className="post__cta__icon">
              <IconPremiumPostLockedOutline />
            </div> */}
            <p className='post__cta__text'>{t('clickHereToBrowseOurCreators')}</p>
            <Button
              text='Browse Creators'
              color='black'
              font='mont-14-bold'
              height='3'
              width='max-fit'
              padding='2'
              customClass='post__cta__button'
              clickFn={() => navigate('/creators')}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default EmptyFeedPost
