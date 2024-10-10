import { FC } from 'react'
import { IconCaretMd } from '../../../assets/svg/sprite'
import { AllIcons } from '../../../helpers/allIcons'
import './_flashingArrow.scss'

interface Props {
  side: string
  clickFn?: () => void
  color?: string
}

const FlashingArrow: FC<Props> = ({ clickFn, side, color }) => {
  return (
    <div className={`arrows__wrapper ${side} `} onClick={() => clickFn && clickFn()}>
      <div className='arrow__flashing first'>
        <IconCaretMd color={color} />
      </div>
      <div className='arrow__flashing second'>
        <IconCaretMd color={color} />
      </div>
      <div className='arrow__flashing third'>
        <IconCaretMd color={color} />
      </div>
      {/* <img
        className="arrow__flashing first"
        src={AllIcons.chevron_right}
        alt="arrows"
      />
      <img
        className="arrow__flashing second"
        src={AllIcons.chevron_right}
        alt="arrows"
      />
      <img
        className="arrow__flashing third"
        src={AllIcons.chevron_right}
        alt="arrows"
      /> */}
    </div>
  )
}

export default FlashingArrow
