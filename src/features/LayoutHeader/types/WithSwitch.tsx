import { FC } from 'react'
import SwitchButton from '../../../components/Common/SwitchButton/SwitchButton'

const WithCheckbox: FC<{
  section?: string
  title?: string
  switchActive?: boolean
  switchFn?: any
}> = ({ section, title, switchActive, switchFn }) => {
  return (
    <>
      <h2 className='layoutHeader__section'>{section}</h2>
      <h1 className='layoutHeader__title'>
        {title}
        <SwitchButton active={switchActive} toggle={switchFn} />
      </h1>
    </>
  )
}

export default WithCheckbox
