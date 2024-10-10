import { FC } from 'react'
import './_story.scss'

import { useTranslation } from 'react-i18next'
import { Icons } from '../../../helpers/icons'

const Story: FC<{
  img?: string
  text: string
  viewed?: boolean
  type: string
}> = ({ img, text, viewed, type }) => {
  const { t } = useTranslation()
  if (type === 'story') {
    return (
      <div className='story story--img'>
        <div className={`story__circle ${viewed ? 'story__circle--viewed' : ''}`}>
          <img src={img} alt={t('storyImg')} />
        </div>
        <p className='story__text'>{text}</p>
      </div>
    )
  } else {
    return (
      <div className='story'>
        <div className='story__circle story__add'>
          <img src={Icons.plus} alt={t('addStory')} />
        </div>
        <p className='story__text'>{text}</p>
      </div>
    )
  }
}

export default Story
