import { ElementType, FC } from 'react'
import { Link } from 'react-router-dom'

import '../_notificationToast.scss'

interface Props {
  text?: string
  linkText: string
  linkUrl: string
  icon?: ElementType
}

const TextWithIcon: FC<Props> = ({ text, linkText, linkUrl, icon: Icon }) => {
  return (
    <div className='textWithIcon'>
      <div className='textWithIcon__link'>
        {text && text}
        <Link to={linkUrl}>{linkText}</Link>
      </div>
      {Icon && (
        <div className='textWithIcon__icon'>
          <Icon />
        </div>
      )}
    </div>
  )
}

export default TextWithIcon
