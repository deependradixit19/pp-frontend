import { FC } from 'react'

const Basic: FC<{
  section?: string
  title?: string
}> = ({ section, title }) => {
  return (
    <>
      <h2 className='layoutHeader__section'>{section}</h2>
      <h1 className='layoutHeader__title'>{title}</h1>
    </>
  )
}

export default Basic
