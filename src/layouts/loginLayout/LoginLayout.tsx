import React, { FC } from 'react'
import './_loginLayout.scss'
import { useLocation } from 'react-router-dom'

import { useTranslation } from 'react-i18next'
import ImgInCircle from '../../components/UI/ImgInCircle/ImgInCircle'

import logo1 from '../../assets/images/home/logo1.svg'
// import logo2 from "../../assets/images/sun.svg";

interface ILoginLayoutProps {
  bgImg: string
  logo?: string
  children: React.ReactNode
}

const LoginLayout: FC<ILoginLayoutProps> = ({ children, bgImg, logo = logo1 }) => {
  const location = useLocation()

  const isForm = (): boolean => {
    return (
      location.pathname === '/auth/signup/fan' ||
      location.pathname === '/auth/signup/model' ||
      location.pathname === '/auth/login/fan' ||
      location.pathname === '/auth/login/model' ||
      location.pathname === '/auth/recover/model'
    )
  }

  const { t } = useTranslation()

  return (
    <div className='ll'>
      <div className='ll__cover' style={{ backgroundImage: `url(${bgImg})` }}>
        {/* <button onClick={() => document.body.classList.toggle("dark-theme")}>
          <img style={{ width: "2rem" }} src={logo2} alt="switch theme" />
        </button> */}
      </div>
      <div className={`ll__body ${isForm() ? 'll__body--form' : ''}`}>
        <ImgInCircle type='login' customClass={`ll__logos__circle ${isForm() ? 'll__logos__circle--form' : ''}`}>
          <img src={logo} alt={t('logo')} />
        </ImgInCircle>
        <div className='ll__body__children'>{children}</div>
      </div>
    </div>
  )
}

export default LoginLayout
