import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ActionCard from '../../../../features/ActionCard/ActionCard'
import LayoutHeader from '../../../../features/LayoutHeader/LayoutHeader'
import WithHeaderSection from '../../../../layouts/WithHeaderSection/WithHeaderSection'

const Discovery = () => {
  const [discoveryActive, setDiscoveryActive] = useState(false)
  const { t } = useTranslation()
  return (
    <>
      <WithHeaderSection
        headerSection={<LayoutHeader type='basic' section={t('privacySecurity')} title={t('discovery')} />}
      >
        <ActionCard
          hasToggle={true}
          toggleFn={() => setDiscoveryActive(!discoveryActive)}
          toggleActive={discoveryActive}
          text={t('suggestionsOptOut')}
          subtext={<span style={{ color: '#778797' }}>{t('controlWhetherYourProfileCanBeSuggestedToOurUsers')}</span>}
          description={
            <span style={{ color: '#B0B0B0' }}>
              {t('note')}:
              <br />
              {t('thisFeatureDoesRespectGeoBlocking')}
            </span>
          }
        />
      </WithHeaderSection>
    </>
  )
}

export default Discovery
