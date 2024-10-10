import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'
import { useUserContext } from '../../../../context/userContext'
import CreateMessage from '../../../../features/Messaging/CreateMessage/CreateMessage'
import InboxContainer from '../../../../features/Messaging/InboxContainer/InboxContainer'
import Message from '../../../../features/Messaging/Message/Message'
import { deleteWelcomeMessage, updateWelcomeMessage } from '../../../../services/endpoints/settings'
import { addToast } from '../../../../components/Common/Toast/Toast'
import ConfirmModal from '../../../../components/UI/Modal/Confirm/ConfirmModal'
import { useModalContext } from '../../../../context/modalContext'

const EditWelcomeMessage: FC = () => {
  const userData = useUserContext()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const modalData = useModalContext()
  const { t } = useTranslation()

  const updateWelcomeMessageMutation = useMutation((params: any) => updateWelcomeMessage(params), {
    onSuccess: () => {
      queryClient.invalidateQueries('loggedProfile')
    },
    onError: () => {
      addToast('error', 'Something went wrong, please try again.')
    }
  })

  const deleteWelcomeMessageMutation = useMutation((params: any) => deleteWelcomeMessage(params), {
    onSuccess: () => {
      queryClient.invalidateQueries('loggedProfile')
    },
    onError: () => {
      addToast('error', 'Something went wrong, please try again.')
    }
  })

  if (
    !userData?.chat_settings?.welcome_message_text &&
    !userData?.chat_settings?.welcome_message_videos?.length &&
    !userData?.chat_settings?.welcome_message_photos?.length &&
    !userData?.chat_settings?.welcome_message_sounds?.length
  )
    navigate('/settings/general/chat-settings/welcome-message', {
      replace: true
    })

  return (
    <>
      <InboxContainer customClass='welcome-message-inbox'>
        <Message
          message={{
            body: userData?.chat_settings?.welcome_message_text,
            photos: userData?.chat_settings?.welcome_message_photos,
            videos: userData?.chat_settings?.welcome_message_videos,
            sounds: userData?.chat_settings?.welcome_message_sounds,
            recieved: false
          }}
          recieved={false}
          sender={userData}
          reactions={[]}
          setReply={() => null}
          addReaction={() => null}
          deleteMessage={(val: any) =>
            modalData.addModal(
              t('deleteMessage'),
              <ConfirmModal
                body={t('onceYouDeleteAMessage')}
                confirmFn={() => deleteWelcomeMessageMutation.mutate(val)}
              />
            )
          }
          reportMessage={() => null}
          purchaseMessage={() => null}
        />
      </InboxContainer>

      <CreateMessage
        writeMessageCustomClass='welcome-message-create-message'
        sendMessage={(val: any) => updateWelcomeMessageMutation.mutate(val)}
      />
    </>
  )
}

export default EditWelcomeMessage
