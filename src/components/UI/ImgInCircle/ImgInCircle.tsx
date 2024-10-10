import React, { FC } from 'react'
import './_imgInCircle.scss'
import { useTranslation } from 'react-i18next'
import { Icons } from '../../../helpers/icons'
import { useUserContext } from '../../../context/userContext'

const ImgInCircle: FC<{
  type: string
  id?: number
  customClass?: string
  children: React.ReactNode
  hasLoader?: boolean
  clickFn?: () => void
  hasCamera?: boolean
  cameraFn?: () => void
  isLive?: boolean
}> = ({ type, id, customClass, children, hasLoader, clickFn, hasCamera, cameraFn, isLive }) => {
  const userData = useUserContext()
  const { t } = useTranslation()
  return (
    <div className={`iic iic--${type}${customClass ? ` ${customClass}` : ''}`} onClick={clickFn}>
      <div className={`iic--${type}__container`}>
        {hasLoader && (
          <>
            <div className='iic__loader'></div>
            <div className='iic__loader--top'></div>
            <div className='iic__loader--left'></div>
          </>
        )}
        {children}
        {hasCamera && id === userData.id ? (
          <div className='iic__camera' onClick={cameraFn}>
            <img src={Icons.camera} alt={t('changeProfilePic')} />
          </div>
        ) : (
          ''
        )}
        {id !== userData.id && isLive ? <div className='iic__live'>{t('live')}</div> : ''}
      </div>
    </div>
  )
}

export default ImgInCircle
