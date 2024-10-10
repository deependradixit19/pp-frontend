import { FC, useState } from 'react'
import './_fanModal.scss'
import { useTranslation } from 'react-i18next'
import { AllIcons } from '../../helpers/allIcons'

import ChangeStateTabs from '../../components/UI/ChangeStateTabs/ChangeStateTabs'
import AvatarHolder from '../../components/UI/AvatarHolder/AvatarHolder'
import IconButton from '../../components/UI/Buttons/IconButton'

import bg1 from '../../assets/images/home/bg1.png'
import AvatarPlaceholder from '../../assets/images/user_placeholder.png'

const FanModal: FC<{
  user: any
}> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<string>('summary')
  const { t } = useTranslation()

  const renderTab = () => {
    if (activeTab === 'summary') {
      return (
        <div className='fanModal__summary'>
          <div className='fanModal__summary__item'>
            <span className='fanModal__summary__item__left'>{t('lastActive')}</span>
            <span className='fanModal__summary__item__right'>1 Day Ago</span>
          </div>
          <div className='fanModal__summary__item'>
            <span className='fanModal__summary__item__left'>{t('preferredMediaCategory')}</span>
            <span className='fanModal__summary__item__right'>Candid</span>
          </div>
          <div className='fanModal__summary__item'>
            <span className='fanModal__summary__item__left'>{t('upsellConversioRatio')}</span>
            <span className='fanModal__summary__item__right'>0.0%</span>
          </div>
          <div className='fanModal__summary__item'>
            <span className='fanModal__summary__item__left'>{t('totalPurchases')}</span>
            <span className='fanModal__summary__item__right'>0</span>
          </div>
          <div className='fanModal__summary__item'>
            <span className='fanModal__summary__item__left'>{t('loginFrequency')}</span>
            <span className='fanModal__summary__item__right'>Session / 3 Days</span>
          </div>
          <div className='fanModal__summary__item'>
            <span className='fanModal__summary__item__left'>{t('messageOpenRate')}</span>
            <span className='fanModal__summary__item__right'>0.0%</span>
          </div>
          <div className='fanModal__summary__item'>
            <span className='fanModal__summary__item__left'>{t('unreadMessages')}</span>
            <span className='fanModal__summary__item__right'>None</span>
          </div>
        </div>
      )
    } else {
      return <div>OK</div>
    }
  }

  return (
    <div className='fanModal'>
      <div className='fanModal__cover' style={{ backgroundImage: `url(${bg1})` }}>
        <AvatarHolder
          img={user.croppedAvatar?.url || user.avatar?.url || AvatarPlaceholder}
          customClass='fanModal__avatar'
          size='60'
        />
        <p className='fanModal__name'>{user.name}</p>
        <p className='fanModal__username'>{user.username}</p>
        <div className='fanModal__buttons'>
          <div className='fanModal__buttons__button'>
            <IconButton type='black--transparent' icon={AllIcons.button_list} />
            {t('lists')}
          </div>
          <div className='fanModal__buttons__button'>
            <IconButton type='black--transparent' icon={AllIcons.chat_bubble} />
            {t('chat')}
          </div>
          <div className='fanModal__buttons__button'>
            <IconButton type='black--transparent' icon={AllIcons.button_block} />
            {t('block')}
          </div>
          <div className='fanModal__buttons__button'>
            <IconButton type='black--transparent' icon={AllIcons.document} />
            {t('notes')}
          </div>
        </div>
      </div>
      <div className='fanModal__tabs'>
        <ChangeStateTabs
          activeTab={activeTab}
          tabs={[
            {
              value: 'summary',
              name: t('summary')
            },
            {
              value: 'earnings',
              name: t('earnings')
            },
            {
              value: 'subscriptions',
              name: t('subscriptions')
            }
          ]}
          clickFn={(val: string) => setActiveTab(val)}
          width='full'
        />
        <div className='fanModal__tabs__tab'>{renderTab()}</div>
      </div>
    </div>
  )
}

export default FanModal
