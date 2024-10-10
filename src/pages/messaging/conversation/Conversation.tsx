import { FC, useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Pusher from 'pusher-js'
import { useInfiniteQuery, useQueryClient, useMutation, useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import LayoutHeader from '../../../features/LayoutHeader/LayoutHeader'
import InboxContainer from '../../../features/Messaging/InboxContainer/InboxContainer'
import BasicLayout from '../../../layouts/basicLayout/BasicLayout'
import WithHeaderSection from '../../../layouts/WithHeaderSection/WithHeaderSection'
import {
  getChatMessages,
  sendChatMessage,
  typing,
  notTyping,
  reactToMessage,
  deleteChatMessage,
  deleteChat,
  muteConversation
} from '../../../services/endpoints/api_messages'
import Message from '../../../features/Messaging/Message/Message'
import CreateMessage from '../../../features/Messaging/CreateMessage/CreateMessage'
import style from './_conversation.module.scss'
import { useUserContext } from '../../../context/userContext'
import * as spriteIcons from '../../../assets/svg/sprite'
import { getAccessToken } from '../../../services/storage/storage'
import { getPerformer } from '../../../services/endpoints/profile'
import TypingStatus from '../../../features/Messaging/TypingStatus/TypingStatus'
import { useModalContext } from '../../../context/modalContext'
import BlockUser from '../../../components/UI/Modal/BlockUser/BlockUser'
import { addToast } from '../../../components/Common/Toast/Toast'
import ConfirmModal from '../../../components/UI/Modal/Confirm/ConfirmModal'
import avatarPlaceHolder from '../../../assets/images/user_placeholder.png'
import SharedMediaModal from '../../../components/UI/Modal/SharedMediaModal/SharedMediaModal'
import { getReportTypes, reportMessage } from '../../../services/endpoints/report'
import UserDetails from '../../../components/UI/Modal/UserDetails/UserDetails'
import { purchaseMessage } from '../../../services/endpoints/api_messages'
import { getBannedWords, putBannedWord } from '../../../services/endpoints/api_global'
import Report from '../../../components/UI/Modal/Report/Report'
import TipModal from '../../../components/UI/Modal/Tip/TipModal'

const Conversation: FC = () => {
  const { id } = useParams<any>()

  const [messages, setMessages] = useState<any>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchText, setSearchText] = useState('')
  const [messageId, setMessageId] = useState<number | null>(null)
  const [conversationId, setConversationId] = useState<number | null>(null)
  const [typingUsers, setTypingUsers] = useState<{ avatar: string; id: number; name: string; username: string }[]>([])
  const [reply, setReply] = useState<any>(null)

  const { t } = useTranslation()
  const userData = useUserContext()
  const modalData = useModalContext()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const inboxRef = useRef<HTMLDivElement>(null)

  const { data: otherUserData, isLoading: isLoadingOtherUser } = useQuery(['profile', id], () => getPerformer(id), {
    onSuccess: resp => {
      if (resp.conversation_id) {
        setConversationId(resp.conversation_id)
      } else {
        const convId = sessionStorage.getItem(`convId-${resp.id}`)
        if (convId) {
          setConversationId(parseFloat(convId))
        }
      }
    },
    onError: () => {
      addToast('error', t('userDoesntExist'))
      navigate('/messages/inbox', { replace: true })
    }
  })

  const { data: reportTypesData } = useQuery(['reportTypes', 'content'], () => getReportTypes('content'))

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } = useInfiniteQuery(
    ['conversation', conversationId, searchTerm],
    ({ pageParam = 1 }) =>
      getChatMessages(conversationId, {
        page: pageParam,
        search: searchTerm.trim() === '' ? null : searchTerm
      }),
    {
      enabled: !!conversationId,
      getNextPageParam: lastPage => {
        const current = lastPage.meta?.current_page
        const last = lastPage.meta?.last_page
        if (current && last && current < last) return current + 1
      }
    }
  )

  const { data: bannedWordsData } = useQuery('banned-words', getBannedWords)

  const addMessageMutation = useMutation(
    (newMessage: any) => sendChatMessage(newMessage.message, newMessage.recipients),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('conversation')
      }
    }
  )
  const addReactionMutation = useMutation((message: { type: string; id: number }) =>
    reactToMessage(message.type, message.id)
  )
  const deleteConversationMutation = useMutation(() => deleteChat(conversationId), {
    onSuccess: () => {
      addToast('success', t('deleted'))
      queryClient.invalidateQueries('conversations')
      navigate('/messages/inbox', { replace: true })
    }
  })
  const muteConversationMutation = useMutation(
    () =>
      muteConversation({
        new_message: otherUserData?.is_muted ? 0 : 1,
        other_user_id: otherUserData.id
      }),
    {
      onSuccess: () => {
        addToast('success', otherUserData?.is_muted ? t('unmuted') : t('muted'))
        queryClient.invalidateQueries(['profile', id])
      }
    }
  )

  const purchaseMutation = useMutation((id: number) => purchaseMessage({ message_id: id, payment_method: 'deposit' }), {
    onSuccess: resp => {
      setMessages((prevState: any) => {
        let array = [...prevState]
        const message = array.filter((item: any) => item.message.id === resp.data.message.id)[0]
        const index = array.indexOf(message)
        array[index] = resp.data

        return [...array]
      })
    }
  })

  const reportMutation = useMutation(
    (params: { id: number; report_type_id: number; text: string }) =>
      reportMessage(params.id, {
        report_type_id: params.report_type_id,
        text: params.text
      }),
    {
      onSuccess: () => {
        modalData.clearModal()
        addToast('success', t('messageReported'))
      }
    }
  )

  const addTip = () => {
    modalData.addModal(
      t('tipAmount'),
      <TipModal
        modelData={{
          modelId: otherUserData.id,
          avatarSrc: otherUserData.avatar.url
        }}
      />
    )
  }

  const addReaction = useCallback(
    (type: string, reactionId: number) => {
      if (userData.status === 'restricted') {
        addToast('error', t('messageReactRestricted'))
        return
      }
      const targetMessage = messages.filter((message: any) => message.message.id === reactionId)[0]
      if (targetMessage) {
        const index = messages.indexOf(targetMessage)
        if (messages[index].reactions[type].users.filter((user: any) => user.id === userData.id).length === 0) {
          const allReactionsKeys = Object.keys(messages[index].reactions)
          setMessages((prevState: any) => {
            const array = [...prevState]
            for (let i = 0; i < allReactionsKeys.length; i++) {
              if (array[index].reactions[allReactionsKeys[i]].users.filter((user: any) => user.id === userData.id)) {
                array[index].reactions[allReactionsKeys[i]].users = array[index].reactions[
                  allReactionsKeys[i]
                ].users.filter((user: any) => user.id !== userData.id)
                if (array[index].reactions[allReactionsKeys[i]].count > 0) {
                  array[index].reactions[allReactionsKeys[i]].count =
                    array[index].reactions[allReactionsKeys[i]].count - 1
                }
              }
            }
            array[index].reactions[type].users = [...array[index].reactions[type].users, userData]
            array[index].reactions[type].count = array[index].reactions[type].count + 1

            return array
          })
        } else {
          setMessages((prevState: any) => {
            const array = [...prevState]
            array[index].reactions[type].users = array[index].reactions[type].users.filter(
              (user: any) => user.id !== userData.id
            )
            array[index].reactions[type].count = array[index].reactions[type].count - 1
            return array
          })
        }

        addReactionMutation.mutate({ type, id: reactionId })
      }
    },
    [messages]
  )

  const deleteMessage = useCallback(
    (id: number) => {
      setMessages((prevState: any) => {
        const array = [...prevState]
        const filtered = array.filter((message: any) => message.message.id !== id)

        return filtered
      })

      deleteChatMessage(id)
    },
    [messages]
  )
  const focusIn = (val: string) => {
    if (conversationId) {
      typing(conversationId)
    }
  }

  const focusOut = () => {
    if (conversationId) {
      notTyping(conversationId)
    }
  }

  const observer = useRef<IntersectionObserver>()

  const lastMessageRef = useCallback(
    (node: any) => {
      if (isFetchingNextPage || isLoading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage()
          }
        },
        { rootMargin: '150px' }
      )

      if (node) observer.current.observe(node)
    },
    [isFetchingNextPage, isLoading, hasNextPage]
  )

  useEffect(() => {
    if (!isLoading && data) {
      let tempData = []
      if (data.pages[0]?.data) {
        tempData = data.pages.map((page: any) => page.data)
      }
      const merged: any = [].concat.apply([], tempData)

      setMessages(merged)
    }
  }, [data, isLoading])

  let timeout: any = null

  useEffect(() => {
    clearTimeout(timeout)
    timeout = setTimeout(() => setSearchTerm(searchText), 500)

    return () => clearTimeout(timeout)
  }, [searchText])

  const token = getAccessToken()

  useEffect(() => {
    if (!process.env.REACT_APP_PUSHER_KEY || !process.env.REACT_APP_PUSHER_CLUSTER || !token || !conversationId) {
      return
    }

    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: process.env.REACT_APP_PUSHER_CLUSTER,
      authEndpoint: `${process.env.REACT_APP_API_URL}/api/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    })

    const chatChannel = pusher.subscribe(`presence-chat.conversation.${userData.id}`)

    chatChannel.bind_global((eventName: string, data: any) => {
      if (data?.notification_type) {
        if (data.notification_type === 'new-message' && data.message?.conversation_id === conversationId) {
          setMessages((prevState: any) => {
            let array = [...prevState]
            const filtered = array.filter((item: any) => !!item.sending)

            if (filtered.length > 0) {
              const index = array.indexOf(filtered[filtered.length - 1])
              array[index] = data
            } else {
              const filterExisting = array.filter((item: any) => item.message.id === data.message.id)
              if (filterExisting.length === 0) {
                array.unshift(data)
              }
            }

            return [...array]
          })
        }
        if (data.notification_type === 'delete-message') {
          setMessages((prevState: any) => {
            const array = [...prevState]
            const filtered = array.filter((item: any) => item.message.id !== data.message.id)

            return [...filtered]
          })
        }
        if (data.notification_type === 'reaction') {
          setMessages((prevState: any) => {
            let array = [...prevState]
            const reactedItem = array.filter((item: any) => item.message.id === data.message.message.id)
            const index = array.indexOf(reactedItem[0])
            array[index] = {
              ...array[index],
              reactions: data.message.reactions
            }

            return [...array]
          })
        }
        if (data.notification_type === 'typing' && data.conversation_id === conversationId) {
          setTypingUsers(
            (
              prevState: {
                avatar: string
                id: number
                name: string
                username: string
              }[]
            ) => [...prevState, data.user]
          )
        }
        if (data.notification_type === 'not typing' && data.conversation_id === conversationId) {
          setTypingUsers(
            (
              prevState: {
                avatar: string
                id: number
                name: string
                username: string
              }[]
            ) => {
              const array = [...prevState]
              const filtered = array.filter(
                (item: { avatar: string; id: number; name: string; username: string }) => item.id !== data.user.id
              )

              return [...filtered]
            }
          )
        }
        if (data.notification_type === 'blurred-media') {
          setMessages((prevState: any) => {
            let array = [...prevState]
            const mediaItem = array.filter((item: any) => item.message.id === data.id)
            const index = array.indexOf(mediaItem[0])
            if (data.photo_preview) {
              if (data.photo_preview?.preview?.src?.video_id) {
                const video = array[index].message.videos_preview.filter(
                  (item: any) => item.id === data.photo_preview.id
                )
                const videoIndex = array[index].message.videos_preview.indexOf(video[0])
                array[index].message.videos_preview[videoIndex].preview.src = data.photo_preview.preview.src.src
              } else {
                const photo = array[index].message.photos.filter((item: any) => item.id === data.photo_preview.id)
                const photoIndex = array[index].message.photos.indexOf(photo[0])
                array[index].message.photos[photoIndex].url = data.photo_preview.preview.src
              }
            }

            return [...array]
          })
        }
        if (data.notification_type === 'trimmed-media') {
          setMessages((prevState: any) => {
            let array = [...prevState]
            const mediaItem = array.filter((item: any) => item.message.id === data.id)
            const index = array.indexOf(mediaItem[0])
            const video = array[index].message.videos_preview.filter((item: any) => item.id === data.video_preview.id)
            const videoIndex = array[index].message.videos_preview.indexOf(video[0])
            array[index].message.videos_preview[videoIndex].preview.type = 'trimmed_video'
            array[index].message.videos_preview[videoIndex].preview.src = data.video_preview.preview.src.src

            return [...array]
          })
        }
      }
    })
    return () => {
      notTyping(conversationId)
      pusher.unsubscribe(`presence-chat.conversation.${userData.id}`)
    }
  }, [conversationId])

  return (
    <BasicLayout
      title={
        <div
          className={style.conversation_title}
          onClick={() => modalData.addModal('', <UserDetails user={otherUserData} />, true)}
        >
          <div className={style.other_user_avatar}>
            <img
              src={!otherUserData?.deleted ? otherUserData?.avatar?.url || avatarPlaceHolder : avatarPlaceHolder}
              alt='avatar'
            />
          </div>
          {!isLoadingOtherUser
            ? !otherUserData?.deleted
              ? otherUserData?.display_name
              : t('deletedUser')
            : `${t('loading')}...`}
        </div>
      }
      hideFooter={true}
      customClass={style.conversation_page_wrapper}
    >
      <WithHeaderSection
        headerSection={
          <LayoutHeader
            type='search-with-buttons'
            searchValue={searchText}
            searchFn={(val: string) => setSearchText(val)}
            additionalProps={{ placeholder: t('searchConversation') }}
            clearFn={() => setSearchText('')}
            buttons={[
              {
                type: 'actions',
                color: 'white',
                overlay: true,
                elements: [
                  {
                    icon: <spriteIcons.IconManOutline />,
                    text: 'User Details',
                    clickFn: () => {
                      if (otherUserData && otherUserData.deleted) {
                        addToast('error', t('userDeleted'))
                        return
                      }
                      modalData.addModal('', <UserDetails user={otherUserData} />)
                    }
                  },
                  ...(userData.role === 'model'
                    ? [
                        {
                          icon: <spriteIcons.IconSquarePlusOutline width='20' height='20' color='#778797' />,
                          text: 'Block User',
                          clickFn: () => {
                            if (otherUserData && otherUserData.deleted) {
                              addToast('error', t('userDeleted'))
                              return
                            }

                            modalData.addModal(t('block'), <BlockUser user={otherUserData} />)
                          }
                        }
                      ]
                    : []),
                  {
                    icon: <spriteIcons.IconMuteOutline />,
                    text: otherUserData?.is_muted ? 'Unmute Conversation' : 'Mute Conversation',
                    clickFn: () => {
                      if (otherUserData && otherUserData.deleted) {
                        addToast('error', t('userDeleted'))
                        return
                      }
                      muteConversationMutation.mutate()
                    }
                  },
                  {
                    icon: <spriteIcons.IconTrashcanLarge width='17' height='20' color='#778797' />,
                    text: 'Delete Conversation',
                    clickFn: () =>
                      modalData.addModal(
                        t('deleteConversation'),
                        <ConfirmModal
                          body={t('onceYouDeleteYourCopyOfTheConversation')}
                          confirmFn={() => deleteConversationMutation.mutate()}
                        />
                      )
                  },
                  {
                    icon: <spriteIcons.IconSharedFiles />,
                    text: 'Shared Files',
                    clickFn: () =>
                      modalData.addModal(
                        '',
                        <SharedMediaModal user={userData.role === 'model' ? otherUserData : null} />,
                        true
                      )
                  }
                ]
              },
              {
                type: 'cta',
                color: 'white',
                icon:
                  userData.role === 'model' ? (
                    <spriteIcons.IconCameraOutlineOnline />
                  ) : (
                    <spriteIcons.IconActionDollar color='#2894FF' width='20' height='20' />
                  ),
                action: () => addTip()
              }
            ]}
          />
        }
      >
        <InboxContainer containerRef={inboxRef}>
          <>
            {typingUsers.length > 0 && typingUsers.filter((item: any) => item.id !== userData.id).length > 0 && (
              <TypingStatus user={typingUsers.filter((item: any) => item.id !== userData.id)[0]} />
            )}
            {!isLoading &&
              !isLoadingOtherUser &&
              messages.map((message: any, index: number) => {
                let nextId = null
                let prevId = null
                let diff = 0
                let nextDiff = 0
                let sameMinutes = false
                let sameHours = false
                let nextSameMinutes = false
                let nextSameHours = false
                const date = new Date(message.message.created_at)
                const prevDate = messages[index - 1] ? new Date(messages[index - 1].message.created_at) : null
                const nextDate = messages[index + 1] ? new Date(messages[index + 1].message.created_at) : null

                const showDate = nextDate
                  ? `${date.getFullYear()}.${date.getMonth()}.${date.getDate()}` !==
                    `${nextDate.getFullYear()}.${date.getMonth()}.${date.getDate()}`
                  : true

                if (prevDate) {
                  diff = prevDate.getTime() - date.getTime()
                  if (prevDate.getMinutes() === date.getMinutes()) {
                    sameMinutes = true
                  }
                  if (prevDate.getHours() === date.getHours()) {
                    sameHours = true
                  }
                }
                if (nextDate) {
                  nextDiff = date.getTime() - nextDate.getTime()
                  if (nextDate.getMinutes() === date.getMinutes()) {
                    nextSameMinutes = true
                  }
                  if (nextDate.getHours() === date.getHours()) {
                    nextSameHours = true
                  }
                }

                nextId = messages[index + 1]?.sender?.id
                prevId = messages[index - 1]?.sender?.id

                const prevRecieved =
                  message?.sender &&
                  message?.sender?.id === prevId &&
                  diff < 60000 &&
                  sameMinutes &&
                  sameHours &&
                  !message.sending
                const nextRecieved =
                  message?.sender &&
                  message?.sender?.id === nextId &&
                  nextDiff < 60000 &&
                  nextSameMinutes &&
                  nextSameHours &&
                  !message.sending
                return (
                  <Message
                    key={index}
                    message={message.message}
                    recieved={message.sender?.id !== userData.id}
                    next_recieved={nextRecieved}
                    prev_recieved={prevRecieved}
                    sender={message.sender}
                    reactions={message.reactions}
                    seen={message.seen.includes(otherUserData?.id)}
                    sending={!!message.sending}
                    setReply={setReply}
                    addReaction={addReaction}
                    messageId={messageId}
                    setMessageId={setMessageId}
                    deleteMessage={(val: number) =>
                      modalData.addModal(
                        t('deleteMessage'),
                        <ConfirmModal body={t('onceYouDeleteAMessage')} confirmFn={() => deleteMessage(val)} />
                      )
                    }
                    reportMessage={(val: number) => {
                      modalData.addModal(
                        t('reportMessage'),
                        <Report
                          options={reportTypesData}
                          confirmFn={(message: string, reportType: number) => {
                            reportMutation.mutate({
                              id: val,
                              text: message,
                              report_type_id: reportType
                            })
                          }}
                          closeFn={() => modalData.clearModal()}
                        />
                      )
                    }}
                    purchaseMessage={(id: number) => purchaseMutation.mutate(id)}
                    showDate={showDate}
                  />
                )
              })}
            {(isLoading || isLoadingOtherUser || hasNextPage) && (
              <div className={style.conversation_loader_container}>
                <div className='loader' ref={lastMessageRef}></div>
              </div>
            )}
          </>
        </InboxContainer>
        <CreateMessage
          inboxRef={inboxRef}
          onFocusIn={focusIn}
          onFocusOut={focusOut}
          disabled={otherUserData?.deleted || isLoading || isLoadingOtherUser || addMessageMutation.isLoading}
          onGifClick={(val: any) => {
            if (userData.status === 'restricted') {
              addToast('error', t('restrictedMessageSend'))
              return
            }

            const messageObj = {
              gif_id: val.id,
              photos: [],
              videos: [],
              sounds: [],
              message: '',
              price: 0
            }
            setMessages((prevState: any) => [
              {
                message: {
                  ...messageObj,
                  created_at: new Date().getTime()
                },
                id: 'id' + new Date().getTime(),
                sender: userData,
                sending: true,
                seen: [],
                reactions: {
                  cry: {
                    count: 0,
                    users: []
                  },
                  kiss: {
                    count: 0,
                    users: []
                  },
                  like: {
                    count: 0,
                    users: []
                  },
                  love: {
                    count: 0,
                    users: []
                  },
                  sad: {
                    count: 0,
                    users: []
                  },
                  smile: {
                    count: 0,
                    users: []
                  }
                }
              },
              ...prevState
            ])

            if (conversationId) {
              addMessageMutation.mutate({
                message: { ...messageObj },
                recipients: { recipient: [parseFloat(id ?? '')] }
              })
            } else {
              addMessageMutation.mutate(
                {
                  message: { ...messageObj },
                  recipients: { recipient: [parseFloat(id ?? '')] }
                },
                {
                  onSuccess: resp => {
                    if (resp.data?.conversation_id) {
                      setConversationId(resp.data.conversation_id)
                    }
                  }
                }
              )
            }
          }}
          sendMessage={(val: any) => {
            if (!isLoading && !isLoadingOtherUser) {
              if (userData.status === 'restricted') {
                addToast('error', t('restrictedMessageSend'))
                return
              }

              if (bannedWordsData?.data?.length > 0 && val.message.trim() !== '') {
                let usedBannedWords = []
                for (let i = 0; i < bannedWordsData.data.length; i++) {
                  if (val.message.trim().toLowerCase().includes(bannedWordsData.data[i].word.toLowerCase())) {
                    usedBannedWords.push(bannedWordsData.data[i].word)
                    putBannedWord({
                      id: bannedWordsData.data[i].id,
                      type: 'message'
                    })
                  }
                }

                if (usedBannedWords.length > 0) {
                  usedBannedWords.forEach((word: string) =>
                    addToast('error', `${t('messageContainsBannedWord')} - ${word}`)
                  )
                  return
                }
              }

              if (!val.schedule_date) {
                setMessages((prevState: any) => [
                  {
                    message: {
                      ...val,
                      created_at: new Date().getTime()
                    },
                    id: 'id' + new Date().getTime(),
                    sender: userData,
                    sending: true,
                    seen: [],
                    reactions: {
                      cry: {
                        count: 0,
                        users: []
                      },
                      kiss: {
                        count: 0,
                        users: []
                      },
                      like: {
                        count: 0,
                        users: []
                      },
                      love: {
                        count: 0,
                        users: []
                      },
                      sad: {
                        count: 0,
                        users: []
                      },
                      smile: {
                        count: 0,
                        users: []
                      }
                    }
                  },
                  ...prevState
                ])
              }

              if (conversationId) {
                addMessageMutation.mutate(
                  {
                    message: { ...val },
                    recipients: { recipient: [parseFloat(id ?? '')] }
                  },
                  {
                    onSuccess: () => {
                      if (val.schedule_date) {
                        addToast('success', t('messageScheduled'))
                      }
                    }
                  }
                )
              } else {
                addMessageMutation.mutate(
                  {
                    message: { ...val },
                    recipients: { recipient: [parseFloat(id ?? '')] }
                  },
                  {
                    onSuccess: resp => {
                      if (val.schedule_date) {
                        addToast('success', 'message scheduled')
                      }
                      if (resp.data?.message?.conversation_id) {
                        setConversationId(resp.data.message.conversation_id)
                      }
                    }
                  }
                )
              }
            }
          }}
          setReply={setReply}
          reply={reply}
          hasGif={true}
        />
      </WithHeaderSection>
    </BasicLayout>
  )
}

export default Conversation
