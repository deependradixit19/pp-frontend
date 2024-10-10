import { FC } from 'react'
import './_radioButton.scss'

const RadioButton: FC<{
  active: any
  clickFn?: any
  customClass?: string
}> = ({ active, clickFn, customClass }) => {
  return (
    <div
      className={`radiobutton ${customClass ? customClass : ''}`}
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        clickFn && e.stopPropagation()
        clickFn && clickFn()
      }}
    >
      <div className={`radiobutton__inner ${active ? 'radiobutton__inner--active' : ''}`} />
    </div>
  )
}

export default RadioButton
