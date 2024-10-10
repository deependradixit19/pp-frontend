import { FC } from 'react'
import './_index.scss'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import WithHeaderSection from '../../layouts/WithHeaderSection/WithHeaderSection'
import { AllIcons } from '../../helpers/allIcons'
import Button from '../../components/UI/Buttons/Button'
import { ErrorCatSVG } from '../../assets/svg/sprite'
import DesktopAdditionalContent from '../../features/DesktopAdditionalContent/DesktopAdditionalContent'

const Error404: FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <BasicLayout title={t('notFound')}>
      <WithHeaderSection withoutBorder headerSection={<div></div>}>
        <div className='errorPage--wrapper'>
          <img className='errorPage--bg' src={AllIcons.bg404} alt={t('background')} />
          <div className='errorPage'>
            <ErrorCatSVG />
            <h1 className='errorPage--h1'>404</h1>
            <h2 className='errorPage--h2'>{t('pageNotFound')}</h2>
            <p className='errorPage--p'>{t('ThePageYouAreLookingForMightHaveBeenRemoved')}</p>
            <Button
              text={t('goToHome')}
              color='black'
              font='mont-16-bold'
              width='20'
              height='5'
              clickFn={() => navigate('/')}
            />
          </div>
        </div>
      </WithHeaderSection>
      <DesktopAdditionalContent />
    </BasicLayout>
  )
}

export default Error404
