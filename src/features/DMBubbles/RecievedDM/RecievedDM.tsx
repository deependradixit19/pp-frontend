import { FC, useEffect, useState } from 'react'
import './_recievedDM.scss'
import { useNavigate } from 'react-router-dom'
import { Carousel } from 'react-responsive-carousel'
import { useTranslation } from 'react-i18next'
import { iMessage } from '../../../types/iTypes'
import { AllIcons as Icons } from '../../../helpers/allIcons'
import { useUserContext } from '../../../context/userContext'
import { usePreviewContext } from '../../../context/previewContext'

import 'react-responsive-carousel/lib/styles/carousel.min.css'

import ReactionStats from '../Common/ReactionStats'
import ChatMediaFile from '../Common/ChatMediaFile'
import RepliedMessage from '../Common/RepliedMessage'

import { formatChatTime } from '../../../lib/dayjs'

import placeholderAvatar from '../../../assets/images/user_placeholder.png'

const RecievedDM: FC<{
  message: iMessage
  sender: {
    avatar: {
      created_at: string
      id: number
      url: string
    }
    croppedAvatar: {
      created_at: string
      id: number
      url: string
    }
    id: number
    name: string
    username: string
  }
  attachedFiles?: Array<{
    id: number
    order: number
    thumbnail_src?: string | null
    url: string
  }>
  setReply: any
  allReactions: { [key: string]: { count: number; users: Array<any> } }
  addReaction: (type: string, message_id: number) => void
  chatPosition?: string
}> = ({ message, sender, attachedFiles, setReply, allReactions, addReaction, chatPosition }) => {
  const [reactions, setReactions] = useState<any>({
    love: { count: 0, users: [] },
    smile: { count: 0, users: [] },
    kiss: { count: 0, users: [] },
    cry: { count: 0, users: [] },
    sad: { count: 0, users: [] },
    like: { count: 0, users: [] }
  })
  const [filesCounter, setFilesCounter] = useState<{ [key: string]: number }>({
    imgs: 0,
    img: 0,
    vids: 0,
    vid: 0
  })
  const [activeFile, setActiveFile] = useState<string>('')
  const [reactActive, setReactActive] = useState<boolean>(false)

  const userData = useUserContext()
  const previewData = usePreviewContext()
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    setReactions(allReactions)
  }, [allReactions])
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

  const updateReactions = (name: string) => {
    for (const x in reactions) {
      if (reactions[x].users.find((user: any) => user.id === userData.id)) {
        if (x === name) {
          return setReactions({
            ...reactions,
            [name]: {
              count: reactions[name].count - 1,
              users: reactions[name].users.filter((user: any) => user.id === userData.id)
            }
          })
        } else {
          return setReactions({
            ...reactions,
            [x]: {
              count: reactions[x].count - 1,
              users: reactions[x].users.filter((user: any) => user.id === userData.id)
            },
            [name]: {
              count: reactions[name].count + 1,
              users: [...reactions[name].users, userData]
            }
          })
        }
      }
    }

    return setReactions({
      ...reactions,
      [name]: {
        count: reactions[name].count + 1,
        users: [reactions[name].users, userData]
      }
    })
  }

  const reactionElements = [
    {
      icon: Icons.emoji_heart,
      alt: t('love'),
      click: () => {
        updateReactions(t('love'))
        addReaction(t('love'), message.id)
      }
    },
    {
      icon: Icons.emoji_grin,
      alt: t('smile'),
      click: () => {
        updateReactions(t('smile'))
        addReaction(t('smile'), message.id)
      }
    },
    {
      icon: Icons.emoji_kiss,
      alt: t('kiss'),
      click: () => {
        updateReactions(t('kiss'))
        addReaction(t('kiss'), message.id)
      }
    },
    {
      icon: Icons.emoji_tear,
      alt: t('cry'),
      click: () => {
        updateReactions(t('kiss'))
        addReaction(t('kiss'), message.id)
      }
    },
    {
      icon: Icons.emoji_sad,
      alt: t('sad'),
      click: () => {
        updateReactions(t('sad'))
        addReaction(t('sad'), message.id)
      }
    },
    {
      icon: Icons.emoji_like,
      alt: t('like'),
      click: () => {
        updateReactions(t('like'))
        addReaction(t('like'), message.id)
      }
    }
  ]

  return (
    <div
      id={`${message.id}`}
      className={`receivedDM ${chatPosition === 'first' ? 'receivedDM__grouped--first' : ''} ${
        chatPosition === 'last' ? 'receivedDM__grouped--last' : ''
      } ${chatPosition === 'mid' ? 'receivedDM__grouped--mid' : ''}`}
    >
      {message.replied_message ? <RepliedMessage type='received' message={message.replied_message?.message} /> : ''}
      <div className='receivedDM__user'>
        {chatPosition === 'last' || !chatPosition ? (
          <>
            <div className='receivedDM__user--image' onClick={() => navigate(`/profile/${sender.id}/all`)}>
              <img src={sender.croppedAvatar.url || sender.avatar.url || placeholderAvatar} alt={t('avatar')} />
            </div>
            <p className='receivedDM__user--username'>{sender.username}</p>
          </>
        ) : (
          ''
        )}
      </div>

      {attachedFiles && attachedFiles?.length > 0 ? (
        <div className='receivedDM__attachments'>
          <div className='cmFile__items cmFile__items--img'>
            {filesCounter.imgs > 0 ? (
              <div className={`cmFile__items__item ${activeFile === 'img' ? 'cmFile__items__item--active' : ''}`}>
                <img src={Icons.post_image} alt={t('numberOfImages')} />
                <span>
                  {filesCounter.img} / {filesCounter.imgs}
                </span>
              </div>
            ) : (
              ''
            )}
            {filesCounter.vids > 0 ? (
              <div className={`cmFile__items__item ${activeFile === 'vid' ? 'cmFile__items__item--active' : ''}`}>
                <img src={Icons.post_video} alt={t('numberOfVideos')} />
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
            onChange={key => {
              if (attachedFiles[key].url.includes('/image')) {
                setActiveFile('img')
                setFilesCounter({
                  ...filesCounter,
                  img: attachedFiles.filter((item: any) => item.url.includes('/image')).indexOf(attachedFiles[key]) + 1
                })
              } else {
                setActiveFile('vid')
                setFilesCounter({
                  ...filesCounter,
                  vid: attachedFiles.filter((item: any) => item.url.includes('/video')).indexOf(attachedFiles[key]) + 1
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
                      onClick={() => previewData.addModal(attachedFiles, 'just-view', key)}
                    >
                      <ChatMediaFile type='image' path={item.url} allFiles={attachedFiles} itemNumber={key} />
                    </div>
                  )
                } else if (item.url.includes('/videos')) {
                  return (
                    <div
                      key={key}
                      className='cmFile__wrapper'
                      onClick={() => previewData.addModal(attachedFiles, 'just-view', key)}
                    >
                      <ChatMediaFile type='video' path={item.url} allFiles={attachedFiles} itemNumber={key} />{' '}
                    </div>
                  )
                } else {
                  return <div key={key}>default</div>
                }
              }
            )}
          </Carousel>
        </div>
      ) : (
        ''
      )}
      <div className='receivedDM__message'>
        {message.body ? <p className='receivedDM__message__text'>{message.body}</p> : ''}
        {chatPosition === 'first' || !chatPosition ? (
          <p className='receivedDM__time'>{formatChatTime(message.created_at)}</p>
        ) : (
          ''
        )}
        {(reactions.love.count > 0 ||
          reactions.smile.count > 0 ||
          reactions.kiss.count > 0 ||
          reactions.cry.count > 0 ||
          reactions.sad.count > 0 ||
          reactions.like.count > 0) && <ReactionStats type='received' reactions={reactions} />}
        <div
          className={`receivedDM__options${
            message.photos.length > 0 || message.videos.length > 0 ? ' receivedDM__options--withfiles' : ''
          }`}
        >
          <img
            src={Icons.chat_react}
            alt={t('reactToMessage')}
            onClick={() => {
              setReactActive(!reactActive)
            }}
          />
          <img
            src={Icons.chat_reply}
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
          <img src={Icons.chat_options} alt={t('toggleOptions')} />
        </div>
      </div>
      <div className={`receivedDM__react ${reactActive ? 'receivedDM__react--active' : ''}`}>
        {reactionElements.map((item, key) => (
          <img
            key={key}
            src={item.icon}
            alt={item.alt}
            onClick={() => {
              item.click()
              setReactActive(false)
            }}
          />
        ))}
      </div>
    </div>
  )
}
export default RecievedDM
