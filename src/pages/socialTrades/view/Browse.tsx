import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AllIcons } from '../../../helpers/allIcons'

import WithHeaderSection from '../../../layouts/WithHeaderSection/WithHeaderSection'
import LayoutHeader from '../../../features/LayoutHeader/LayoutHeader'
import ChangeStateTabs from '../../../components/UI/ChangeStateTabs/ChangeStateTabs'
import ModelCard from '../../../components/UI/ModelCard/ModelCard'

const Browse: FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [activeTab, setActiveTab] = useState<string>('incoming')

  const { t } = useTranslation()

  return (
    <WithHeaderSection
      headerSection={
        <LayoutHeader
          type='title-with-buttons'
          titleWithIcon={
            <div className='socialTrades__title'>
              <img src={AllIcons.social_trade} alt={t('socialTrade')} />
              <p>
                {t('browse')} <b>{t('influencers')}</b>
              </p>
            </div>
          }
          buttons={[
            {
              type: 'cta',
              icon: AllIcons.button_settings
            },
            {
              type: 'cta',
              icon: AllIcons.button_repeat
            }
          ]}
        />
      }
    >
      <div className='socialTrades__browse'>
        <LayoutHeader
          type='search-with-buttons'
          searchValue={searchTerm}
          searchFn={(val: string) => setSearchTerm(val)}
          clearFn={() => setSearchTerm('')}
          additionalProps={{ placeholder: t('searchInfluencers') }}
          buttons={[
            {
              type: 'cta',
              icon: AllIcons.button_repeat
            }
          ]}
        />

        <ChangeStateTabs
          activeTab={activeTab}
          tabs={[
            {
              name: t('incoming'),
              value: 'incoming'
            },
            {
              name: t('outgoing'),
              value: 'outgoing'
            }
          ]}
          clickFn={(val: string) => setActiveTab(val)}
          width='fit'
        />

        <ModelCard type='social' twitterStats={2000} isNew={true} />

        <ModelCard type='social' hasButtons={true} />
      </div>
    </WithHeaderSection>
  )
}

export default Browse
