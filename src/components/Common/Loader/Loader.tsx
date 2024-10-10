import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import './_loader.scss'

const Loader: FC = () => {
  const { t } = useTranslation()

  return (
    <div className='localLoader'>
      <div className='loader'>{t('loading')}...</div>
    </div>
  )
}

export default Loader
