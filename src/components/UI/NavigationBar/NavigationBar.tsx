import { FC } from 'react'
import './_navigationBar.scss'
import { Link, useParams, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useTranslation } from 'react-i18next'
import { navigationBar } from '../../../types/types'
import ManageFeedButton from './Components/ManageFeedButton/ManageFeedButton'
import 'swiper/css'

const NavigationBar: FC<navigationBar> = ({ navArr, customClass, type, chosenListId, onApply }) => {
  const { id, feed } = useParams<{ id: string; feed: string }>()
  const location = useLocation()
  const { t } = useTranslation()

  const findActivePage = () => {
    if (location.pathname.split('/')[1] === 'profile') {
      return feed
    } else {
      return id
    }
  }
  const values = queryString.parse(location.search)
  if (location.pathname === '/') {
    return (
      <div className={`navbar navbar--${type} ${customClass ? `navbar__${customClass}` : ''}`}>
        <Swiper spaceBetween={5} slidesPerView='auto' style={{ height: '100%' }}>
          {navArr.map((navLink: string, key: number) => (
            <SwiperSlide key={key} style={{ width: 'auto' }}>
              <Link
                className={`navbar__link navbar--${type}__link--${
                  ((!values || !values.type) && navLink === 'all') || values.type === navLink ? 'active' : 'inactive'
                }`}
                to={navLink === 'all' ? '/' : `?type=${navLink}`}
                key={key}
              >
                {t(navLink.split('/').pop() || 'Missing')}
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* {navArr.map((navLink: string, key: number) => (
          <Link
            className={`navbar__link navbar--${type}__link--${
              (!location.search && navLink === 'all') ||
              location.search.includes(navLink)
                ? 'active'
                : 'inactive'
            }`}
            to={navLink === 'all' ? '/' : `?type=${navLink}`}
            key={key}
          >
            {t(navLink.split('/').pop() || 'Missing')}
          </Link>
        ))} */}
        <ManageFeedButton onApply={onApply} chosenListId={chosenListId} />
      </div>
    )
  }
  return (
    <div className={`navbar navbar--${type} ${customClass ? `navbar__${customClass}` : ''}`}>
      {navArr.map((navLink: string, key: number) => (
        <Link
          className={`navbar__link navbar--${type}__link--${
            findActivePage() === navLink.split('/').pop() || location.pathname.includes(navLink) ? 'active' : 'inactive'
          }`}
          to={navLink}
          key={key}
        >
          {t(navLink.split('/').pop() || 'Missing')}
        </Link>
      ))}
    </div>
  )
}

export default NavigationBar
