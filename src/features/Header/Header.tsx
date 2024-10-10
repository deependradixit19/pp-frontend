import { FC } from 'react'
import './_header.scss'
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom'
import { header } from '../../types/types'

import NavigationBar from '../../components/UI/NavigationBar/NavigationBar'
import logo1 from '../../assets/images/home/logo1.svg'
import SidebarSuggestions from '../SidebarSuggestions/SidebarSuggestions'
const Header: FC<header> = ({ title, headerNav, linkBack, hideBackButton, rightElement }) => {
  const navigate = useNavigate()
  const params = useParams()
  const location = useLocation()

  const goToPrevStep = () => {
    let link = location.pathname.split('?')[0]
    const fromMenu = [
      '/creators',
      '/earnings',
      '/analytics',
      '/schedule',
      '/fans',
      '/friends',
      '/vault',
      '/media_categories',
      '/media',
      '/settings',
      '/referrals',
      '/transactions',
      'how-to'
    ]
    const keys = Object.keys(params)

    for (let i = 0; i < keys.length; i++) {
      const param = params[keys[i] as keyof typeof params]
      link = link.replace(`/${param}`, '')
    }

    if (fromMenu.includes(link)) {
      navigate('/menu')
      return
    }

    navigate(-1)
  }

  return (
    <header className={`header ${headerNav ? 'header--withnav' : 'header--withoutnav'}`}>
      {' '}
      <div className='logo-container'>
        <Link to={``}>
          <img src={logo1} alt='logo' className='logo-img'></img>
          <span className='logo-text'>Performer</span>
        </Link>
      </div>
      <div className='header--content'>
        {!hideBackButton && (
          <div
            onClick={() => {
              linkBack ? linkBack() : goToPrevStep()
            }}
            className='header__linkback'
          />
        )}
        <h1 className='header__title'>{title}</h1>
        {headerNav ? <NavigationBar navArr={headerNav} customClass='header' type='dark' /> : ''}
        {rightElement && <div className='header__right'>{rightElement}</div>}
      </div>
      <SidebarSuggestions />
    </header>
  )
}

export default Header
