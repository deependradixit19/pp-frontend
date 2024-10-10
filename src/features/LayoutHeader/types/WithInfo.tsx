import { FC } from 'react'
import { AllIcons } from '../../../helpers/allIcons'

const WithInfo: FC<{
  info?: string
  section?: string
  title?: string
}> = ({ info, section, title }) => {
  return (
    <>
      <h2 className='layoutHeader__section'>{section}</h2>
      <h1 className='layoutHeader__title'>
        {title}
        <img src={AllIcons.info} alt='Info' />
      </h1>
    </>
  )
}

export default WithInfo
