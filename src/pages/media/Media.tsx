import { FC, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useQuery, useQueryClient } from 'react-query'
import queryString from 'query-string'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  IconMediaClock,
  IconMediaHeart,
  IconMediaSubscriptions,
  IconPlus,
  IconPurchases
} from '../../assets/svg/sprite'
import LayoutHeader from '../../features/LayoutHeader/LayoutHeader'
import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import WithHeaderSection from '../../layouts/WithHeaderSection/WithHeaderSection'
import MediaItemSmall from './components/MediaItemSmall/MediaItemSmall'
import MediaSection from './components/MediaSection/MediaSection'
import styles from './media.module.scss'
import 'swiper/css'

import SeeMoreItem from './components/SeeMoreItem/SeeMoreItem'
import MediaItem from './components/MediaItem/MediaItem'

import MediaItemOptions from './components/MediaItemOptions/MediaItemOptions'
import { getMediaAutocomplete, getMediaData } from '../../services/endpoints/media'
import { useModalContext } from '../../context/modalContext'
import { IPlaylist, IPost, ISubscriptionHistoryItem } from '../../types/interfaces/ITypes'
import CreatePlaylist from '../../components/UI/Modal/CreatePlaylist/CreatePlaylist'
import MediaItemPlaylist from './components/MediaItemPlaylist/MediaItemPlaylist'

import { useDebounce, useFilterQuery } from '../../helpers/hooks'
import { queryFromSearchParams } from '../../helpers/util'
import DesktopAdditionalContent from '../../features/DesktopAdditionalContent/DesktopAdditionalContent'

