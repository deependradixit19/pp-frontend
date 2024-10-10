import { FC } from 'react'
import './_changeStateTabs.scss'

const ChangeStateTabs: FC<{
  activeTab: string
  tabs: Array<{
    name: string | JSX.Element
    value: string
  }>
  clickFn: (val: string) => void
  width: string
  customClass?: string
  hasInfoCircle?: boolean
  infoCircleData?: number
}> = ({ activeTab, tabs, clickFn, width, hasInfoCircle, infoCircleData, customClass }) => {
  return (
    <div className={`csTabs csTabs--${width} ${customClass ? customClass : ''}`}>
      {tabs.map((tab: { name: string | JSX.Element; value: string }, key: number) => (
        <div
          key={key}
          className={`csTabs__tab ${activeTab === tab.value ? 'csTabs__tab--active' : ''}`}
          onClick={() => clickFn(tab.value)}
        >
          {tab.name}
        </div>
      ))}

      {hasInfoCircle ? <div className='csTabs__infocircle'>{infoCircleData}</div> : ''}
    </div>
  )
}

export default ChangeStateTabs
