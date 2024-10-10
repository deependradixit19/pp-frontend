import { FC, useState, useRef } from 'react'
import '../_howTo.scss'
import { useTranslation } from 'react-i18next'
import { Icons } from '../../../helpers/icons'

const SubAccordion: FC<{
  items: any
}> = ({ items }) => {
  const [subAccActive, setSubAccActive] = useState<boolean>(false)

  const subAccRef = useRef<HTMLDivElement>(null)
  const subAccToggleRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  return (
    <div
      className='faq__subaccordion'
      ref={subAccRef}
      style={{
        height: subAccActive
          ? `calc(${subAccRef.current?.scrollHeight}px + 1rem)`
          : `calc(${subAccToggleRef.current?.scrollHeight}px)`
      }}
    >
      <div ref={subAccToggleRef} className='faq__subaccordion__head' onClick={() => setSubAccActive(!subAccActive)}>
        <p className={`${subAccActive ? 'faq__subaccordion__title--active' : ''}`}>{Object.keys(items)[0]}</p>
        <div
          className={`faq__subaccordion__head__arrow faq__subaccordion__head__arrow--${
            subAccActive ? 'active' : 'inactive'
          }`}
        >
          <img src={Icons.chevronRight} alt={t('accordionIcon')} />
        </div>
      </div>
      <div className='faq__subaccordion__body'>
        {items[Object.keys(items)[0]].map((item: string, key: number) => (
          <div key={key} className='faq__subaccordion__item'>
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SubAccordion
