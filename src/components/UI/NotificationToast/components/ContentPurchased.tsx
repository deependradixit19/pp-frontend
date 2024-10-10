import { FC } from 'react'
import { Link } from 'react-router-dom'

import '../_notificationToast.scss'

interface Props {
  text?: string
  linkText: string
  linkUrl: string
  price?: string
}

const ContentPurchased: FC<Props> = ({ text, linkText, linkUrl, price }) => {
  return (
    <div className='contentPurchased'>
      <div className='contentPurchased__link'>
        {text && text}
        <Link to={linkUrl}>
          {linkText} {price}
        </Link>
      </div>
      {/* {text && <div className="contentPurchased__text">{text} </div>}
      {linkText && (
        <div className="contentPurchased__link">
          <Link to={linkUrl}>
            {linkText} {price}
          </Link>
        </div>
      )} */}
    </div>
  )
}

export default ContentPurchased
