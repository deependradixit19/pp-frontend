import React, { FC } from 'react'
import './_switchButton.scss'

const SwitchButton: FC<{
  active: boolean | undefined
  toggle: any
  customClass?: string
  text?: string
}> = ({ active, toggle, customClass, text }) => {
  return (
    <div
      className={`switchbutton switchbutton--${active ? 'active' : 'inactive'} ${
        text ? 'switchbutton__withText' : ''
      } ${customClass ? customClass : ''}`}
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation()
        toggle()
      }}
    >
      <div className={`switchbutton__circle switchbutton__circle--${active ? 'active' : 'inactive'}`} />
      {text ? (
        <span className={`switchbutton__text switchbutton__text--${active ? 'active' : 'inactive'}`}>{text}</span>
      ) : (
        ''
      )}
    </div>
  )
}

export default SwitchButton
