import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import ImgInCircle from '../../../components/UI/ImgInCircle/ImgInCircle'
import { AllIcons } from '../../../helpers/allIcons'

interface Props {
  className: string
  [k: string]: any
}

const TrashDrop = forwardRef<HTMLDivElement, Props>(({ className, ...props }, ref) => {
  const { t } = useTranslation()
  return (
    <div {...props} className={`trash__drop ${className}`} ref={ref}>
      <span className='trash__drop__text'>{t('dragToDelete')}</span>
      <ImgInCircle type='login' customClass={`trash__drop__circle`}>
        <img src={AllIcons.post_delete} alt='Trash bin' />
      </ImgInCircle>
    </div>
  )
})

export default TrashDrop
