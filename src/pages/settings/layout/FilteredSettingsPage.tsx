import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import ActionCard from '../../../features/ActionCard/ActionCard'

const FilteredSettingsPage: FC<{
  filteredCards: any
}> = ({ filteredCards }) => {
  const { t } = useTranslation()
  const renderCards = (title: string, arr: any) => {
    return (
      <div className='settings__filtered'>
        <h2>{title}</h2>
        {arr.map((card: any, ind: number) => (
          <ActionCard
            key={ind}
            link={card.link}
            icon={card.icon}
            text={card.body}
            subtext={card.currentData}
            description={card.info}
            hasArrow={card.hasArrow}
            hasToggle={card.hasToggle}
            hasToggleWithText={card.hasToggleWithText}
            toggleText={card.toggleText}
            toggleActive={card.toggleActive}
            toggleFn={card.toggleFn}
            absFix={card.absfix}
            hasWire={card.hasWire}
          />
        ))}
      </div>
    )
  }

  return (
    <div>
      {filteredCards.general.length > 0 ? renderCards(t('settings:generalSettings'), filteredCards.general) : ''}

      {filteredCards.account.length > 0 ? renderCards(t('settings:accountSettings'), filteredCards.account) : ''}

      {filteredCards.notifications.length > 0
        ? renderCards(t('settings:notificationSettings'), filteredCards.notifications)
        : ''}
    </div>
  )
}

export default FilteredSettingsPage
