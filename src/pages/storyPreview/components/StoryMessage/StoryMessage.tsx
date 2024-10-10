import React, { FC, useState, MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import EmojiPicker from 'emoji-picker-react'

import { Icons } from '../../../../helpers/icons'
import { sendStoryMessage } from '../../../../services/endpoints/api_messages'
import { StoryActionType, StoryMessageType } from '../../../../types/types'

interface StoryMessageProps {
  recipient: number
  setAction: (action: StoryActionType) => any
  setIsPaused: (x: boolean) => any
}

const StoryMessage: FC<StoryMessageProps> = ({ recipient, setAction, setIsPaused }) => {
  const { t } = useTranslation()
  const [toggleEmojiPicker, setToggleEmojiPicker] = useState<boolean>(false)
  const [sending, setSending] = useState<boolean>(false)

  const [message, setMessage] = useState<StoryMessageType>({
    message: '',
    type: 'story',
    recipient
  })

  const onEmojiClick = (emojiObject: { emoji: string }) => {
    const newText = `${message.message}${emojiObject.emoji}`
    setMessage(prevValue => {
      return { ...prevValue, message: newText }
    })
  }

  const onSendMessage = async () => {
    setToggleEmojiPicker(false)
    setSending(true)
    await sendStoryMessage(message)
    setAction && setAction('longPress')
    setSending(false)
    setMessage(prevValue => {
      return { ...prevValue, message: '' }
    })
    setIsPaused(false)
  }

  return (
    <div className='writeMessage__top'>
      <div className='writeMessage__field'>
        <textarea
          id='storyMessageInput'
          onChange={e =>
            setMessage(prevValue => {
              return { ...prevValue, message: e.target.value }
            })
          }
          value={message.message}
          placeholder={`${t('message')}...`}
          onClick={() => {
            document.getElementById('storyMessageInput')?.focus()
          }}
        />
        <img
          src={Icons.smile}
          alt={t('smile')}
          className='writeMessage__field--smile'
          onClick={() => setToggleEmojiPicker(!toggleEmojiPicker)}
        />
        {toggleEmojiPicker && (
          <div className='emojiPicker'>
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </div>
      <div
        className={`writeMessage__sendBtn${sending ? ' writeMessage__sendBtn--sending' : ''}`}
        onClick={onSendMessage}
      >
        <img src={Icons.lightSend} alt={t('send')} />
      </div>
    </div>
  )
}

export default StoryMessage
