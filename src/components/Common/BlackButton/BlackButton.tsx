import { FC } from 'react'
import './_blackButton.scss'

const BlackButton: FC<{
  text: string
  clickFn: any
  customClass?: string
}> = ({ text, clickFn, customClass }) => {
  return (
    <div className={`blackbutton ${customClass ? customClass : ''}`} onClick={clickFn}>
      {text}
    </div>
  )
}

export default BlackButton
