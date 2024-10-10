import { FC } from 'react'
import { useQuery, UseQueryResult } from 'react-query'
import { Link } from 'react-router-dom'
import { AllIcons } from '../../../helpers/allIcons'
import { getPendingStats } from '../../../services/endpoints/api_global'
import styles from './BellLink.module.scss'

const BellLink: FC = () => {
  const { data, error }: UseQueryResult<{ [key: string]: number }> = useQuery('pendingStats', getPendingStats, {
    enabled: true,
    staleTime: Infinity,
    refetchOnWindowFocus: false
  })

  return (
    <Link className={styles.bell} to='/notifications'>
      <img src={AllIcons.footer_notifications} alt='Notifications' />
      {data?.notifications ? <div className={styles.bell_count}>{data.notifications}</div> : null}
    </Link>
  )
}

export default BellLink
