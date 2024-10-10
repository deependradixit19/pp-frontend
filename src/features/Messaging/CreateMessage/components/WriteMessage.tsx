import { FC, useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react'
import './_writeMessage.scss'
import { useReactMediaRecorder } from 'react-media-recorder'
import EmojiPicker from 'emoji-picker-react'
import { useTranslation } from 'react-i18next'

import { IMessage } from '../../../../types/interfaces/IMessage'
import { useModalContext } from '../../../../context/modalContext'

import { Icons } from '../../../../helpers/icons'
import { AllIcons } from '../../../../helpers/allIcons'

import IconButton from '../../../../components/UI/Buttons/IconButton'
import AudioMessage from '../../../../components/UI/AudioMessage/AudioMessage'

import PostMediaRecorder from '../../../../features/MediaRecorder/MediaRecorder'
import { randomString } from '../../../../helpers/util'
import { IconCalendarOutlineDot, IconClose, IconGif } from '../../../../assets/svg/sprite'
import { IProgressInfo } from '../../../../types/interfaces/ITypes'
import SharedMediaModal from '../../../../components/UI/Modal/SharedMediaModal/SharedMediaModal'
import DateModal from '../../../../components/UI/Modal/Date/DateModal'
import ScheduledInfoBubble from '../../../../pages/story/components/ScheduledInfoBubble/ScheduledInfoBubble'
import { useUserContext } from '../../../../context/userContext'

const WriteMessage: FC<{
  message: IMessage
  setMessage: (message: any) => void
  uploadMedia: (data: File[]) => void
  sendMessage: () => void
  customClass?: string
  sending?: boolean
  selectFiles?: (data: ChangeEvent<HTMLInputElement>) => void
  selectedFiles: File[]
  setSelectedFiles: any
  setProgressInfos: any
  progressInfos: { val: IProgressInfo[] }
  setGifOpen: () => void
  hasGif: boolean
  removeFile: any
  setSchedule: (val: string) => void
  schedule: string
  setReply?: (
    val: {
      body: string
      id: string | number
      message: any
      recieved: boolean
    } | null
  ) => void
  onFocusIn?: (val: string) => void
  onFocusOut?: (val: string) => void
  disabled?: boolean
}> = ({
  message,
  setMessage,
  uploadMedia,
  sendMessage,
  customClass,
  sending,
  selectFiles,
  selectedFiles,
  setSelectedFiles,
  setProgressInfos,
  progressInfos,
  setGifOpen,
  hasGif,
  removeFile,
  setSchedule,
  schedule,
  onFocusIn,
  onFocusOut,
  setReply,
  disabled
}) => {
  const [toggleEmojiPicker, setToggleEmojiPicker] = useState<boolean>(false)
  const [recording, setRecording] = useState<boolean>(false)
  const [tagsActive, setTagsActive] = useState<boolean>(false)
  const [recorderType, setRecorderType] = useState<string | null>(null)
  const [recordedChunks, setRecordedChunks] = useState([])
  const userData = useUserContext()

  const formBtnRef = useRef<HTMLButtonElement>(null)
  const [chatUsers, setChatUsers] = useState<{
    all: Array<any>
    filter: string
    filteredUsers: Array<any>
  }>({
    all: [],
    filter: '',
    filteredUsers: []
  })

  const { startRecording, stopRecording, mediaBlobUrl, status } = useReactMediaRecorder({
    audio: true,
    video: recorderType === 'video'
  })

  const modalData = useModalContext()
  const postMediaRef = useRef<HTMLInputElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const { t } = useTranslation()

  useEffect(() => {
    const buttons = document.querySelectorAll('.epr-emoji')

    if (toggleEmojiPicker) {
      buttons.forEach(button => {
        button.setAttribute('type', 'button')
      })
    }
  }, [toggleEmojiPicker])

  useEffect(() => {
    const convertBlob = (blob: any) => {
      const file = new File([blob[0]], randomString(blob[0].type), {
        type: blob[0].type
      })

      setSelectedFiles([...selectedFiles, file])
      uploadMedia([file])
      setProgressInfos({ val: [...progressInfos.val] })
      setRecordedChunks([])
    }

    if (recordedChunks.length) convertBlob(recordedChunks)
  }, [recordedChunks])

  useEffect(() => {
    if (tagsActive) {
      setChatUsers({
        ...chatUsers,
        filteredUsers: chatUsers.all.filter(
          user => user.name.includes(chatUsers.filter) || user.username.includes(chatUsers.filter)
        )
      })
    }
  }, [chatUsers.filter])

  const onEmojiClick = (emojiObject: { emoji: string }) => {
    let newText = `${message.text}${emojiObject.emoji}`

    setMessage({ ...message, text: newText })
  }

  useEffect(() => {
    const convertBlob = async (blob: any) => {
      let file = await fetch(blob)
        .then(r => r.blob())
        .then(blobFile => {
          return new File([blobFile], randomString(blobFile.type), {
            type: blobFile.type
          })
        })

      setSelectedFiles([...selectedFiles, file])
      uploadMedia([file])
      setProgressInfos({ val: [...progressInfos.val] })
      setRecordedChunks([])
    }

    if (mediaBlobUrl) convertBlob(mediaBlobUrl)
  }, [mediaBlobUrl])

  useEffect(() => {
    if (progressInfos.val.filter((item: IProgressInfo) => item.type === 'sound' || item.type === 'audio').length > 0) {
      setMessage((prevState: any) => {
        const object = { ...prevState, text: '' }
        return object
      })
    }
  }, [progressInfos])

  const submitHandler = (e: FormEvent) => {
    e.preventDefault()

    setToggleEmojiPicker(false)
    sendMessage()
    if (setReply) {
      setReply(null)
    }
    setProgressInfos({ val: [] })
    setSelectedFiles([])
    setMessage({
      text: '',
      audioMessage: null,
      audioPreview: null,
      price: 0,
      media: [],
      previewMedia: [],
      vaultImages: []
    })
    if (textAreaRef.current) {
      textAreaRef.current.style.height = '50px'
    }
  }

  return (
    <form
      className={`writeMessage ${customClass ? customClass : ''} ${
        message.vaultImages?.length === 0 ? '' : 'writeMessage--small'
      }
        ${recorderType ? 'writeMessage--recording' : ''}
        ${disabled ? 'writeMessage--disabled' : ''}
      `}
    >
      <div className='writeMessage__top'>
        <div className='writeMessage__field'>
          {progressInfos.val.filter((item: IProgressInfo) => item.type === 'sound' || item.type === 'audio').length >
            0 && (
            <div className='write-message-audio-preview'>
              <div
                className='write-message-audio-preview-remove'
                onClick={() =>
                  removeFile(
                    selectedFiles.indexOf(selectedFiles.filter((item: File) => item.type.includes('audio'))[0])
                  )
                }
              >
                <IconClose color='#778797' />
              </div>
              <div className='write-message-audio-preview-wrapper'>
                <AudioMessage
                  audioReady={true}
                  audioBlob={
                    progressInfos.val.filter((item: IProgressInfo) => item.type === 'sound' || item.type === 'audio')[0]
                      .previewUrl
                  }
                  timerTextColor='#ffffff'
                />
              </div>
            </div>
          )}

          <>
            <textarea
              ref={textAreaRef}
              onKeyPress={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  if (formBtnRef.current) {
                    formBtnRef.current.click()
                  }
                }
              }}
              disabled={
                progressInfos.val.filter((item: IProgressInfo) => item.type === 'sound' || item.type === 'audio')
                  .length > 0
              }
              onFocus={() => (onFocusIn ? onFocusIn(message.text) : null)}
              onBlur={() => (onFocusOut ? onFocusOut(message.text) : null)}
              onChange={e => {
                setMessage({ ...message, text: e.target.value })
                if (textAreaRef.current) {
                  textAreaRef.current.style.height = '50px'
                  const computed = window.getComputedStyle(textAreaRef.current)
                  const lines = Math.floor(
                    textAreaRef.current.scrollHeight / parseInt(computed.getPropertyValue('line-height'), 10)
                  )

                  if (lines > 2) {
                    const height = textAreaRef.current.scrollHeight + 19
                    textAreaRef.current.style.height = `${Math.min(height, 165)}px`
                  }
                }
              }}
              onKeyDown={e => {
                if (!tagsActive) {
                  if (e.keyCode === 50 && e.key === '@') {
                    setTagsActive(true)
                  }
                } else {
                  if (e.keyCode === 50 && e.key === '@') {
                    setTagsActive(false)
                    setChatUsers({
                      ...chatUsers,
                      filter: '',
                      filteredUsers: []
                    })
                  } else if (e.keyCode === 32) {
                    setTagsActive(false)
                    setChatUsers({
                      ...chatUsers,
                      filter: '',
                      filteredUsers: []
                    })
                  } else if (e.keyCode === 8) {
                    if (chatUsers.filter.length === 0) {
                      setTagsActive(false)
                      setChatUsers({
                        ...chatUsers,
                        filter: '',
                        filteredUsers: []
                      })
                    } else {
                      setChatUsers({
                        ...chatUsers,
                        filter: chatUsers.filter.slice(0, -1),
                        filteredUsers: []
                      })
                      setMessage({
                        ...message,
                        text: message.text.slice(0, -1)
                      })
                    }
                  } else {
                    if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90)) {
                      setChatUsers({
                        ...chatUsers,
                        filter: `${chatUsers.filter}${e.key}`
                      })
                    } else return
                  }
                }
              }}
              value={message.text}
              placeholder={`${t('message')}...`}
            />
            <img
              src={Icons.smile}
              alt={t('smile')}
              className={`writeMessage__field--smile ${hasGif ? 'writeMessage__field--smile--gif' : ''}`}
              onClick={() => setToggleEmojiPicker(!toggleEmojiPicker)}
            />
            {hasGif && (
              <div className='writeMessage__field--gif' onClick={setGifOpen}>
                <IconGif />
              </div>
            )}
            {toggleEmojiPicker && (
              <div className='emojiPicker'>
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </>
        </div>
        <button
          type='submit'
          onClick={submitHandler}
          ref={formBtnRef}
          disabled={disabled || (!message.text && !selectedFiles.length)}
          className={`writeMessage__sendBtn${sending ? ' writeMessage__sendBtn--sending' : ''} ${
            disabled || (!message.text && !selectedFiles.length) ? 'writeMessage__sendBtn--disabled' : ''
          }`}
        >
          <img src={Icons.lightSend} alt={t('send')} />
        </button>
      </div>
      {message.vaultImages?.length === 0 ? (
        <div className='writeMessage__bot'>
          <IconButton
            icon={Icons.chat_img}
            clickFn={() => postMediaRef.current!.click()}
            desc={t('addMedia')}
            customClass='writeMessage__bot__btn'
            input={
              <input
                ref={postMediaRef}
                type='file'
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  selectFiles && selectFiles(e)
                }}
                multiple={true}
                id='message__file__upload'
                accept='image/*'
                hidden={true}
                key={Math.random().toString(36)}
              />
            }
          />
          {userData.role === 'model' && (
            <IconButton
              icon={Icons.chat_imgb}
              clickFn={() =>
                modalData.addModal(
                  '',
                  <SharedMediaModal
                    submitFn={(val: any) => {
                      const media: any = []
                      for (let i = 0; i < val.length; i++) {
                        if (val[i].message?.message) {
                          val[i].message.message.photos.forEach((photo: any) =>
                            media.push({
                              ...photo,
                              percentage: 100,
                              previewUrl: photo.url,
                              storageUrl: photo.url,
                              fileName: `shared-photo-${photo.id}`,
                              type: 'photo'
                            })
                          )
                          val[i].message.message.videos.forEach((video: any) =>
                            media.push({
                              ...video,
                              percentage: 100,
                              previewUrl: video.url,
                              storageUrl: video.url,
                              fileName: `shared-photo-${video.id}`,
                              type: 'video'
                            })
                          )
                        }
                        if (val[i].post) {
                          val[i].post.photos.forEach((photo: any) =>
                            media.push({
                              ...photo,
                              percentage: 100,
                              previewUrl: photo.url,
                              storageUrl: photo.url,
                              fileName: `shared-photo-${photo.id}`,
                              type: 'photo'
                            })
                          )
                          val[i].post.videos.forEach((video: any) =>
                            media.push({
                              ...video,
                              percentage: 100,
                              previewUrl: video.url,
                              storageUrl: video.url,
                              fileName: `shared-photo-${video.id}`,
                              type: 'video'
                            })
                          )
                        }
                      }

                      const mergedMedia = [].concat.apply([], media)

                      mergedMedia.forEach((item: any) => (item['percentage'] = 100))
                      setProgressInfos({
                        val: [...progressInfos.val, ...mergedMedia]
                      })
                      setSelectedFiles([...selectedFiles, ...mergedMedia])
                    }}
                  />,
                  true
                )
              }
              desc='Idk'
              customClass='writeMessage__bot__btn'
            />
          )}
          {!recording ? (
            <IconButton
              icon={Icons.chat_mic}
              desc={t('recordAudioMessage')}
              customClass='writeMessage__bot__btn'
              clickFn={() => {
                setRecorderType('audio')
              }}
            />
          ) : (
            <IconButton
              icon={AllIcons.video_pause}
              desc={t('stopRecording')}
              customClass='writeMessage__bot__btn writeMessage__bot__btn--audiopause'
              clickFn={() => {
                stopRecording()
                setRecording(false)
              }}
            />
          )}
          <IconButton
            icon={Icons.chat_vid}
            clickFn={() => setRecorderType('video')}
            desc={t('addVideoFiles')}
            customClass='writeMessage__bot__btn'
          />
          <div
            onClick={() =>
              modalData.addModal(t('scheduleMessage'), <DateModal confirmFn={(val: any) => setSchedule(val)} />)
            }
          >
            <IconCalendarOutlineDot color={schedule === '' ? '#778797' : '#2894FF'} />
          </div>
          {schedule !== '' && (
            <div className='write-message-schedule-message'>
              <ScheduledInfoBubble
                customClass='write-message-schedule-message-bubble'
                removeSchedule={() => setSchedule('')}
                date={new Date(schedule)}
              />
            </div>
          )}
        </div>
      ) : (
        ''
      )}

      {recorderType && (
        <PostMediaRecorder
          status={status}
          type={recorderType}
          handleClose={() => setRecorderType(null)}
          setRecordedChunks={data => setRecordedChunks(data)}
          handleAudioStart={() => startRecording()}
          handleAudioStop={() => stopRecording()}
        />
      )}
    </form>
  )
}

export default WriteMessage
