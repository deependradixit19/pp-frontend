import { FC } from 'react'
import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'

import { Carousel } from 'react-responsive-carousel'
import Button from '../../../components/UI/Buttons/Button'
import LoginLayout from '../../../layouts/loginLayout/LoginLayout'

import 'react-responsive-carousel/lib/styles/carousel.min.css'

import bg from '../../../assets/images/home/bg1.png'

const NotLogged: FC = () => {
  const { t } = useTranslation()
  return (
    <LoginLayout bgImg={bg}>
      <div className='auth__nl'>
        <h1 className='auth__nl__title'>
          <span>{t('master')}</span> {t('studio')}
        </h1>
        <div className='auth__nl__slider'>
          <Carousel
            className='auth__nl__carousel'
            axis='horizontal'
            autoPlay={false}
            showArrows={false}
            showStatus={false}
            showThumbs={false}
            infiniteLoop={true}
          >
            {[
              <Trans i18nKey='multilineBrowseAList'>
                Browse a list of shows
                <br />
                happening tonight,
                <br /> tomorrow and the next day.
              </Trans>,
              <Trans i18nKey='multilineBrowseAList'>
                Browse a list of shows
                <br />
                happening tonight,
                <br /> tomorrow and the next day.
              </Trans>,
              <Trans i18nKey='multilineBrowseAList'>
                Browse a list of shows
                <br />
                happening tonight,
                <br /> tomorrow and the next day.
              </Trans>
            ].map((item: string | JSX.Element, ind: number) => (
              <div key={ind} className='auth__nl__carousel__item'>
                {item}
              </div>
            ))}
          </Carousel>
        </div>
        <div className='auth__nl__links'>
          <Link to='/auth/signup'>
            <Button text={t('signup')} color='blue' font='mont-18-semi-bold' width='100' height='6' />
          </Link>
          <Link to='/auth/login'>
            <Button
              text={t('login')}
              color='transparent'
              type='transparent--dark'
              font='mont-18-semi-bold'
              width='100'
              height='6'
            />
          </Link>
        </div>
      </div>
    </LoginLayout>
  )
}

export default NotLogged
