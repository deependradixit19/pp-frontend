import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import style from './_message-processing.module.scss'

const MessageProcessing: FC<{ recieved?: boolean }> = ({ recieved }) => {
  const { t } = useTranslation()
  return (
    <div className={`${style.container_outer} ${recieved ? style.container_outer_recieved : ''}`}>
      <div className={`${style.container}`}>
        <div className={style.background}></div>
        <div className={style.container_inner}>
          <div className={style.loader_container}>
            <div className={style.loader}></div>
          </div>
          <div className={style.text}>{t('yourMediaIsCurrentlyProsessing')}</div>
        </div>
      </div>
    </div>
  )
}

export default MessageProcessing
