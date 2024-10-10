import { FC } from 'react'
import './_withHeaderSection.scss'

const WithHeaderSection: FC<{
  headerSection: JSX.Element
  children: any
  customClass?: string
  withoutBorder?: boolean
}> = ({ headerSection, children, customClass, withoutBorder }) => {
  return (
    <div className={`whs${customClass ? ` ${customClass}` : ''}`}>
      <div className='whs__wrapper'>
        <div className={`whs__header ${withoutBorder ? 'whs__header--withoutborder' : ''}`}>{headerSection}</div>
        {children}
      </div>
    </div>
  )
}

export default WithHeaderSection
