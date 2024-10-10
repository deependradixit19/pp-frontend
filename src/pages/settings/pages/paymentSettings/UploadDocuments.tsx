import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import WithHeaderSection from '../../../../layouts/WithHeaderSection/WithHeaderSection'
import LayoutHeader from '../../../../features/LayoutHeader/LayoutHeader'

import DocumentUploadCard from '../../../../features/DocumentUploadCard/DocumentUploadCard'
import { useUserContext } from '../../../../context/userContext'

const UploadDocuments: FC = () => {
  const { t } = useTranslation()
  const userData = useUserContext()

  const usaDocs = [
    {
      type: 'w9',
      title: t('W9Form')
    }
  ] as const

  const foreignDocs = [
    {
      type: 'w8ben',
      title: t('W8BENForm')
    }
    // {
    //   type: 'w8bene',
    //   title: t('W8BENEForm'),
    // }
  ] as const

  const documents = useMemo(() => {
    // if (!userData?.country) {
    return [...usaDocs, ...foreignDocs]
    // }

    // return userData.country === 'US' ? usaDocs : foreignDocs;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.country])

  return (
    <WithHeaderSection
      headerSection={<LayoutHeader type='basic' section={t('settings:payoutSettings')} title={t('uploadDocuments')} />}
    >
      {documents.map(doc => {
        return <DocumentUploadCard key={doc.type} type={doc.type} title={doc.title} />
      })}
    </WithHeaderSection>
  )
}

export default UploadDocuments