const Media: FC = () => {
  const filter = useFilterQuery()
  const search = filter.get('searchTerm')
  const modelId = filter.get('model_id')

  const [autocompleteTerm, setAutocompleteTerm] = useState<string>(search ?? '')
  const [isOptionsNavOpen, setIsOptionsNavOpen] = useState(false)
  const [optionsType, setOptionsType] = useState<string>('')
  const [activePostId, setActivePostId] = useState<number | null>(null)
  const [activeSubId, setActiveSubId] = useState<number | null>(null)
  const [shouldAutocomplete, setShouldAutocomplete] = useState(false)

  const { t } = useTranslation()
  const modalContext = useModalContext()
  const queryClient = useQueryClient()

  const location = useLocation()
  const values = queryString.parse(location.search)
  const navigate = useNavigate()

  const debouncedAutocompleteTerm = useDebounce(autocompleteTerm, 500)

  const { data, isLoading } = useQuery(['getMediaData', modelId], () => getMediaData({ model_id: modelId }))

  const { data: autocompleteResults } = useQuery(
    ['getMediaAutocomplete', debouncedAutocompleteTerm],
    () => getMediaAutocomplete({ searchTerm: debouncedAutocompleteTerm }),
    { enabled: !!debouncedAutocompleteTerm && shouldAutocomplete }
  )

  useEffect(() => {
    if (!search) {
      setShouldAutocomplete(true)
    }
  }, [])

  return (
    <BasicLayout title={t('media')} customContentClass='media__content__wrapper'>
      <WithHeaderSection
        headerSection={
          <LayoutHeader
            type='search-with-buttons'
            searchValue={autocompleteTerm}
            searchFn={(term: string) => {
              if (!shouldAutocomplete) {
                setShouldAutocomplete(true)
              }
              setAutocompleteTerm(term)
            }}
            additionalProps={{ placeholder: t('searchMedia') }}
            buttons={[
              {
                type: 'cta',
                icon: <IconPlus />,
                color: 'white',
                action: () => {
                  modalContext.addModal(
                    '',
                    <CreatePlaylist
                      closeFn={() => modalContext.clearModal()}
                      setSelectedPlaylist={(val: number) => {
                        queryClient.invalidateQueries(['getMediaData', modelId])
                      }}
                    />,
                    true,
                    true
                  )
                }
              }
            ]}
            applyFn={(val: string, val1?: string) => console.log(val, val1)}
            selectFn={(value: string, id?: number) => {
              values.searchTerm = value
              if (id) values.model_id = `${id}`
              const searchQuery = queryFromSearchParams(values)
              setAutocompleteTerm(value)
              navigate({
                pathname: '/media',
                search: searchQuery
              })
              if (shouldAutocomplete) {
                setShouldAutocomplete(false)
              }
            }}
            clearFn={() => {
              navigate('/media')
              setAutocompleteTerm('')
            }}
            mediaSearchResults={autocompleteResults}
          />
        }
      >
        {isLoading ? (
          <div className='loader'></div>
        ) : (
          <div className={styles.media}>
            <MediaSection
              icon={<IconMediaSubscriptions />}
              title='subscriptions'
              action='/subscriptions'
              hasData={data.subscriptions && !!data.subscriptions.length}
            >
              {data.subscriptions && data.subscriptions.length ? (
                <Swiper spaceBetween={10} slidesPerView='auto'>
                  {data.subscriptions.map((subscription: ISubscriptionHistoryItem) => {
                    return (
                      <SwiperSlide key={subscription.userId} style={{ width: 'auto' }}>
                        <MediaItemSmall
                          active={subscription.userId === activeSubId}
                          data={subscription}
                          clickFn={() => {
                            activePostId && setActivePostId(null)
                            setActiveSubId(subscription.userId)
                          }}
                        />
                      </SwiperSlide>
                    )
                  })}
                  <SwiperSlide style={{ width: 'auto', height: 'auto' }}>
                    <SeeMoreItem text='See More' action='/subscriptions' />
                  </SwiperSlide>
                </Swiper>
              ) : (
                <div className={styles.empty}>
                  <p>You have no active subscriptions</p>
                </div>
              )}
            </MediaSection>
            <MediaSection
              icon={<IconPurchases />}
              title='purchases'
              action='/purchases'
              hasData={data.purchases && !!data.purchases.length}
            >
              {data.purchases && data.purchases.length ? (
                <Swiper spaceBetween={10} slidesPerView='auto'>
                  {data.purchases.map((purchase: IPost, idx: number) => {
                    return (
                      <SwiperSlide key={idx} style={{ width: 'auto' }}>
                        <MediaItem
                          postData={purchase}
                          isOpen={isOptionsNavOpen}
                          setIsOpen={(value: boolean) => {
                            if (value) {
                              setOptionsType('purchase')
                            } else {
                              setOptionsType('')
                            }
                            setIsOptionsNavOpen(value)
                          }}
                          setIsActive={() => setActivePostId(purchase.id)}
                        />
                      </SwiperSlide>
                    )
                  })}

                  <SwiperSlide style={{ width: '11rem', height: '16rem' }}>
                    <SeeMoreItem text='See More' action='/purchases' />
                  </SwiperSlide>
                </Swiper>
              ) : (
                <div className={styles.empty}>
                  <p>You have not made any purchases</p>
                </div>
              )}
            </MediaSection>
            <MediaSection
              icon={<IconPurchases />}
              title='custom playlists'
              action='/playlists'
              hasData={data.playlists && !!data.playlists.length}
            >
              {data.playlists && data.playlists.length ? (
                <Swiper spaceBetween={10} slidesPerView='auto'>
                  {data.playlists.map((playlist: IPlaylist) => {
                    return (
                      <SwiperSlide key={playlist.playlist_info.id} style={{ width: 'auto' }}>
                        <MediaItemPlaylist
                          playlistData={playlist}
                          active={activePostId === playlist.playlist_info.id}
                          setIsActive={() => {
                            setActivePostId(playlist.playlist_info.id)
                            navigate(`/playlists/${playlist.playlist_info.id}`)
                          }}
                        />
                      </SwiperSlide>
                    )
                  })}

                  <SwiperSlide style={{ width: 'auto', height: 'auto' }}>
                    <SeeMoreItem text='See More' action='#' />
                  </SwiperSlide>
                </Swiper>
              ) : (
                <div className={styles.empty}>
                  <p>You don't have any playlists created</p>
                </div>
              )}
            </MediaSection>

            {data.watched && (
              <MediaSection
                icon={<IconMediaClock />}
                title='watch history'
                action='/watch-history'
                hasData={!!data.watched.length}
              >
                {data.watched.length ? (
                  <Swiper spaceBetween={10} slidesPerView='auto'>
                    {data.watched.map((historyItem: IPost) => {
                      return (
                        <SwiperSlide key={historyItem.id} style={{ width: 'auto' }}>
                          <MediaItem
                            postData={historyItem}
                            isOpen={isOptionsNavOpen}
                            setIsOpen={(value: boolean) => {
                              if (value) {
                                setOptionsType('watch-history')
                              } else {
                                setOptionsType('')
                              }
                              setIsOptionsNavOpen(value)
                            }}
                            setIsActive={() => setActivePostId(historyItem.id)}
                          />
                        </SwiperSlide>
                      )
                    })}

                    <SwiperSlide style={{ width: 'auto', height: 'auto' }}>
                      <SeeMoreItem text='See More' action='/watch-history' />
                    </SwiperSlide>
                  </Swiper>
                ) : (
                  <div className={styles.empty}>
                    <p>You dont have anything in your watch history</p>
                  </div>
                )}
              </MediaSection>
            )}
            {data.like && (
              <MediaSection icon={<IconMediaHeart />} title='Likes' action='/likes' hasData={!!data.like.length}>
                {data.like.length ? (
                  <Swiper spaceBetween={10} slidesPerView='auto'>
                    {data.like.map((like: IPost) => {
                      return (
                        <SwiperSlide key={like.id} style={{ width: 'auto' }}>
                          <MediaItem
                            postData={like}
                            isOpen={isOptionsNavOpen}
                            setIsOpen={(value: boolean) => {
                              if (value) {
                                setOptionsType('likes')
                              } else {
                                setOptionsType('')
                              }
                              setIsOptionsNavOpen(value)
                            }}
                            setIsActive={() => setActivePostId(like.id)}
                          />
                        </SwiperSlide>
                      )
                    })}

                    <SwiperSlide style={{ width: 'auto', height: 'auto' }}>
                      <SeeMoreItem text='See More' action='/likes' />
                    </SwiperSlide>
                  </Swiper>
                ) : (
                  <div className={styles.empty}>
                    <p>You have not liked anything so far</p>
                  </div>
                )}
              </MediaSection>
            )}
          </div>
        )}

        {activePostId && (
          <MediaItemOptions
            role='model'
            type={optionsType}
            isOpen={isOptionsNavOpen}
            setIsOpen={(value: boolean) => setIsOptionsNavOpen(value)}
            postId={activePostId}
          />
        )}
      </WithHeaderSection>
      <DesktopAdditionalContent />
    </BasicLayout>
  )
}

export default Media
