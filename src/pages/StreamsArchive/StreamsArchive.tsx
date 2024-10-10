import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { date } from 'yup'

import { IconFilterOutline, IconPlus, IconShareCircles, IconSortAsc } from '../../assets/svg/sprite'
import IconButton from '../../components/UI/Buttons/IconButton'
import NewStream from '../../components/UI/Modal/NewStream/NewStream'
import { useModalContext } from '../../context/modalContext'
import DropDownSelect from '../../features/DropdownSelectNew/DropDownSelect'
import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import WithHeaderSection from '../../layouts/WithHeaderSection/WithHeaderSection'
import StreamsArchiveCard from './StreamArchiveCard/StreamsArchiveCard'

import styles from './StreamsArchive.module.scss'

export default function StreamsArchive() {
  const [search, setSearch] = useState<string>('')
  const [selectedOption, setSelectedOption] = useState<string>('')

  const { t } = useTranslation()
  const modalData = useModalContext()

  const options = [
    { value: 'post', label: t('scheduleOptionsPosts') },
    { value: 'premium', label: t('scheduleOptionsPremium') },
    { value: 'message', label: t('scheduleOptionsMessages') },
    { value: 'story', label: t('scheduleOptionsStories') },
    { value: 'live', label: t('scheduleOptionsStreams') }
  ]

  const openNewStreamModal = () => {
    modalData.addModal('Schedule', <NewStream date={new Date()} />, false)
  }

  return (
    <div>
      <BasicLayout title={t('liveStreams')}>
        <WithHeaderSection
          headerSection={
            <div
              style={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <div style={{ marginRight: '5px' }}>
                <DropDownSelect
                  icon={
                    <div className='analytics-dropdown-icon'>
                      <IconShareCircles />
                    </div>
                  }
                  placeholder={t('allShares')}
                  options={options}
                  search={search}
                  setSearch={setSearch}
                  selectedOption={selectedOption}
                  setSelectedOption={setSelectedOption}
                />
              </div>
              <div style={{ marginRight: '5px' }}>
                <IconButton icon={<IconSortAsc color='white' />} type={'black'} />
              </div>
              <div style={{ marginRight: '5px' }}>
                <IconButton icon={<IconFilterOutline color='white' />} type={'black'} />
              </div>
              <IconButton icon={<IconPlus />} type={'white'} clickFn={() => openNewStreamModal()} />
            </div>
          }
          customClass='stream-archive-whs'
        >
          <div className={styles.container}>
            <StreamsArchiveCard
              streamInfo={{
                image:
                  'https://images.pexels.com/photos/14353715/pexels-photo-14353715.jpeg?cs=srgb&dl=pexels-matteo-milan-14353715.jpg&fm=jpg&_gl=1*14ytfdy*_ga*NTY4NjcyOTAzLjE2NTQ2ODE2NzM.*_ga_8JE65Q40S6*MTY2ODU0ODA5OS45LjEuMTY2ODU0ODExMy4wLjAuMA..',
                duration: new Date(),
                date: new Date(),
                profit: 255
              }}
            />
            <StreamsArchiveCard
              streamInfo={{
                image:
                  'https://images.pexels.com/photos/14353715/pexels-photo-14353715.jpeg?cs=srgb&dl=pexels-matteo-milan-14353715.jpg&fm=jpg&_gl=1*14ytfdy*_ga*NTY4NjcyOTAzLjE2NTQ2ODE2NzM.*_ga_8JE65Q40S6*MTY2ODU0ODA5OS45LjEuMTY2ODU0ODExMy4wLjAuMA..',
                duration: new Date(),
                date: new Date(),
                profit: 255
              }}
            />
            <StreamsArchiveCard
              streamInfo={{
                image:
                  'https://images.pexels.com/photos/14353715/pexels-photo-14353715.jpeg?cs=srgb&dl=pexels-matteo-milan-14353715.jpg&fm=jpg&_gl=1*14ytfdy*_ga*NTY4NjcyOTAzLjE2NTQ2ODE2NzM.*_ga_8JE65Q40S6*MTY2ODU0ODA5OS45LjEuMTY2ODU0ODExMy4wLjAuMA..',
                duration: new Date(),
                date: new Date(),
                profit: 255
              }}
            />
            <StreamsArchiveCard
              streamInfo={{
                image:
                  'https://images.pexels.com/photos/14353715/pexels-photo-14353715.jpeg?cs=srgb&dl=pexels-matteo-milan-14353715.jpg&fm=jpg&_gl=1*14ytfdy*_ga*NTY4NjcyOTAzLjE2NTQ2ODE2NzM.*_ga_8JE65Q40S6*MTY2ODU0ODA5OS45LjEuMTY2ODU0ODExMy4wLjAuMA..',
                duration: new Date(),
                date: new Date(),
                profit: 255
              }}
            />
            <StreamsArchiveCard
              streamInfo={{
                image:
                  'https://images.pexels.com/photos/14353715/pexels-photo-14353715.jpeg?cs=srgb&dl=pexels-matteo-milan-14353715.jpg&fm=jpg&_gl=1*14ytfdy*_ga*NTY4NjcyOTAzLjE2NTQ2ODE2NzM.*_ga_8JE65Q40S6*MTY2ODU0ODA5OS45LjEuMTY2ODU0ODExMy4wLjAuMA..',
                duration: new Date(),
                date: new Date(),
                profit: 255
              }}
            />
            <StreamsArchiveCard
              streamInfo={{
                image:
                  'https://images.pexels.com/photos/14353715/pexels-photo-14353715.jpeg?cs=srgb&dl=pexels-matteo-milan-14353715.jpg&fm=jpg&_gl=1*14ytfdy*_ga*NTY4NjcyOTAzLjE2NTQ2ODE2NzM.*_ga_8JE65Q40S6*MTY2ODU0ODA5OS45LjEuMTY2ODU0ODExMy4wLjAuMA..',
                duration: new Date(),
                date: new Date(),
                profit: 255
              }}
            />
            <StreamsArchiveCard
              streamInfo={{
                image:
                  'https://images.pexels.com/photos/14353715/pexels-photo-14353715.jpeg?cs=srgb&dl=pexels-matteo-milan-14353715.jpg&fm=jpg&_gl=1*14ytfdy*_ga*NTY4NjcyOTAzLjE2NTQ2ODE2NzM.*_ga_8JE65Q40S6*MTY2ODU0ODA5OS45LjEuMTY2ODU0ODExMy4wLjAuMA..',
                duration: new Date(),
                date: new Date(),
                profit: 255
              }}
            />
            <StreamsArchiveCard
              streamInfo={{
                image:
                  'https://images.pexels.com/photos/14353715/pexels-photo-14353715.jpeg?cs=srgb&dl=pexels-matteo-milan-14353715.jpg&fm=jpg&_gl=1*14ytfdy*_ga*NTY4NjcyOTAzLjE2NTQ2ODE2NzM.*_ga_8JE65Q40S6*MTY2ODU0ODA5OS45LjEuMTY2ODU0ODExMy4wLjAuMA..',
                duration: new Date(),
                date: new Date(),
                profit: 255
              }}
            />
            <StreamsArchiveCard
              streamInfo={{
                image:
                  'https://images.pexels.com/photos/14353715/pexels-photo-14353715.jpeg?cs=srgb&dl=pexels-matteo-milan-14353715.jpg&fm=jpg&_gl=1*14ytfdy*_ga*NTY4NjcyOTAzLjE2NTQ2ODE2NzM.*_ga_8JE65Q40S6*MTY2ODU0ODA5OS45LjEuMTY2ODU0ODExMy4wLjAuMA..',
                duration: new Date(),
                date: new Date(),
                profit: 255
              }}
            />
            <StreamsArchiveCard
              streamInfo={{
                image:
                  'https://images.pexels.com/photos/14353715/pexels-photo-14353715.jpeg?cs=srgb&dl=pexels-matteo-milan-14353715.jpg&fm=jpg&_gl=1*14ytfdy*_ga*NTY4NjcyOTAzLjE2NTQ2ODE2NzM.*_ga_8JE65Q40S6*MTY2ODU0ODA5OS45LjEuMTY2ODU0ODExMy4wLjAuMA..',
                duration: new Date(),
                date: new Date(),
                profit: 255
              }}
            />
            <StreamsArchiveCard
              streamInfo={{
                image:
                  'https://images.pexels.com/photos/14353715/pexels-photo-14353715.jpeg?cs=srgb&dl=pexels-matteo-milan-14353715.jpg&fm=jpg&_gl=1*14ytfdy*_ga*NTY4NjcyOTAzLjE2NTQ2ODE2NzM.*_ga_8JE65Q40S6*MTY2ODU0ODA5OS45LjEuMTY2ODU0ODExMy4wLjAuMA..',
                duration: new Date(),
                date: new Date(),
                profit: 255
              }}
            />
            <StreamsArchiveCard
              streamInfo={{
                image:
                  'https://images.pexels.com/photos/14353715/pexels-photo-14353715.jpeg?cs=srgb&dl=pexels-matteo-milan-14353715.jpg&fm=jpg&_gl=1*14ytfdy*_ga*NTY4NjcyOTAzLjE2NTQ2ODE2NzM.*_ga_8JE65Q40S6*MTY2ODU0ODA5OS45LjEuMTY2ODU0ODExMy4wLjAuMA..',
                duration: new Date(),
                date: new Date(),
                profit: 255
              }}
            />
          </div>
        </WithHeaderSection>
      </BasicLayout>
    </div>
  )
}
