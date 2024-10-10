import { FC } from 'react'
import './_whiteButton.scss'

const WhiteButton: FC<{
  text: string
  clickFn: any
  customClass?: string
}> = ({ text, clickFn, customClass }) => {
  return (
    <div className={`whitebutton ${customClass ? customClass : ''}`} onClick={clickFn}>
      {text}
    </div>
  )
}

export default WhiteButton
