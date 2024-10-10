import { FC } from 'react'
import { useParams } from 'react-router-dom'
import './_fans.scss'
import { useTranslation } from 'react-i18next'
import FansHome from './components/FansHome'
import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import FansCustomGroup from './components/FansCustomGroup'
import DesktopAdditionalContent from '../../features/DesktopAdditionalContent/DesktopAdditionalContent'

const Fans: FC<{ displayPage: string }> = ({ displayPage }) => {
  const { id } = useParams<any>()
  const { t } = useTranslation()

  const renderpages = () => {
    switch (displayPage) {
      case 'home':
        return <FansHome />
      default:
        return <FansCustomGroup name={id} />
    }
  }
  return (
    <BasicLayout customClass='fans-basic-layout' title={t('Fans')}>
      {renderpages()}
      <DesktopAdditionalContent />
    </BasicLayout>
  )
}

export default Fans
