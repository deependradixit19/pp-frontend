import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { AllIcons } from '../../../helpers/allIcons'

import './_verifyNav.scss'

interface Props {
  active: boolean
  setActive?: (value: boolean) => void
}
const VerifyNav: FC<Props> = ({ active, setActive }) => {
  const { t } = useTranslation()
  return (
    <div className={`verify ${active ? 'active' : ''}`}>
      <div className='verify__wrapper'>
        <div className='left__side--wrapper'>
          <img src={AllIcons.shield} alt='guard_logo' />
          <div className='verify__text'>
            <Link to='#'>{t('completeAccountSetup')}</Link>
            <p>{t('verifyYourAccountToGetPosting')}</p>
          </div>
        </div>
        <div className='arrows__wrapper' onClick={() => setActive && setActive(false)}>
          <img className='arrow__flashing first' src={AllIcons.chevron_right} alt='arrows' />
          <img className='arrow__flashing second' src={AllIcons.chevron_right} alt='arrows' />
          <img className='arrow__flashing third' src={AllIcons.chevron_right} alt='arrows' />
        </div>
      </div>
    </div>
  )
}

export default VerifyNav
