import { FC, useState } from 'react'
import './_groupMessage.scss'
import { useParams } from 'react-router-dom'

import { useTranslation } from 'react-i18next'
import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import CreateMessage from '../../features/Messaging/CreateMessage/CreateMessage'

import Recipients from './components/Recipients'

const GroupMessage: FC = () => {
  const [message, setMessage] = useState<any>({
    audience: '',
    text: '',
    audioMessage: null,
    audioPreview: null,
    price: 0,
    media: [],
    previewMedia: [],
    vaultImages: []
  })

  const [priceModalActive, setPriceModalActive] = useState<boolean>(false)
  const [attachmentsMinimized, setAttachmentsMinimized] = useState<boolean>(false)

  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()

  const sendMessage = () => {
    console.log(id)
  }

  return (
    <BasicLayout
      title={t('newGroupMessage')}
      headerNav={[`/new/message/inbox`, `/new/message/scheduled`, `/new/message/statistics`]}
      hideFooter={true}
    >
      <div className='groupMessage'>
        <Recipients audience={message.audience} setAudience={(val: any) => setMessage({ ...message, audience: val })} />

        {/* <CreateMessage
          id={parseInt(id)}
          message={message}
          setMessage={setMessage}
          priceModalActive={priceModalActive}
          setPriceModalActive={(val: boolean) => setPriceModalActive(val)}
          attachmentsMinimized={attachmentsMinimized}
          setAttachmentsMinimized={(val: boolean) => setAttachmentsMinimized(val)}
          customClass='groupMessage__create'
          vaultImages={message.vaultImages}
        /> */}
        
      </div>
    </BasicLayout>
  )
}

export default GroupMessage
