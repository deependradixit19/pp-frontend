import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import queryString from 'query-string'
import styles from './tabNavbar.module.scss'
import { queryFromSearchParams } from '../../../helpers/util'

interface Props {
  navArr: string[]
  type: string
}

const ButtonTabNavbar: FC<Props> = ({ navArr, type }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const values = queryString.parse(location.search)

  return (
    <div className={`${styles.navbar} ${type === 'dark' ? styles.dark : ''}`}>
      {navArr.map((navLink: string, key: number) => {
        return (
          <button
            className={`${styles.button} ${location.search.includes(navLink) ? styles.active : styles.inactive}`}
            onClick={() => {
              const queryString = queryFromSearchParams(values, `?type=${navLink}`)
              navigate(queryString)
            }}
            key={key}
          >
            {t(navLink || 'Missing')}
          </button>
        )
      })}
    </div>
  )
}

export default ButtonTabNavbar
