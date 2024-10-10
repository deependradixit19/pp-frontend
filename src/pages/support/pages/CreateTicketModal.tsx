import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import ActionCard from '../../../features/ActionCard/ActionCard'
import * as Icons from '../../../assets/svg/sprite'

const CreateTicketModal: FC<{
  closeTicketModal: () => void
  isOpen: boolean
}> = ({ closeTicketModal, isOpen }) => {
  const { t } = useTranslation()
  return (
    <div className={`createTicketModal ${isOpen ? 'createTicketModal--open' : ''}`}>
      <ActionCard
        customClass='createTicketModal__actionCard'
        icon={<Icons.chatBubblesWithQuestion color='#0D1444' width='30' height='30' />}
        text={t('generalQuestions')}
        clickFn={closeTicketModal}
        dropDownContent='asd'
      />
      <ActionCard
        customClass='createTicketModal__actionCard'
        icon={<Icons.IconThreeUsersOutline />}
        text={t('fanQuestions')}
        dropDownContent={
          <ActionCard
            customClass='createTicketModal__dropDown__actionCard'
            text={t('subscriptions')}
            dropDownContent={
              <ul className='createTicketModal__dropDown'>
                <li>{t('whySubscribe')}</li>
                <li>{t('howToSubscribe')}</li>
                <li>{t('fondingAProfile')}</li>
                <li>{t('freeTrials')}</li>
                <li>{t('imUnableToSubscribeToAnAccount')}</li>
                <li>{t('iCannotFindMySubscription')}</li>
                <li>{t('thisPageIsNotAvailableHelp')}</li>
                <li>{t('cancelASubscription')}</li>
                <li>{t('autoRenewalSubscriptions')}</li>
              </ul>
            }
          />
        }
      />
      <ActionCard text='Payment' dropDownContent='asd' />
      <ActionCard text='Tips' dropDownContent='asd' />
    </div>
  )
}

export default CreateTicketModal
