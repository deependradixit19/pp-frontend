import { FC } from 'react'
import './_tutorialCard.scss'
import { use } from 'i18next'
import { useTranslation } from 'react-i18next'
import { Icons } from '../../../helpers/icons'

const TutorialCard: FC<{
  img: string
  title: string
  text: string
  hasVideo?: boolean
}> = ({ img, title, text, hasVideo }) => {
  const { t } = useTranslation()
  return (
    <div className='tutorialCard'>
      <div className='tutorialCard__image' style={{ backgroundImage: `url(${img})` }}>
        {hasVideo ? (
          <div className='tutorialCard__image__playbtn'>
            <div className='tutorialCard__image__playbtn__bg'>
              <img src={Icons.play} alt={t('play')} />
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
      <div className='tutorialCard__info'>
        <h2 className='tutorialCard__info__title'>{title}</h2>
        <p className='tutorialCard__info__text'>{text}</p>
      </div>
    </div>
  )
}

export default TutorialCard
