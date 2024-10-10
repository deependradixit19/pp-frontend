import { FC } from 'react'
import './_withoutHeaderSection.scss'

const WithoutHeaderSection: FC<{
  children: any
  customClass?: string
}> = ({ children, customClass }) => {
  return (
    <div className={`wohs${customClass ? ` ${customClass}` : ''}`}>
      <div className='wohs__wrapper'>{children}</div>
    </div>
  )
}

export default WithoutHeaderSection
