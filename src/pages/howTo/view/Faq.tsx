import { FC, useState } from 'react'
import './../_howTo.scss'
import { t } from 'i18next'
import { useTranslation } from 'react-i18next'
import Accordion from '../components/Accordion'
import { Icons } from '../../../helpers/icons'

const Faq: FC = () => {
  const [filteredTabs, setFilteredTabs] = useState<string>('all')

  const faqTabs = ['all', 'payments', 'tips', 'subscriptions']

  const { t } = useTranslation()

  const accordionLinks = ['item1', 'item2', { subs: ['item1.1', 'item1.2', 'item1.3'] }, 'item4', 'item5', 'item6']

  return (
    <div>
      <div className='faq__tabs'>
        {faqTabs.map((tab: string, key: number) => (
          <div
            key={key}
            className={`faq__tabs__tab ${filteredTabs === tab ? 'faq__tabs__tab--active' : ''}`}
            onClick={() => setFilteredTabs(tab)}
          >
            {t(tab)}
          </div>
        ))}
      </div>
      <div className='faq__accordions'>
        <Accordion title={t('generalQuestions')} icon={Icons.payment_bank} links={accordionLinks} />
      </div>
    </div>
  )
}

export default Faq
