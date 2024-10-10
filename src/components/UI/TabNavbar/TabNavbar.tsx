import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { useFilterQuery } from '../../../helpers/hooks'
import styles from './tabNavbar.module.scss'

interface Props {
  navArr: string[]
  type: string
}

const TabNavbar: FC<Props> = ({ navArr, type }) => {
  const { t } = useTranslation()
  const location = useLocation()

  return (
    <div className={`${styles.navbar} ${type === 'dark' ? styles.dark : ''}`}>
      {navArr.map((navLink: string, key: number) => (
        <Link
          className={`${styles.link} ${location.search.includes(navLink) ? styles.active : styles.inactive}`}
          to={`?type=${navLink}`}
          key={key}
        >
          {t(navLink || 'Missing')}
        </Link>
      ))}
    </div>
  )
}

export default TabNavbar
