import { FC } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'

import { isDefined } from '../../../helpers/util'

import './_button.scss'

const Button: FC<{
  text: string | JSX.Element
  color: 'blue' | 'black' | 'grey' | 'dark-grey' | 'white' | 'green' | 'transparent'
  type?:
    | 'transparent--white'
    | 'transparent--dark'
    | 'transparent--black'
    | 'transparent--borderless'
    | 'transparent--blue'
    | 'transparent--black1px'
    | 'transparent--dark1px'
    | 'transparent--lightblue'
    | 'transparent--cyan'
    | 'transparent--login'
  font?:
    | 'mont-10-semi-bold'
    | 'mont-11-normal'
    | 'mont-14-normal'
    | 'mont-14-bold'
    | 'mont-14-semi-bold'
    | 'mont-16-bold'
    | 'mont-16-semi-bold'
    | 'mont-18-semi-bold'
    | 'mont-18-bold'
    | 'sf-16-normal'
  width?: '100' | '20' | '16' | '15' | '14' | '13' | '12' | '11' | '10' | '7' | '6' | 'fit' | 'max-fit'
  height?: '2' | '3' | '4' | '5' | '6'
  padding?: '05' | '1' | '15' | '1-15' | '2' | '3' | '4' | '5'
  disabled?: boolean
  clickFn?: (e?: Event) => void
  icon?: string
  prevIcon?: JSX.Element
  afterIcon?: JSX.Element
  hasCircleIcon?: boolean
  circleIcon?: string
  circleIconBg?: string
  customClass?: string
}> = ({
  text,
  color,
  type,
  font,
  width,
  height,
  padding,
  disabled,
  clickFn,
  icon,
  prevIcon,
  afterIcon,
  hasCircleIcon,
  circleIcon,
  circleIconBg,
  customClass
}) => {
  const classNames = cx({
    button: true,
    [`button--${color}`]: isDefined(color),
    [`button--${font}`]: isDefined(font),
    [`button--width-${width}`]: isDefined(width),
    [`button--height-${height}`]: isDefined(height),
    [`button--padding-${padding}`]: isDefined(padding),
    [`button--${type}`]: isDefined(type),
    [`button--disabled`]: disabled,
    [`${customClass}`]: isDefined(customClass)
  })

  const { t } = useTranslation()

  return (
    <div
      className={classNames}
      onClick={e => {
        e.stopPropagation()
        if (!disabled) {
          clickFn && clickFn()
        }
      }}
    >
      {hasCircleIcon ? (
        <div className={`button__circleicon button__circleicon--${circleIconBg}`}>
          <img src={circleIcon} alt={t('icon')} />
        </div>
      ) : (
        ''
      )}

      {icon ? <img className='button__icon' src={icon} alt={t('icon')} /> : ''}

      {prevIcon && <div className='button__icon--prev'>{prevIcon}</div>}
      {text}
      {afterIcon && <div className='button__icon--next'>{afterIcon}</div>}
    </div>
  )
}

export default Button
