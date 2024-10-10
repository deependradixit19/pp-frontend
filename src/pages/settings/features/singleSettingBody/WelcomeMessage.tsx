import { useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconTrashcan } from '../../../../assets/svg/sprite'
import { addToast } from '../../../../components/Common/Toast/Toast'
import Button from '../../../../components/UI/Buttons/Button'
import { useUserContext } from '../../../../context/userContext'
import InboxContainer from '../../../../features/Messaging/InboxContainer/InboxContainer'
import Message from '../../../../features/Messaging/Message/Message'
import { deleteWelcomeMessage, setWelcomeMessage } from '../../../../services/endpoints/settings'
import { getAccessToken } from '../../../../services/storage/storage'
import CreateMessage from '../../../../features/Messaging/CreateMessage/CreateMessage'
import ConfirmModal from '../../../../components/UI/Modal/Confirm/ConfirmModal'
import { useModalContext } from '../../../../context/modalContext'

const WelcomeMessage = () => {
  const queryClient = useQueryClient()
  const userData = useUserContext()
  const navigate = useNavigate()
  const modalData = useModalContext()
  const { t } = useTranslation()

  const welcomeMessageMutation = useMutation((params: any) => setWelcomeMessage(params), {
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

  function openEdit() {
    navigate('/settings/general/chat-settings/edit-welcome-message')
  }

  return (
    <>
      {!userData?.chat_settings?.welcome_message_text &&
      !userData?.chat_settings?.welcome_message_videos?.length &&
      !userData?.chat_settings?.welcome_message_photos?.length &&
      !userData?.chat_settings?.welcome_message_sounds?.length ? (
        <CreateMessage
          sendMessage={(val: any) => welcomeMessageMutation.mutate(val)}
          writeMessageCustomClass='welcome-message-create-message'
          hasGif={false}
        />
      ) : (
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
              addReaction={() => null}
              deleteMessage={() => null}
              setReply={() => null}
              recieved={false}
              sender={userData}
              reactions={[]}
              reportMessage={() => null}
              purchaseMessage={() => null}
            />
          </InboxContainer>
          <div className='welcome-message-buttons-container'>
            <div
              className='welcome-message-delete'
              onClick={() =>
                modalData.addModal(
                  t('deleteMessage'),
                  <ConfirmModal
                    body={t('onceYouDeleteAMessage')}
                    confirmFn={() => deleteWelcomeMessageMutation.mutate(userData.chat_settings)}
                  />
                )
              }
            >
              <IconTrashcan width='20' height='22' />
            </div>
            <Button
              text={'Edit'}
              color='black'
              customClass='welcome-message-button'
              disabled={false}
              clickFn={openEdit}
            />
          </div>
        </>
      )}
    </>
  )
}

export default WelcomeMessage
