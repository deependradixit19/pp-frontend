import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ActionCard from '../../../features/ActionCard/ActionCard'
import WithHeaderSection from '../../../layouts/WithHeaderSection/WithHeaderSection'
import * as Icons from '../../../assets/svg/sprite'
import Button from '../../../components/UI/Buttons/Button'
import CreateTicketModal from './CreateTicketModal'

const CreateTicket: FC = () => {
  const [createTicketModal, setCreateTicketModal] = useState(false)
  const { t } = useTranslation()
  return (
    <div>
      <CreateTicketModal isOpen={createTicketModal} closeTicketModal={() => setCreateTicketModal(false)} />
      <WithHeaderSection headerSection={<h1 className='createTicket__heading'>{t('createATicket')}</h1>}>
        <div className='createTicket__body'>
          <ActionCard
            clickFn={() => setCreateTicketModal(true)}
            customClass='createTicket__body__search'
            icon={
              <div className='createTicket__body__search--icon'>
                <Icons.chatBubblesWithQuestion />
              </div>
            }
            text={<span className='createTicket__body__search--text'>{t('selectAQuestion')}...</span>}
          />
          <div className='createTicket__body__text'>
            <p className='createTicket__body__text--p'>
              Cras eget dignissim tellus. Vivamus ante sapien, egestas eget ornare quis, condimentum et neque.
              <br />
              <br />
              Vestibulum tincidunt commodo nisl, vitae ullamcorper lectus condimentum in.
              <br />
              <br />
              Phasellus ac rutrum massa.
            </p>
          </div>
          <div className='createTicket__body__bottomBorderLine'></div>
          <div className='createTicket__body__bottomButtons'>
            <Icons.IconImageOutline color='#778797' />
            <Button text={t('submit')} color='blue' width='10' height='3' font='mont-14-normal' />
          </div>
        </div>
      </WithHeaderSection>
    </div>
  )
}

export default CreateTicket
