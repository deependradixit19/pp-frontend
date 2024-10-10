import { FC } from 'react'
import './_desktopAdditionalContent.scss'
import { desktopAdditionalContent } from '../../types/types'

const DesktopAdditionalContent: FC<desktopAdditionalContent> = ({ children }) => {
  return <div className='additional-content-wrapper'>{!!children && children}</div>
}

export default DesktopAdditionalContent
