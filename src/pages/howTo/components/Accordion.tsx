import { FC, useState, useRef } from 'react'
import '../_howTo.scss'
import { useTranslation } from 'react-i18next'
import { Icons } from '../../../helpers/icons'

import SubAccordion from './SubAccordion'

const Accordion: FC<{
  icon?: string
  title: string
  links: any
}> = ({ icon, title, links }) => {
  const [accordionActive, setAccordionActive] = useState<boolean>(false)

  const accordionRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  const renderAccordionItem = (item: any, key: number) => {
    switch (typeof item) {
      case 'string':
        return (
          <div className='faq__accordion__item' key={key}>
            It's a string
          </div>
        )

      case 'object':
        return <SubAccordion items={item} />
    }
  }

  return (
    <div
      className={`faq__accordion ${accordionActive ? 'faq__accordion--active' : ''}`}
      ref={accordionRef}
      style={{
        height: accordionActive
          ? `calc(${accordionRef.current?.scrollHeight}px + 1rem)`
          : `calc(${toggleRef.current?.scrollHeight}px)`
      }}
    >
      <div ref={toggleRef} className='faq__accordion__head' onClick={() => setAccordionActive(!accordionActive)}>
        {icon ? (
          <div className='faq__accordion__head__icon'>
            <img src={icon} alt={t('accordionIcon')} />
          </div>
        ) : (
          ''
        )}
        <div className='faq__accordion__head__title'>{title}</div>
        <div
          className={`faq__accordion__head__arrow faq__accordion__head__arrow--${
            accordionActive ? 'active' : 'inactive'
          }`}
        >
          <img src={Icons.chevronRight} alt={t('accordionIcon')} />
        </div>
      </div>
      <div className={`faq__accordion__body faq__accordion__body--${accordionActive ? 'active' : 'inactive'}`}>
        {links.map((link: any, key: number) => {
          return renderAccordionItem(link, key)
        })}
      </div>
    </div>
  )
}

export default Accordion
