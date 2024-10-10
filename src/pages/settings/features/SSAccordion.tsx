import { FC, useRef } from 'react'
import './_ssAccordion.scss'
import RadioButton from '../../../components/Common/RadioButton/RadioButton'

const SSAccordion: FC<{
  expanded: boolean
  customExpandClass?: boolean
  head: JSX.Element
  customClass?: string
  items: Array<{
    text: string
    active: boolean
    toggle: () => void
  }>
}> = ({ expanded, head, items, customClass = '', customExpandClass }) => {
  const accordionRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className={`ssAccordion ${customClass}`}
      style={{
        height: !customExpandClass
          ? expanded
            ? `calc(${accordionRef.current?.scrollHeight}px)`
            : `calc(${toggleRef.current?.scrollHeight}px)`
          : 'auto'
      }}
      ref={accordionRef}
    >
      <div className={`ssAccordion__head${expanded ? ' ssAccordion__head--expanded' : ''}`} ref={toggleRef}>
        {head}
      </div>
      <div className='ssAccordion__body'>
        {items.map((item: { text: string; active: boolean; toggle: () => void }, key: number) => (
          <div className='ssAccordion__item' onClick={item.toggle} key={key}>
            <span>{item.text}</span>
            <RadioButton active={item.active} clickFn={item.toggle} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SSAccordion
