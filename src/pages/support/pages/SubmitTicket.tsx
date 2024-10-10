import { FC, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LinkTabs from '../../../components/UI/LinkTabs/LinkTabs'
import LayoutHeader from '../../../features/LayoutHeader/LayoutHeader'
import WithHeaderSection from '../../../layouts/WithHeaderSection/WithHeaderSection'
import * as Icons from '../../../assets/svg/sprite'
import ActionCard from '../../../features/ActionCard/ActionCard'
import Button from '../../../components/UI/Buttons/Button'

const SubmitTicket: FC = () => {
  const { t } = useTranslation()
  const defaultActiveFilter = t('openTickets')

  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState(defaultActiveFilter)
  return (
    <div>
      <WithHeaderSection
        headerSection={
          <LayoutHeader
            type='search-with-buttons'
            searchValue={searchTerm}
            searchFn={(term: string) => setSearchTerm(term)}
            clearFn={() => setSearchTerm('')}
            additionalProps={{ placeholder: t('searchTickets') }}
            buttons={[]}
          />
        }
      >
        <div>
          <LinkTabs route='/support' filters={[t('openTickets'), t('closedTickets')]} activeFilter={activeFilter} />
        </div>
        <Link to='/support/create-a-ticket' className='submit__ticket__iconPlus'>
          {<Icons.IconPlus color='#fff' />}
        </Link>
        <ActionCard
          text={
            <span>
              {t('accountProblems')}
              <span className='submit__ticket__new'>{t('new')}</span>
            </span>
          }
          subtext={
            <span className='submit__ticket__date'>
              <span className='submit__ticket__date--created'>{t('created')} </span>
              Nov 21, 2021
            </span>
          }
          link='#'
          icon={<Icons.IconNoteOutline />}
          hasTrash={true}
          hasArrow={true}
          bottomArea={
            <div className='submit__ticket__bottomArea'>
              <p className='submit__ticket__bottomArea--p'>
                Nulla sed nulla fermentum, euismod dolor ac, gravida ante. Vestibulum laoreet mauris eu pretium iaculis.{' '}
              </p>
              <div className='submit__ticket__bottomArea--borderLine'></div>
              <div className='submit__ticket__bottomArea--bottom'>
                <div className='submit__ticket__bottomArea--bottom--left'>
                  <div className='submit__ticket__bottomArea--bottom--left--attachIcon'>
                    {<Icons.IconAttach />}
                    <span>2</span>
                  </div>
                  <div className='submit__ticket__bottomArea--bottom--left--chatIcon'>
                    {<Icons.IconChatSmall />}
                    <span>4</span>
                  </div>
                </div>
                <div className='submit__ticket__bottomArea--bottom--right'>
                  <p className='submit__ticket__bottomArea--bottom--right--tickedId'>
                    <span>{t('ticket')} </span>#4567-2345
                  </p>
                  {/* FIXME: It shouldn't be a button (cause it's not interactive, it's just a label) */}
                  <Button
                    text={t('open')}
                    font='mont-10-semi-bold'
                    color='green'
                    width='fit'
                    height='2'
                    customClass='submit__ticket__bottomArea--bottom--right--button'
                  />
                </div>
              </div>
            </div>
          }
          customClass='submit__ticket__actionCard'
        />
      </WithHeaderSection>
    </div>
  )
}

export default SubmitTicket
