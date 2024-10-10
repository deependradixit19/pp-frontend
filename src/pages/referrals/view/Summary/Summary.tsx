import { FC } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import ActionCard from '../../../../features/ActionCard/ActionCard'
import CreatorsList from '../../../../features/CreatorsList/CreatorsList'
import * as Icons from '../../../../assets/svg/sprite'
import { toFixedNumber } from '../../../../helpers/dataTransformations'

import styles from './_Summary.module.scss'

const Summary: FC<{
  tab: string
  referralsData: any[]
}> = ({ tab, referralsData }) => {
  const { t } = useTranslation()

  switch (tab) {
    case 'creators':
      return (
        <CreatorsList creators={referralsData} renderLocation={'referrals'} customClass={styles.referralsCreators} />
      )
    case 'fans':
      return (
        <div>
          {referralsData.map((user: any) => (
            <div className={styles.fansCard}>
              <ActionCard
                key={user.userId}
                text={user.name || ''}
                subtext={user.handle ? `@${user.handle}` : ''}
                // description={renderSortOptionTags(user)}
                customClass='fans-group-action-card'
                avatar={<img className='addUsers__modal__avatar' src={user.avatarUrl} alt={t('avatar')} />}
                customHtml={
                  <div className='actionCard__fans__icons'>
                    <div
                      className='actionCard__fans__icons--twoPeople'
                      onClick={() => {
                        // modalData.addModal(
                        //   t('addUserToGroups'),
                        //   <AddUserToGroups
                        //     applyFn={(val: any) =>
                        //       addFanToGroupsMutation.mutate({
                        //         id: user.id,
                        //         groupIds: val,
                        //       })
                        //     }
                        //     id={user.id}
                        //   />
                        // )
                      }}
                    >
                      <Icons.IconTwoPeopleOutline />
                    </div>
                    <Link
                      // todo: conversation id needed here
                      to={`/chat/`}
                      className='actionCard__fans__icons--chatOutline'
                    >
                      <Icons.IconChatOutline color='#2894FF' />
                    </Link>
                  </div>
                }
              />
              <div className={`creator__stats creator__stats__referrals `}>
                <div className='creator__stat'>
                  <div className='creator__stat__name'>{t('DateRegistered')}</div>
                  <div className='creator__stat__value'>{dayjs(user.registeredAt).format('ll')}</div>
                </div>
                <div className='creator__stat'>
                  <div className='creator__stat__name'>{t('earnings')}</div>
                  <div className='creator__stat__value'>
                    <span>${toFixedNumber(user.price, 2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    default:
      return null
  }
}

export default Summary
