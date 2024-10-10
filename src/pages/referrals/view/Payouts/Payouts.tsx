import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import UserCardEarnings from '../../../../components/UI/UserCard/UserCardEarnings'
import styles from './_Payouts.module.scss'

const Payouts: FC = () => {
  const user = {
    avatar: {
      url: 'https://www.planetware.com/wpimages/2020/02/france-in-pictures-beautiful-places-to-photograph-eiffel-tower.jpg'
    },
    name: 'Alex White',
    username: 'alexi'
  }
  const { t } = useTranslation()

  return (
    <div className={styles.payoutsContainer}>
      <UserCardEarnings user={user} earningsCardType={t('processing')} userCardSubType='payout' />
      <UserCardEarnings user={user} earningsCardType={t('paid')} userCardSubType='payout' />
    </div>
  )
}

export default Payouts
