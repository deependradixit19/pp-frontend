import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import WithoutHeaderSection from '../../layouts/WithoutHeaderSection/WithoutHeaderSection'

const AccountSetup: FC = () => {
  const { t } = useTranslation()
  return (
    <BasicLayout title={t('accountSetup')}>
      <WithoutHeaderSection>Account setup page in progress...</WithoutHeaderSection>
    </BasicLayout>
  )
}

export default AccountSetup
