import { FC } from 'react'
import './_analytics.scss'
import { Navigate, useParams } from 'react-router-dom'
import { t } from 'i18next'
import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import Reports from './views/Reports'
import Sales from './views/Sales'
import Content from './views/Content'
import DesktopAdditionalContent from '../../features/DesktopAdditionalContent/DesktopAdditionalContent'

const Analytics: FC = () => {
  const { id } = useParams<{ id: string }>()

  const renderPage = () => {
    if (id === 'sales') {
      return <Sales />
    } else if (id === 'reports') {
      return <Reports />
    } else if (id === 'content') {
      return <Content />
    } else {
      return <Navigate to='/analytics/sales' />
    }
  }

  return (
    <BasicLayout title={t('analytics')} headerNav={['/analytics/sales', '/analytics/reports', '/analytics/content']}>
      {renderPage()}
      <DesktopAdditionalContent />
    </BasicLayout>
  )
}

export default Analytics
