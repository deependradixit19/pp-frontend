import { FC, useState, useEffect, useCallback, useRef } from 'react'
import Pusher from 'pusher-js'

import '../_messages.scss'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery, useQuery, useQueryClient } from 'react-query'
import { AllIcons } from '../../../helpers/allIcons'
import * as spriteIcons from '../../../assets/svg/sprite'
import { getChats, getQuickChats } from '../../../services/endpoints/api_messages'
import ChatCard from '../components/ChatCard'
import chatBubbleInner from '../../../assets/images/temp/chatBubbleInner.svg'
import chatBubbleOuter from '../../../assets/images/temp/chatBubbleOuter.svg'
import BasicLayout from '../../../layouts/basicLayout/BasicLayout'
import WithHeaderSection from '../../../layouts/WithHeaderSection/WithHeaderSection'
import LayoutHeader from '../../../features/LayoutHeader/LayoutHeader'
import QuickContact from '../components/QuickContact/QuickContact'
import MassMessagesModal from '../../../components/UI/Modal/MassMessagesModal/MassMessagesModal'
import { useModalContext } from '../../../context/modalContext'
import { useUserContext } from '../../../context/userContext'
import PollAnswers from '../components/PollAnswers/PollAnswers'
import { getAccessToken } from '../../../services/storage/storage'
import DesktopAdditionalContent from '../../../features/DesktopAdditionalContent/DesktopAdditionalContent'

interface IConversations {
  data: Array<{
    conversation: any
    conversation_id: number
    created_at: string
    direct_message: number | boolean
    id: number
    private: number | boolean
    settings: any
    updated_at: string
    user_id: number
  }>
  links: {
    first: string | null
    last: string | null
    next: string | null
    prev: string | null
  }
  meta: any
}
interface IChatCard {
  conversation: any
  conversation_id: number
  created_at: string
  direct_message: number | boolean
  id: number
  private: number | boolean
  settings: any
  updated_at: string
  user_id: number
}

const Inbox: FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('')
  const [allConversations, setAllConversations] = useState<Array<IChatCard>>([])
  const modalData = useModalContext()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const userData = useUserContext()

  const { data, error, hasNextPage, isFetchingNextPage, isLoading, fetchNextPage } = useInfiniteQuery(
    ['conversations', searchTerm, sortBy],
    ({ pageParam = 1 }) =>
      getChats({
        page: pageParam,
        search: searchTerm.trim() === '' ? null : searchTerm,
        sort: sortBy === '' ? null : sortBy
      }),
    {
      getNextPageParam: lastPage => {
        let current = lastPage.meta?.current_page
        let last = lastPage.meta?.last_page
        if (!current) current = lastPage.current_page
        if (!last) last = lastPage.last_page
        if (current && last && current < last) return current + 1
      }
    }
  )

  const { data: quickChatsData, isLoading: IsLoadingQuickChats } = useQuery('quick-chats', getQuickChats, {
    enabled: !!userData?.chat_settings.favorite_contacts
  })

  const observer = useRef<IntersectionObserver>()

  const lastConversationRef = useCallback(
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
    if (data && !isLoading) {
      let tempData = []
      if (data.pages[0]?.data) {
        tempData = data.pages.map(page => (page.data?.data ? page.data.data : page.data))
      }
      const merged = tempData.concat.apply([], tempData)
      setAllConversations(merged)
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
    if (!process.env.REACT_APP_PUSHER_KEY || !process.env.REACT_APP_PUSHER_CLUSTER || !token) {
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
      if (data.notification_type === 'new-message') {
        queryClient.invalidateQueries(['conversations', searchTerm, sortBy])
      }
    })

    return () => {
      pusher.unsubscribe(`presence-chat.conversation.${userData.id}`)
    }
  }, [searchTerm, sortBy])

  return (
    <BasicLayout title={'Messages'}>
      <WithHeaderSection
        headerSection={
          <LayoutHeader
            type='search-with-buttons'
            searchValue={searchText}
            searchFn={(term: string) => setSearchText(term)}
            clearFn={() => setSearchText('')}
            additionalProps={{ placeholder: `${t('searchInbox')}` }}
            buttons={[
              {
                type: 'sort',
                elements: {
                  first_section: [
                    {
                      value: 'most-recent',
                      name: t('showMostRecent')
                    },
                    {
                      value: 'unread-first',
                      name: t('showUnreadFirst')
                    },
                    {
                      value: 'oldest-unread',
                      name: t('showOldestUnreadFirst')
                    },
                    {
                      value: 'unread-premium',
                      name: t('showUnreadFromPremiumBuyers')
                    }
                  ],
                  second_section: [
                    {
                      value: 'all-read',
                      name: t('markAllAsRead')
                    }
                  ]
                }
              },
              ...(userData.role === 'model'
                ? [
                    {
                      type: 'custom',
                      icon: <spriteIcons.IconGraph />,
                      action: () => modalData.addModal(t('massMessages'), <MassMessagesModal />)
                    },
                    {
                      type: 'custom',
                      icon: <spriteIcons.IconCalendarClockOutline />
                    }
                  ]
                : [])
            ]}
            applyFn={(val: string) => setSortBy(val)}
          />
        }
      >
        <div className='messages'>
          {allConversations.length > 0 ? (
            <>
              {!!userData?.chat_settings.favorite_contacts &&
                quickChatsData?.data.length > 0 &&
                !IsLoadingQuickChats && (
                  <Swiper slidesPerView={'auto'} spaceBetween={10}>
                    {quickChatsData?.data.map(
                      (
                        user: {
                          amount_of_messages: number
                          conversation_id: number
                          other_user_id: number
                          user_name: string
                          avatar: string
                        },
                        index: number
                      ) => (
                        <SwiperSlide key={index} style={{ width: 'auto' }}>
                          <QuickContact user={user} />
                        </SwiperSlide>
                      )
                    )}
                  </Swiper>
                )}
              <PollAnswers />
              {!isLoading &&
                allConversations.map((conversation: IChatCard, key: number) => (
                  <ChatCard key={key} chat={conversation} />
                ))}
            </>
          ) : (
            !isLoading && (
              <div className='messages__nomessages'>
                <img className='messages__nomessages--outer' src={chatBubbleOuter} alt='Chat bubble outer icon' />
                <img className='messages__nomessages--inner' src={chatBubbleInner} alt='Chat bubble inner' />

                <h2 className='messages__nomessages__title'>No messages</h2>
                <p className='messages__nomessages__text'>Your groups appear here</p>
              </div>
            )
          )}
          {(isLoading || hasNextPage) && <div className='loader' ref={lastConversationRef}></div>}
          <Link to={'/messages/new'}>
            <div className='messages__addNew'>
              <img src={AllIcons.chat_plus} alt={t('addNew')} />
            </div>
          </Link>
        </div>
      </WithHeaderSection>
      <DesktopAdditionalContent />
    </BasicLayout>
  )
}

export default Inbox
