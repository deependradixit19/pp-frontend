import { FC, useEffect, useState } from 'react'
import './_newMessage.scss'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import { useTranslation } from 'react-i18next'
import { IMessage } from '../../../types/interfaces/IMessage'

import { sendChatMessage } from '../../../services/endpoints/api_messages'

import BasicLayout from '../../../layouts/basicLayout/BasicLayout'
import Recipients from '../components/Recipients'
import CreateMessage from '../../../features/Messaging/CreateMessage/CreateMessage'
import WithHeaderSection from '../../../layouts/WithHeaderSection/WithHeaderSection'
import { addToast } from '../../../components/Common/Toast/Toast'

const NewMessage = () => {
  const [message, setMessage] = useState<IMessage>({
    audience: '',
    text: '',
    audioMessage: null,
    audioPreview: null,
    price: 0,
    media: [],
    previewMedia: [],
    vaultImages: []
  })

  const [audience, setAudience] = useState<number[] | null>(null)
  const [group, setGroup] = useState<number | number[] | null>(null)

  let type = group ? 'mass message' : audience && audience.length > 1 ? 'mass message' : 'text'
  const navigate = useNavigate()
  const { t } = useTranslation()

  const addMessage = useMutation(
    (newMessage: IMessage) => {
      return sendChatMessage(newMessage, { recipient: audience, group }, type)
    },
    {
      onSettled: () => {
        if (type === 'mass message') navigate(`/messages/inbox`)
        else if (type === 'text') navigate(`/chat/${audience ? audience[0] : ''}`)
      }
    }
  )

  useEffect(() => {
    if (message.audience !== '') {
      if (message.audience.id) {
        setAudience(null)
        setGroup(message.audience.id)
      } else if (!message.audience.id && message.audience.length > 0) {
        setGroup(null)
        setAudience(message.audience.map((item: any) => item.id))
      } else {
        setGroup(null)
        setAudience(null)
      }
    }
  }, [message])

  return (
    <BasicLayout title={t('newMessage')}>
      <WithHeaderSection
        headerSection={
          <Recipients
            audience={message.audience}
            setAudience={(val: any) => setMessage({ ...message, audience: val })}
          />
        }
        withoutBorder={true}
      >
        <div className='newMessage'>
          <CreateMessage
            sendMessage={(val: any) => {
              if (audience || group) {
                addMessage.mutate(val)
              } else {
                addToast('error', 'Select audience')
              }
            }}
            customClass='newMessage__create'
            writeMessageCustomClass='newMessage__writemessage'
          />
        </div>
      </WithHeaderSection>
    </BasicLayout>
  )
}

export default NewMessage
