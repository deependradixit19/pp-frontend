import { FC, useState } from 'react'
import './_liveChat.scss'
import { useTranslation } from 'react-i18next'
import placeholderAvatar from '../../../assets/images/user_placeholder.png'
import { IconVolumeMutedFill, IconVolumeFill, IconChatDashed, IconSendOutline } from '../../../assets/svg/sprite'

const tmpMessages = [
  {
    avatarUrl: '',
    name: 'Blacknoise',
    message: 'Thank you for this session'
  },
  {
    avatarUrl: '',
    name: 'Wonderman',
    message: 'You are so awesome!!!'
  },
  {
    avatarUrl: '',
    name: 'Minerva Ortega',
    message: "Yeah, that's right we're dancing tonight"
  },
  {
    avatarUrl: '',
    name: 'Nick Stewart',
    message: 'Somebody dance with me'
  },
  {
    avatarUrl: '',
    name: 'Milan Stanojevic',
    message: 'Evo ja cu!'
  },
  {
    avatarUrl: '',
    name: 'Milan Stanojevic',
    message: 'Thank you for this session'
  }
]

interface Props {
  muted: boolean
  setMuted: (fn: (value: boolean) => boolean) => void
}

const LiveChat: FC<Props> = ({ muted, setMuted }) => {
  const [newChatMessage, setNewChatMessage] = useState('')
  // const [toggleEmojiPicker, setToggleEmojiPicker] = useState(false);

  const { t } = useTranslation()

  // const onEmojiClick = (
  //   emojiObject: { emoji: string }
  // ) => {
  //   setNewChatMessage(`${newChatMessage}${emojiObject.emoji}`);
  // };

  return (
    <div className='livechat'>
      <div className='livechat__overlay'></div>
      <div className='livechat__messages'>
        {tmpMessages.map((message, idx) => {
          return (
            <div className={`livechat__message ${idx === 3 ? 'highlighted' : ''}`} key={idx}>
              <div className='livechat__message__avatar'>
                <img src={placeholderAvatar} alt='' />
              </div>
              <div className='livechat__message__content'>
                <div className='livechat__message__content--name'>
                  {message.name}
                  {idx === 4 && (
                    <div className='tippedFlag'>
                      {t('tipped')} <span>20$</span>
                    </div>
                  )}
                </div>
                <div className='livechat__message__content--text'>{message.message}</div>
              </div>
            </div>
          )
        })}
      </div>
      <div className='livechat__footer'>
        <div className='livechat__footer--left'>
          <div className='livechat__footer--icon' onClick={() => setMuted(muted => !muted)}>
            {muted ? <IconVolumeMutedFill /> : <IconVolumeFill />}
          </div>
        </div>
        <div className='livechat__footer--right'>
          <div className='livechat__footer__input'>
            <div className='livechat__footer__input--icon'>
              <IconChatDashed />
            </div>
            <input
              type='text'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNewChatMessage(e.currentTarget.value)
              }}
              value={newChatMessage}
              placeholder={t('commentHere')}
            />
            {/* <div
              className="livechat__footer__emoji"
              onClick={() => setToggleEmojiPicker(!toggleEmojiPicker)}
            >
              <img src={AllIcons.smile} alt="Emojis" />
            </div>
            {toggleEmojiPicker ? (
              <div className="emojiPicker">
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            ) : (
              ''
            )} */}
          </div>
          <div className='livechat__footer__send' onClick={() => {}}>
            <div className='livechat__footer__send--icon'>
              <IconSendOutline />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveChat
