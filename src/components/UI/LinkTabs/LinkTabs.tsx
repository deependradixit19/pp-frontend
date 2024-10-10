import { FC } from 'react'
import './_linkTabs.scss'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface INavigationTab {
  route: string
  filters: string[] | { label: string; value: string }[] | (string | { label: string; value: string })[]
  customClass?: string
  activeFilter: string
}

const LinkTabs: FC<INavigationTab> = ({ route, filters, customClass, activeFilter }) => {
  const { t } = useTranslation()
  const renderLink = (filter: string, activeFilter: string, key: number) => {
    if (filter === 'all') {
      return activeFilter === filter ? (
        <Link className={`navbar__link navbar--light__link--active`} to={`${route}`} key={key}>
          {t(filter)}
        </Link>
      ) : (
        <Link className={`navbar__link navbar--light__link--inactive`} to={`${route}`} key={key}>
          {t(filter)}
        </Link>
      )
    } else {
      return activeFilter === filter ? (
        <Link className={`navbar__link navbar--light__link--active`} to={`${route}?type=${filter}`} key={key}>
          {t(filter)}
        </Link>
      ) : (
        <Link className={`navbar__link navbar--light__link--inactive`} to={`${route}?type=${filter}`} key={key}>
          {t(filter)}
        </Link>
      )
    }
  }

  const renderFiltersCustomLinks = (filter: { label: string; value: string }, activeFilter: string, key: number) => {
    return activeFilter === filter.value ? (
      <Link className={`navbar__link navbar--light__link--active`} to={`${route}?type=${filter.value}`} key={key}>
        {t(filter.label)}
      </Link>
    ) : (
      <Link className={`navbar__link navbar--light__link--inactive`} to={`${route}?type=${filter.value}`} key={key}>
        {t(filter.label)}
      </Link>
    )
  }

  return (
    <div className={`navbar navbar--light ${customClass ? `navbar__${customClass}` : ''}`}>
      {filters.map((filter: string | { label: string; value: string }, key: number) =>
        typeof filter === 'string'
          ? renderLink(filter, activeFilter, key)
          : renderFiltersCustomLinks(filter, activeFilter, key)
      )}
    </div>
  )
}

export default LinkTabs
