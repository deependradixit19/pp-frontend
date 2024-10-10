import { FC, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Emoji } from 'emoji-picker-react'
import { addToast } from '../../../../../components/Common/Toast/Toast'
import * as spriteIcons from '../../../../../assets/svg/sprite'
import style from './_message_options.module.scss'

const MessageOptions: FC<{
  message: any
  setReply: (val: { body: string; id: number; message: any; recieved?: boolean }) => void
  addReaction: (val: string, val2: number) => void
  deleteMessage: (val: number) => void
  reportMessage: (val: number) => void
  recieved?: boolean
}> = ({ message, setReply, recieved, addReaction, deleteMessage, reportMessage }) => {
  const [moreOpen, setMoreOpen] = useState(false)
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [hideActive, setHideActive] = useState(false)
  const { t } = useTranslation()

  const emojiRef = useRef<HTMLDivElement>(null)
  const moreOptionsRef = useRef<HTMLDivElement>(null)

  let emojiTimeout: any = null
  let moreOptionsTimeout: any = null

  const correctOverflows = (element: HTMLDivElement) => {
    const parent = element.parentElement?.parentElement?.parentElement?.parentElement?.parentElement
    const button = element.parentElement
    const buttonRect = button?.getBoundingClientRect()
    const parentRect = parent?.getBoundingClientRect()
    const rect = element.getBoundingClientRect()

    if (buttonRect && parentRect) {
      const buttonRightX = buttonRect?.x + buttonRect?.width

      if (rect.left < parentRect.left) {
        element.style.left = '0'
        element.style.right = 'auto'
        element.style.transform = `translateX(${-buttonRect?.x + 20}px)`
      } else if (rect.right > parentRect?.right) {
        element.style.left = 'auto'
        element.style.right = '0'
        element.style.transform = `translateX(${parentRect.width - buttonRightX + 20}px)`
      }

      if (rect.top < parentRect.top) {
        element.style.top = `${buttonRect.height}px`
      }
      if (rect.bottom > parentRect.bottom) {
        element.style.top = `auto`
        element.style.bottom = `${buttonRect.height + 5}px`
      }
    }
  }

  const closeEmoji = () => {
    if (emojiRef.current) {
      clearTimeout(emojiTimeout)
      emojiTimeout = setTimeout(() => {
        emojiRef?.current?.removeAttribute('style')
      }, 200)
      setEmojiOpen(false)
    }
  }
  const openEomji = () => {
    if (emojiRef.current) {
      correctOverflows(emojiRef.current)
      setEmojiOpen(true)
    }
  }
  const closeMoreOptions = () => {
    if (moreOptionsRef.current) {
      clearTimeout(moreOptionsTimeout)
      moreOptionsTimeout = setTimeout(() => {
        moreOptionsRef?.current?.removeAttribute('style')
      }, 200)
    }
    setMoreOpen(false)
  }
  const openMoreOptions = () => {
    if (moreOptionsRef.current) {
      const time = new Date(message.created_at).getTime()
      const elapsed = new Date().getTime() - time
      correctOverflows(moreOptionsRef.current)
      if (!hideActive && elapsed > 120000) {
        setHideActive(true)
      }
      setMoreOpen(true)
    }
  }
  const addMessageReaction = (type: string) => {
    closeEmoji()
    addReaction(type, message.id)
  }

  return (
    <>
      <div
        className={`${style.more_options_overlay} ${moreOpen ? style.more_options_overlay_open : ''}`}
        onClick={closeMoreOptions}
      ></div>
      <div
        className={`${style.more_options_overlay} ${emojiOpen ? style.more_options_overlay_open : ''}`}
        onClick={closeEmoji}
      ></div>
      <div className={`${style.message_options_container} ${recieved ? style.message_options_container_recieved : ''}`}>
        {recieved && (
          <div className={style.message_options_react}>
            <div onClick={openEomji} className={style.message_options_react_icon}>
              <spriteIcons.IconHeartAddOutline />
            </div>
            <div
              ref={emojiRef}
              className={`${style.message_options_react_emojis} ${
                emojiOpen ? style.message_options_react_emojis_open : ''
              }`}
            >
              <div onClick={() => addMessageReaction('love')}>
                <Emoji unified='2764-fe0f' size={25} />
              </div>
              <div onClick={() => addMessageReaction('smile')}>
                <Emoji unified='1f606' size={25} />
              </div>
              <div onClick={() => addMessageReaction('kiss')}>
                <Emoji unified='1f618' size={25} />
              </div>
              <div onClick={() => addMessageReaction('cry')}>
                <Emoji unified='1f972' size={25} />
              </div>
              <div onClick={() => addMessageReaction('sad')}>
                <Emoji unified='1f614' size={25} />
              </div>
              <div onClick={() => addMessageReaction('like')}>
                <Emoji unified='1f44d' size={25} />
              </div>
            </div>
          </div>
        )}
        <div
          onClick={() =>
            setReply({
              body: message.body !== '' ? message.body : message.sounds.length > 0 && message.sounds[0],
              id: message.id,
              recieved: recieved,
              message: message
            })
          }
        >
          <spriteIcons.IconReplyOutline color='#778797' />
        </div>
        <div
          className={`${style.message_options_more_container} ${
            moreOpen ? style.message_options_more_container_open : ''
          }`}
        >
          <div className={style.message_options_more_icon} onClick={openMoreOptions}>
            <spriteIcons.IconThreeDots color='#778797' />
          </div>
          <div className={style.message_options_more_options} ref={moreOptionsRef}>
            {!recieved ? (
              <>
                <div
                  onClick={() => {
                    navigator.clipboard.writeText(message.text || message.body || message.message || '')
                    addToast('success', t('Copied'))
                    closeMoreOptions()
                  }}
                >
                  Copy
                </div>
                <div
                  onClick={() => {
                    deleteMessage(message.id)
                    closeMoreOptions()
                  }}
                >
                  {!hideActive ? 'Unsend' : 'Hide'}
                </div>
              </>
            ) : (
              <>
                <div
                  onClick={() => {
                    deleteMessage(message.id)
                    closeMoreOptions()
                  }}
                >
                  Hide
                </div>
                <div
                  onClick={() => {
                    navigator.clipboard.writeText(message.text || message.body || message.message || '')
                    addToast('success', t('Copied'))
                    closeMoreOptions()
                  }}
                >
                  Copy
                </div>
                <div onClick={() => reportMessage(message.id)}>Report</div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default MessageOptions
