import { FC } from 'react'
import './_autoplayToggle.scss'
import { IconPlayFill } from '../../../assets/svg/sprite'
const AutoplayToggle: FC<{ active: boolean; clickFn: () => void }> = ({ active = false, clickFn }) => {
  return (
    <div className={`autoplayToggle ${active ? 'active' : ''}`} onClick={clickFn}>
      <div className={`autoplayToggle__thumb`}>
        <IconPlayFill color={active ? '#46A7FA' : `#333741`} />
      </div>
    </div>
  )
}

export default AutoplayToggle
