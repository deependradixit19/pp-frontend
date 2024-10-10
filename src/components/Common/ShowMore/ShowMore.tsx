import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import ShowMoreText from 'react-show-more-text'
import { IPostTag } from '../../../types/interfaces/ITypes'
import './_showMore.scss'
import { renderPostText } from '../../../helpers/postHelpers'
import { usePreviewContext } from '../../../context/previewContext'

interface Props {
  userId?: number
  customClass?: string
  name: string
  time: string
  tags: string[]
  text: string
  mentions: IPostTag[]
}

const ShowMore: FC<Props> = ({
  userId,
  customClass,
  name,
  time,
  // tags,
  text,
  mentions
}) => {
  const [expanded, setExpanded] = useState<boolean>(false)
  const { t } = useTranslation()
  const handleOnClick = () => {
    setExpanded(expanded => !expanded)
  }
  const { clearModal } = usePreviewContext()
  // const tagLine = tags.join(' ');

  return (
    <div className={`showMore showMore--${customClass ? customClass : ''}`}>
      <div className={`showMore__wrapper`}>
        <div className='showMore__title'>
          <Link to={`/profile/${userId}/all`} className='showMore__title--name' onClick={() => clearModal()}>
            @{name}
          </Link>
          <div className='showMore__title--time'>{time}</div>
        </div>
        <ShowMoreText
          /* Default options */
          lines={3}
          more={<p>...{t('showMore')}</p>}
          less={<p>...{t('showLess')}</p>}
          className={`content-css`}
          anchorClass='my-anchor-css-class'
          onClick={handleOnClick}
          expanded={expanded}
          truncatedEndingComponent={``}
          keepNewLines={false}
        >
          <p>{renderPostText(text, mentions)}</p>
          {/* <p>{tagLine}</p> */}
        </ShowMoreText>
      </div>
    </div>
  )
}

export default ShowMore
