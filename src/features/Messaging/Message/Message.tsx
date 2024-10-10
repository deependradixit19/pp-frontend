import { FC, useRef, useState, useEffect, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import ReactPlayer from 'react-player'
import { Emoji } from 'emoji-picker-react'
import { IconPlayOutline, IconPostPauseOutline } from '../../../assets/svg/sprite'
import AudioMessage from '../../../components/UI/AudioMessage/AudioMessage'
import styles from './_message.module.scss'
import * as spriteIcons from '../../../assets/svg/sprite'
import MessageOptions from './components/MessageOptions/MessageOptions'
import FullscreenMessage from './components/FullscreenMessage/FullscreenMessage'
import GifLoader from './components/GifLoader/GifLoader'
import MessageProcessing from './components/MessageProcessing/MessageProcessing'
import avatarPlaceHolder from '../../../assets/images/user_placeholder.png'
import { InboxContext } from '../InboxContainer/InboxContext'

const Message: FC<{
  message: any
  recieved: boolean
  sender: any
  reactions: any
  setReply: (val: any) => void
  addReaction: (val: string, val2: number) => void
  deleteMessage: (val: number) => void
  reportMessage: (val: number) => void
  purchaseMessage: (val: number) => void
  next_recieved?: boolean
  prev_recieved?: boolean
  seen?: boolean
  sending?: boolean
  showDate?: boolean
  setMessageId?: (val: number | null) => void
  messageId?: number | null
}> = ({
  message,
  recieved,
  sender,
  reactions,
  setReply,
  next_recieved,
  prev_recieved,
  seen,
  sending,
  addReaction,
  deleteMessage,
  purchaseMessage,
  reportMessage,
  showDate,
  setMessageId,
  messageId
}) => {
  const { t } = useTranslation()
  const [videoPlaying, setVideoPlaying] = useState<number[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const inboxContext = useContext(InboxContext)
  const videoRef = useRef<any>(null)
  const monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const date = new Date(message.created_at)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const hours = ('0' + date.getHours()).slice(-2)
  const minutes = ('0' + date.getMinutes()).slice(-2)
  const month = monthArray[date.getMonth()]
  const year = date.getFullYear()
  const day = ('0' + date.getDate()).slice(-2)

  const dateString = `${month} ${day}, ${year}`
  const todayDate =
    `${monthArray[new Date().getMonth()]} ${('0' + new Date().getDate()).slice(-2)}, ${new Date().getFullYear()}` ===
    dateString
  const yesterdayDate =
    `${monthArray[yesterday.getMonth()]} ${('0' + yesterday.getDate()).slice(-2)}, ${yesterday.getFullYear()}` ===
    dateString

  const ampm = date.getHours() >= 12 ? 'PM' : 'AM'

  const mediaArray: any = [
    message.photos_preview || [],
    message.videos_preview || [],
    message.sounds ? message.sounds : [],
    message.photos ? message.photos : [],
    message.videos ? message.videos : []
  ]
  const tmpmergedMediaArray: any = [].concat.apply([], mediaArray).sort((a: any, b: any) => a.order - b.order)
  const ids: number[] = []
  const mergedMediaArray = tmpmergedMediaArray.filter((media: any) => {
    if (!ids.includes(media.id)) {
      ids.push(media.id)

      return true
    }
    return false
  })

  useEffect(() => {
    setVideoPlaying([])
    if (previewOpen) {
      if (inboxContext) {
        inboxContext.changeClass(styles.inbox_fullscreen_open, 'add')
      }
    } else {
      if (inboxContext) {
        inboxContext.changeClass(styles.inbox_fullscreen_open, 'remove')
      }
    }
  }, [previewOpen, inboxContext])

  const toggleVideo = (id: number) => {
    setVideoPlaying((prevState: number[]) => {
      let array = [...prevState]

      if (!array.includes(id)) {
        array.push(id)
      } else {
        array = array.filter((item: number) => item !== id)
      }
      return array
    })
  }

  const renderReactions = () => {
    const reactionKeys = Object.keys(reactions)
    return reactionKeys
      .filter((key: any) => reactions[key].count > 0)
      .map((key, index) => {
        let emoji = ''
        const emojiObject = {
          cry: '1f972',
          kiss: '1f618',
          like: '1f44d',
          love: '2764-fe0f',
          sad: '1f614',
          smile: '1f606'
        }

        if (emojiObject[key as keyof typeof emojiObject]) {
          emoji = emojiObject[key as keyof typeof emojiObject]
        }

        return (
          <div key={index} className={styles.message_reaction}>
            <Emoji unified={emoji} size={14} />
            <div>{reactions[key].count}</div>
          </div>
        )
      })
  }

  const renderReply = () => {
    return (
      message.replied_message?.message && (
        <div
          className={`${styles.replied_message_text} ${
            message.replied_message?.message.body === '' ? styles.replied_message_audio : ''
          }`}
        >
          {recieved && (
            <div className={styles.replied_message_response}>
              <spriteIcons.IconChatBUbblesOutline />
              Response
            </div>
          )}
          <spriteIcons.IconQuotes />
          {message.replied_message?.message?.body !== '' ? (
            <p>{message.replied_message.message.body}</p>
          ) : (
            message.replied_message?.message.sounds.length > 0 && (
              <AudioMessage
                audioReady={true}
                waveBackgroundColor='transparent'
                waveHeight={30}
                timerTextSize={12}
                timerTextColor={recieved ? 'gray' : 'white'}
                waveColor={recieved ? 'gray' : 'white'}
                audioBlob={
                  message.replied_message?.message.sounds[0].src ||
                  message.replied_message?.message.sounds[0].url ||
                  message.replied_message?.message.sounds[0].path ||
                  ''
                }
                customClass={`${styles.message_sound_player} ${recieved ? styles.message_sound_player_recieved : ''}`}
              />
            )
          )}
        </div>
      )
    )
  }

  const renderMedia = () => {
    if (mergedMediaArray.length > 0) {
      return mergedMediaArray.map((item: any, key: number) => {
        if (item.type === 'photo')
          return item.url || item.src || item.path ? (
            <div
              className={styles.message_photo}
              key={key}
              onClick={() => {
                if (item.locked === 1 && message.price > 0 && !message.is_purchased) {
                  // purchaseMessage(message.id);
                } else {
                  setPreviewOpen(true)
                }
              }}
            >
              <img src={item.src || item.url || item.path || ''} alt='message' />
              {item.locked === 1 && message.price > 0 && !message.is_purchased && (
                <button
                  className={styles.message_buy_button}
                  onClick={() => {
                    purchaseMessage(message.id)
                  }}
                >
                  {t('buy')} ${message.price}
                </button>
              )}
            </div>
          ) : (
            <MessageProcessing key={key} recieved={recieved} />
          )
        if (item.type === 'video' && typeof item.preview === 'number') {
          if (item.src || item.url || item.path || item.active_thumb) {
            if (item.locked === 1 && message.price > 0) {
              if (item.thumb_type === 'thumb' || item.thumb_type === 'blur') {
                return (
                  <div
                    className={styles.message_photo}
                    key={key}
                    onClick={() => {
                      if (item.locked === 1 && message.price > 0 && !message.is_purchased) {
                        purchaseMessage(message.id)
                      } else {
                        setPreviewOpen(true)
                      }
                    }}
                  >
                    <img src={item.active_thumb} alt='video preview' />
                    <div className={styles.message_video_icons}>
                      <IconPlayOutline color='#ffffff' />
                    </div>
                    {item.locked === 1 && message.price > 0 && !message.is_purchased && (
                      <button className={`${styles.message_buy_button} ${styles.message_buy_button_video}`}>
                        {t('buy')} ${message.price}
                      </button>
                    )}
                  </div>
                )
              }

              if (item.thumb_type === 'clip' || item.thumb_type === 'trimmed_video') {
                return (
                  <div
                    className={styles.message_video}
                    key={key}
                    onClick={() => {
                      if (item.locked === 1 && message.price > 0 && !message.is_purchased) {
                        purchaseMessage(message.id)
                      } else {
                        setPreviewOpen(true)
                      }
                    }}
                  >
                    <ReactPlayer
                      width={'100%'}
                      height={'100%'}
                      controls={false}
                      url={item.active_thumb}
                      ref={videoRef}
                      playing={videoPlaying.includes(item.id)}
                      onEnded={() => toggleVideo(item.id)}
                    />
                    <div
                      className={styles.message_video_icons}
                      onClick={e => {
                        e.stopPropagation()
                        toggleVideo(item.id)
                      }}
                    >
                      {videoPlaying.includes(item.id) ? <IconPostPauseOutline /> : <IconPlayOutline color='#ffffff' />}
                    </div>
                    {item.locked === 1 && message.price > 0 && !message.is_purchased && (
                      <button className={`${styles.message_buy_button} ${styles.mespusage_buy_button_video}`}>
                        {t('buy')} ${message.price}
                      </button>
                    )}
                  </div>
                )
              }
            }
            return (
              <div className={styles.message_video} key={key} onClick={() => setPreviewOpen(true)}>
                <ReactPlayer
                  width={'100%'}
                  height={'100%'}
                  controls={false}
                  url={item.src || item.url || item.path || ''}
                  ref={videoRef}
                  playing={videoPlaying.includes(item.id)}
                  onEnded={() => toggleVideo(item.id)}
                />
                <div
                  className={styles.message_video_icons}
                  onClick={e => {
                    e.stopPropagation()
                    toggleVideo(item.id)
                  }}
                >
                  {videoPlaying.includes(item.id) ? <IconPostPauseOutline /> : <IconPlayOutline color='#ffffff' />}
                </div>
              </div>
            )
          }
        }
        if (item.preview && typeof item.preview !== 'number') {
          if (item.preview.video_id) {
            if (item.preview.type === 'thumb')
              return item.preview.src ? (
                <div
                  className={styles.message_photo}
                  key={key}
                  onClick={() => {
                    if (item.locked === 1 && message.price > 0 && !message.is_purchased) {
                      purchaseMessage(message.id)
                    } else {
                      setPreviewOpen(true)
                    }
                  }}
                >
                  <img src={item.preview.src} alt='video preview' />
                  <div className={styles.message_video_icons}>
                    <IconPlayOutline color='#ffffff' />
                  </div>
                  {item.locked === 1 && message.price > 0 && !message.is_purchased && (
                    <button className={`${styles.message_buy_button} ${styles.message_buy_button_video}`}>
                      {t('buy')} ${message.price}
                    </button>
                  )}
                </div>
              ) : (
                <MessageProcessing key={key} recieved={recieved} />
              )
          }
          if (item.preview.type === 'clip' || item.preview.type === 'trimmed_video')
            return item.preview.src ? (
              <div
                className={styles.message_video}
                key={key}
                onClick={() => {
                  if (item.locked === 1 && message.price > 0 && !message.is_purchased) {
                    purchaseMessage(message.id)
                  } else {
                    setPreviewOpen(true)
                  }
                }}
              >
                <ReactPlayer
                  width={'100%'}
                  height={'100%'}
                  controls={false}
                  url={item.preview.src}
                  ref={videoRef}
                  playing={videoPlaying.includes(item.id)}
                  onEnded={() => toggleVideo(item.id)}
                />
                <div
                  className={styles.message_video_icons}
                  onClick={e => {
                    e.stopPropagation()
                    toggleVideo(item.id)
                  }}
                >
                  {videoPlaying.includes(item.id) ? <IconPostPauseOutline /> : <IconPlayOutline color='#ffffff' />}
                </div>
                {item.locked === 1 && message.price > 0 && !message.is_purchased && (
                  <button className={`${styles.message_buy_button} ${styles.message_buy_button_video}`}>
                    {t('buy')} ${message.price}
                  </button>
                )}
              </div>
            ) : (
              <MessageProcessing key={key} recieved={recieved} />
            )

          return item.preview.src ? (
            <div className={styles.message_photo} key={key} onClick={() => setPreviewOpen(true)}>
              <img src={item.preview.src || ''} alt='preview' />
              {item.locked === 1 && message.price > 0 && !message.is_purchased && (
                <button className={styles.message_buy_button}>
                  {t('buy')} ${message.price}
                </button>
              )}
            </div>
          ) : (
            <MessageProcessing key={key} recieved={recieved} />
          )
        }

        if (item.type === 'sound')
          return (
            <div className={styles.message_sound_wrapper} key={key}>
              {!message.replied_message && !sending && (
                <MessageOptions
                  message={message}
                  recieved={recieved}
                  setReply={setReply}
                  addReaction={addReaction}
                  deleteMessage={deleteMessage}
                  reportMessage={reportMessage}
                />
              )}
              <div className={styles.message_sound}>
                {renderReply()}
                <div className={styles.message_reactions_container}>{renderReactions()}</div>
                <AudioMessage
                  audioReady={true}
                  waveBackgroundColor='transparent'
                  waveHeight={30}
                  timerTextSize={12}
                  timerTextColor={recieved ? 'gray' : 'white'}
                  waveColor={recieved ? 'gray' : 'white'}
                  audioBlob={item.src || item.url || item.path || ''}
                  customClass={`${styles.message_sound_player} ${recieved ? styles.message_sound_player_recieved : ''}`}
                />
              </div>
            </div>
          )
      })
    }

    return null
  }

  return (
    <div
      className={`
      ${styles.message_container}
      ${styles.last_message_margin}
      ${recieved ? styles.message_container_recieved : ''}
      ${prev_recieved || next_recieved ? styles.message_grouped : ''}
      ${!next_recieved ? styles.message_grouped_first : ''}
      ${!sender ? styles.message_disabled : ''}
    `}
    >
      {showDate && (
        <div className={styles.message_group_date}>
          {todayDate ? t('Today') : yesterdayDate ? t('Yesterday') : dateString}
        </div>
      )}
      {recieved && !next_recieved && (
        <div className={styles.sender_info}>
          <div className={styles.sender_avatar}>
            {<img src={sender?.avatar?.url || avatarPlaceHolder} alt='avatar' />}
          </div>
          <div className={styles.sender_name}>{sender?.name || t('deletedUser')}</div>
        </div>
      )}
      {renderMedia()}
      {message.gif_id && (
        // <Gif gif={message.gif_id} width={270} noLink={true} />
        <GifLoader id={message.gif_id} />
      )}
      {previewOpen && (
        <FullscreenMessage
          media={mergedMediaArray.filter((item: any) => item.type !== 'sound') || []}
          closeFn={() => setPreviewOpen(false)}
        />
      )}
      {(message.text || message.body || message.message) && (
        <div className={styles.message_text_wrapper}>
          {!message.replied_message && !sending && (message.id ? message.id === messageId : true) && (
            <MessageOptions
              message={message}
              recieved={recieved}
              setReply={setReply}
              addReaction={addReaction}
              deleteMessage={deleteMessage}
              reportMessage={reportMessage}
            />
          )}
          <div
            className={styles.message_text_container}
            onClick={() => (setMessageId ? setMessageId(message.id) : null)}
          >
            {renderReply()}
            <div className={`${styles.message_text}`}>
              {message.text || message.body || message.message || ''}
              <div className={styles.message_reactions_container}>{renderReactions()}</div>
            </div>
          </div>
        </div>
      )}
      {!prev_recieved &&
        (sending ? (
          <div className={styles.message_time}>Sending...</div>
        ) : (
          <div className={styles.message_time_container}>
            <div className={styles.message_time}>
              {hours}:{minutes} {ampm}
            </div>

            {!recieved && (
              <div className={styles.message_checkmarks}>
                <spriteIcons.IconCheckmarkSm color={seen ? '#2F98FE' : '#B0B0B0'} />
                <spriteIcons.IconCheckmarkSm color={seen ? '#2F98FE' : '#B0B0B0'} />
              </div>
            )}
          </div>
        ))}
    </div>
  )
}

export default Message
