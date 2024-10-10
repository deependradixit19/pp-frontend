import { FC, useState, useEffect } from 'react'
import './_sentDM.scss'
import { Carousel } from 'react-responsive-carousel'
import { useTranslation } from 'react-i18next'
import { iMessage, iFile } from '../../../types/iTypes'
import { Icons } from '../../../helpers/icons'
import { AllIcons } from '../../../helpers/allIcons'
import { usePreviewContext } from '../../../context/previewContext'
import { useModalContext } from '../../../context/modalContext'

import 'react-responsive-carousel/lib/styles/carousel.min.css'

import ChatMediaFile from '../Common/ChatMediaFile'
import RepliedMessage from '../Common/RepliedMessage'
// import ConfirmModal from "../../../components/UI/Modal/ConfirmModal";
import ConfirmModal from '../../../components/UI/Modal/Confirm/ConfirmModal'
import AudioMessage from '../../../components/UI/AudioMessage/AudioMessage'

import { formatChatTime } from '../../../lib/dayjs'

const SentDM: FC<{
  message: iMessage
  sending?: boolean
  message_audio?: any
  sent: boolean
  attachedFiles?: Array<iFile>
  setReply: any
  sendingPreview?: Array<string>
  chatPosition?: any
  deleteMessage?: (val: number) => void
  tags?: Array<{
    id: number
    position: number
    user: any
  }>
}> = ({
  message,
  message_audio,
  sending,
  sent,
  attachedFiles,
  setReply,
  sendingPreview,
  chatPosition,
  deleteMessage,
  tags
}) => {
  const [filesCounter, setFilesCounter] = useState<{ [key: string]: number }>({
    imgs: 0,
    img: 0,
    vids: 0,
    vid: 0
  })
  const [activeFile, setActiveFile] = useState<string>('')

  const previewData = usePreviewContext()
  const modalData = useModalContext()
  const { t } = useTranslation()

  useEffect(() => {
    if (attachedFiles && attachedFiles.length > 0) {
      if (attachedFiles[0].url.includes('/image')) {
        setFilesCounter({
          imgs: message.photos.length,
          img: 1,
          vids: message.videos.length,
          vid: 0
        })
        setActiveFile('img')
      } else {
        setFilesCounter({
          imgs: message.photos.length,
          img: 0,
          vids: message.videos.length,
          vid: 1
        })
        setActiveFile('vid')
      }
    }
    //eslint-disable-next-line
  }, [])

  const toggleDeleteModal = () =>
    modalData.addModal(
      t('deleteTheMessage'),
      <ConfirmModal confirmFn={() => deleteMessage && deleteMessage(message.id)} />
    )

  const configMessageBody = () => <p>{message.body}</p>

  return (
    <div
      id={`${message.id}`}
      className={`sentDM ${chatPosition === 'first' ? 'sentDM__grouped--first' : ''} ${
        chatPosition === 'last' ? 'sentDM__grouped--last' : ''
      } ${chatPosition === 'mid' ? 'sentDM__grouped--mid' : ''}`}
    >
      {attachedFiles && attachedFiles.length > 0 && deleteMessage ? (
        <div className='sentDM__options sentDM__options--withAttachments'>
          <img
            src={AllIcons.chat_reply_outline}
            alt={t('replyToMessage')}
            onClick={() =>
              setReply({
                body: {
                  text: message.body,
                  attachedFiles: attachedFiles
                },
                id: message.id
              })
            }
          />
          <img src={AllIcons.chat_delete} alt={t('removeMessage')} onClick={() => toggleDeleteModal()} />
        </div>
      ) : (
        ''
      )}

      {message.replied_message ? <RepliedMessage type='sent' message={message.replied_message?.message} /> : ''}
      {attachedFiles && attachedFiles.length > 0 ? (
        <div className='sentDM__attachments'>
          <div className='cmFile__items cmFile__items--img'>
            {filesCounter.imgs > 0 ? (
              <div className={`cmFile__items__item ${activeFile === 'img' ? 'cmFile__items__item--active' : ''}`}>
                <img src={AllIcons.post_image} alt='Number of imgs' />
                <span>
                  {filesCounter.img} / {filesCounter.imgs}
                </span>
              </div>
            ) : (
              ''
            )}
            {filesCounter.vids > 0 ? (
              <div className={`cmFile__items__item ${activeFile === 'vid' ? 'cmFile__items__item--active' : ''}`}>
                <img src={AllIcons.post_video} alt='Number of vids' />
                <span>
                  {filesCounter.vid} / {filesCounter.vids}
                </span>
              </div>
            ) : (
              ''
            )}
          </div>

          <Carousel
            axis='horizontal'
            autoPlay={true}
            interval={600000}
            showArrows={false}
            showIndicators={false}
            infiniteLoop={false}
            showThumbs={false}
            showStatus={false}
            onChange={data => {
              if (attachedFiles[data].url.includes('/image')) {
                setActiveFile('img')
                setFilesCounter({
                  ...filesCounter,
                  img: attachedFiles.filter((item: any) => item.url.includes('/image')).indexOf(attachedFiles[data]) + 1
                })
              } else {
                setActiveFile('vid')
                setFilesCounter({
                  ...filesCounter,
                  vid: attachedFiles.filter((item: any) => item.url.includes('/vide')).indexOf(attachedFiles[data]) + 1
                })
              }
            }}
          >
            {attachedFiles?.map(
              (
                item: {
                  id: number
                  order: number
                  thumbnail_src?: string | null
                  url: string
                },
                key: number
              ) => {
                if (item.url.includes('/images')) {
                  return (
                    <div
                      className='cmFile__wrapper'
                      key={key}
                      onClick={() => previewData.addModal(attachedFiles, 'just-view', null, key)}
                    >
                      <ChatMediaFile key={key} type='image' path={item.url} allFiles={attachedFiles} itemNumber={key} />
                    </div>
                  )
                } else if (item.url.includes('/videos')) {
                  return (
                    <div
                      className='cmFile__wrapper'
                      onClick={() => previewData.addModal(attachedFiles, 'just-view', null, key)}
                      key={key}
                    >
                      <ChatMediaFile key={key} type='video' path={item.url} allFiles={attachedFiles} itemNumber={key} />
                    </div>
                  )
                } else {
                  return <div>default</div>
                }
              }
            )}
          </Carousel>
        </div>
      ) : (
        ''
      )}
      {sendingPreview && sendingPreview.length > 0 ? (
        <div className='sentDM__attachments'>
          <Carousel
            axis='horizontal'
            autoPlay={true}
            interval={600000}
            showArrows={false}
            showIndicators={false}
            infiniteLoop={true}
            showThumbs={false}
            showStatus={false}
          >
            {sendingPreview?.map((item: string, key: number) => {
              return <ChatMediaFile key={key} type='image' path={item} allFiles={[]} itemNumber={key} />
            })}
          </Carousel>
        </div>
      ) : (
        ''
      )}
      {message.body ? (
        <div className='sentDM__message'>
          {configMessageBody()}
          {message_audio ? (
            <div className='sentDM__message__audio'>
              <AudioMessage
                audioBlob={message_audio}
                audioReady={true}
                waveColor='white'
                processing={true}
                percentage={100}
                uploadError={'error'}
              />
            </div>
          ) : (
            ''
          )}

          {attachedFiles && attachedFiles.length === 0 && deleteMessage ? (
            <div className='sentDM__options'>
              <img
                src={AllIcons.chat_reply_outline}
                alt={t('replyToMessage')}
                onClick={() =>
                  setReply({
                    body: {
                      text: message.body,
                      attachedFiles: attachedFiles
                    },
                    id: message.id
                  })
                }
              />
              <img src={AllIcons.chat_delete} alt={t('removeMessage')} onClick={() => toggleDeleteModal()} />
            </div>
          ) : (
            ''
          )}
        </div>
      ) : (
        ''
      )}
      <div className='sentDM__status'>
        {!sending && (chatPosition === 'first' || !chatPosition) ? (
          <p className='sentDM__status__time'>{formatChatTime(message.created_at.split('T')[0])}</p>
        ) : (
          ''
        )}
        {chatPosition === 'first' || !chatPosition ? (
          <div className='sentDM__status__ticked'>
            {!message.is_seen ? (
              sending && !sent ? (
                <div className='sentDM__status__sending'>
                  {t('sending')}
                  <div className='sentDM__status__sending__dots' />
                </div>
              ) : (
                <>
                  <img src={Icons.tickedGreyLeft} alt={t('sent')} />
                  <img src={Icons.tickedGreyRight} alt={t('sent')} />
                </>
              )
            ) : (
              <>
                <img src={Icons.tickedBlueLeft} alt={t('seen')} />
                <img src={Icons.tickedBlueRight} alt={t('seen')} />
              </>
            )}
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}
export default SentDM
