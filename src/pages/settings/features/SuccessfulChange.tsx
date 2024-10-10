import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import './_successfulChange.scss'

const SuccessfulChange: FC<{
  img: string | JSX.Element | JSX.Element[]
  text: string | JSX.Element | JSX.Element[]
  header?: string
}> = ({ img, text, header }) => {
  const { t } = useTranslation()
  return (
    <div className='successfullChange'>
      {typeof img === 'string' ? <img src={img} alt='Success logo' /> : img}
      <h2>{header ?? t('success')}!</h2>
      <p>{text}</p>
    </div>
  )
}

export default SuccessfulChange
