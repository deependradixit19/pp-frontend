import { FC, useState } from 'react'
import './_howTo.scss'
import { useParams, Navigate } from 'react-router-dom'

import { useTranslation } from 'react-i18next'
import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import WithHeaderSection from '../../layouts/WithHeaderSection/WithHeaderSection'

import Tutorials from './view/Tutorials'
import Faq from './view/Faq'
import SingleFaq from './pages/SingleFaq'
import SearchField from '../../components/Form/SearchField/SearchField'
import Dropdown from '../../components/UI/Dropdown/Dropdown'
import { Icons } from '../../helpers/icons'
import DesktopAdditionalContent from '../../features/DesktopAdditionalContent/DesktopAdditionalContent'

const HowTo: FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')

  const { id, page } = useParams<{ id: string; page: string }>()
  const { t } = useTranslation()

  const renderPage = () => {
    switch (page) {
      case 'fan-questions':
        return <SingleFaq page={page} />
    }

    switch (id) {
      case 'tutorials':
        return <Tutorials />

      case 'faq':
        return <Faq />

      default:
        return <Navigate to={'/404'} />
    }
  }

  const renderHeader = () => {
    switch (id) {
      case 'tutorials':
        return (
          <>
            <h2 className='howTo__section'>{t('tutorials')}</h2>
            <div className='howTo__searchfield'>
              <SearchField
                value={searchTerm}
                clearFn={() => setSearchTerm('')}
                changeFn={(term: string) => setSearchTerm(term)}
                additionalProps={{ placeholder: t('searchTutorials') }}
              />
              <Dropdown
                head={
                  <div className='howTo__section__filter'>
                    <img src={Icons.filterWhite} alt={t('filter')} />
                  </div>
                }
                title={t('filter')}
                elements={[]}
                apply={(val: string) => console.log(val)}
                type='radio'
              />
            </div>
          </>
        )

      case 'faq':
        return (
          <>
            <h2 className='howTo__section'>{t('faq')}</h2>
            <div className='howTo__searchfield'>
              <SearchField
                value={searchTerm}
                changeFn={(term: string) => setSearchTerm(term)}
                clearFn={() => setSearchTerm('')}
                additionalProps={{ placeholder: t('searchQuestions') }}
              />
            </div>
          </>
        )

      default:
        return <Navigate to={'/404'} />
    }
  }

  return (
    <BasicLayout title={t('howTo')} headerNav={['/how-to/tutorials', '/how-to/faq']}>
      <WithHeaderSection headerSection={renderHeader()}>{renderPage()}</WithHeaderSection>
      <DesktopAdditionalContent />
    </BasicLayout>
  )
}

export default HowTo
