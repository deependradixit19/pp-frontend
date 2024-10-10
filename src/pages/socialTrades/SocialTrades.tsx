import { FC } from 'react'
import './_socialTrades.scss'

import { useTranslation } from 'react-i18next'
import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import Browse from './view/Browse'

const SocialTrades: FC = () => {
  const { t } = useTranslation()
  return (
    <BasicLayout title={t('socialTrades')} customContentClass='socialTrades__content__wrapper'>
      <Browse />
    </BasicLayout>
  )
}

export default SocialTrades
