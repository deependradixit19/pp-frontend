import { FC, useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from 'react-query'
import { getAllVaultMedia } from '../../../../services/endpoints/vault'
import { addToast } from '../../../Common/Toast/Toast'
import VaultCardGrouped from '../../../../pages/vault/components/VaultCardGrouped/VaultCardGrouped'
import style from './_shared_media_modal.module.scss'
import { useUserContext } from '../../../../context/userContext'
import { IconFilterOutline, IconSortAsc } from '../../../../assets/svg/sprite'
import { useModalContext } from '../../../../context/modalContext'
import SortModal from '../Sort/SortModal'
import ModalWrapper from '../../../../features/ModalWrapper/ModalWrapper'
import avatarPlaceholder from '../../../../assets/images/user_placeholder.png'
import Button from '../../Buttons/Button'

const SharedMediaModal: FC<{
  submitFn?: (val: any) => void
  user?: any
  clearOnSubmit?: boolean
}> = ({ submitFn, user, clearOnSubmit = true }) => {
  const userData = useUserContext()
  const modalData = useModalContext()
  const [type, setType] = useState(!user ? (userData.role === 'model' ? 'feed' : 'all') : 'messages')
  const [activeFilter, setActiveFilter] = useState('')
  const [activeSort, setActiveSort] = useState('')
  const [sortAsc, setSortAsc] = useState('')
  const [media, setMedia] = useState([])
  const [allSelectedMedia, setAllSelectedMedia] = useState<any>([])
  const [selectedPosts, setSelecetedPosts] = useState<any>([])
  const [allMediaLength, setAllMediaLength] = useState<any>(0)
  const [postIds, setPostIds] = useState<any>([])
  const [postsGrouped, setPostsGrouped] = useState<string | boolean>(false)
  const [sortModalOpen, setSortModalOpen] = useState(false)
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const { t } = useTranslation()

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['vaultMedia', type, activeFilter, activeSort, sortAsc, postsGrouped],
    ({ pageParam = 0 }) =>
      getAllVaultMedia(
        type,
        pageParam,
        null,
        {
          filter: activeFilter,
          sort: activeSort,
          sortAsc: sortAsc,
          grouped: postsGrouped,
          mapExistingPostId: false
        },
        user?.id || null
      )
  )

  useEffect(() => {
    if (data && !isLoading) {
      let tempData = []
      if (data.pages[0].data) {
        tempData = data?.pages?.map((page: any) => {
          return page.data
        })
      }
      const merged = [].concat.apply([], tempData)
      setMedia(merged)
    }
  }, [data, isLoading])

  useEffect(() => {
    setSortAsc('')
    setSelecetedPosts([])
    setActiveFilter('')
    setPostsGrouped(false)
    setPostIds([])
    setAllMediaLength(0)
  }, [type])

  const observer = useRef<IntersectionObserver>()

  const lastPostRef = useCallback(
    (node: any) => {
      if (isFetchingNextPage) return
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
    [isFetchingNextPage, hasNextPage]
  )

  const toggleSelectedPosts = (val: any) => {
    let calcNumber = 0
    if (val.post) {
      if (val.post.videos.length > 0 && val.post.photos.length > 0) {
        calcNumber = val.post.videos.length + val.post.photos.length
      } else if (val.post.videos.length > 0) {
        calcNumber = val.post.videos.length
      } else if (val.post.photos.length > 0) {
        calcNumber = val.post.photos.length
      }
    }
    if (val.message?.message) {
      if (val.message.message.videos.length > 0 && val.message.message.photos.length > 0) {
        calcNumber = val.message.message.videos.length + val.message.message.photos.length
      } else if (val.message.message.videos.length > 0) {
        calcNumber = val.message.message.videos.length
      } else if (val.message.message.photos.length > 0) {
        calcNumber = val.message.message.photos.length
      }
    }
    if (val.story) {
      calcNumber = 1
    }

    if (val.id) {
      if (selectedPosts.includes(val.id)) {
        const newArray = selectedPosts.filter((item: number) => item !== val.id)
        setSelecetedPosts(newArray)
      } else {
        if (allMediaLength + calcNumber <= 40) {
          setSelecetedPosts((prevState: number[]) => [...prevState, val.id])
        }
      }
      if (postIds.includes(val.id)) {
        if (postsGrouped) {
          const newArray = postIds.filter((item: number) => item !== val.id)
          setPostIds(newArray)
        } else {
          const newArray = postIds.filter((item: number) => item !== val.post_id)
          setPostIds(newArray)
        }
      } else {
        if (allMediaLength + calcNumber <= 40) {
          if (postsGrouped) {
            setPostIds((prevState: number[]) => [...prevState, val.id])
          } else {
            setPostIds((prevState: number[]) => [...prevState, val.post_id])
          }
        }
      }
    }

    if (allSelectedMedia.some((item: any) => item.id === val.id)) {
      const newArray = allSelectedMedia.filter((item: any) => item.id !== val.id)
      setAllSelectedMedia(newArray)
      setAllMediaLength((prevState: number) => prevState - calcNumber)
    } else {
      if (allMediaLength + calcNumber <= 40) {
        setAllSelectedMedia((prevState: any) => [...prevState, val])
        setAllMediaLength((prevState: number) => prevState + calcNumber)
      } else {
        addToast('error', 'Only 40 media files can be selected at once')
      }
    }
  }

  const feedFilter = {
    first_section: [
      {
        value: 'group_by_post',
        name: 'Group By Post',
        isToggle: true
      }
    ],
    second_section: [
      {
        value: 'all_media',
        name: 'All Media'
      },
      {
        value: 'photos',
        name: 'Photos'
      },
      {
        value: 'videos',
        name: 'Videos'
      }
    ]
  }

  const feedSort = {
    first_section: [
      {
        value: 'most_recent',
        name: 'Latest Posts'
      },
      {
        value: 'most_purchased',
        name: 'Most Purchased'
      },
      {
        value: 'most_viewed',
        name: 'Most Viewed'
      },
      {
        value: 'most_liked',
        name: 'Most Liked'
      },
      {
        value: 'highest_tips',
        name: 'Highest Tips'
      },
      {
        value: 'most_comment',
        name: 'Most Commented'
      }
    ],
    second_section: [
      {
        value: 'asc',
        name: 'Ascending'
      },
      {
        value: 'desc',
        name: 'Descending'
      }
    ]
  }

  const messagesSort = {
    first_section: [
      {
        value: 'most_recent',
        name: 'Most Recent'
      },
      {
        value: 'most_purchased',
        name: 'Most Purchased'
      }
    ],
    second_section: [
      {
        value: 'asc',
        name: 'Ascending'
      },
      {
        value: 'desc',
        name: 'Descending'
      }
    ]
  }

  return (
    <div className={style.container}>
      <div className={style.title_container}>
        <div className={style.title}>{t('sharedMedia')}</div>
        {userData.role === 'model' && !user && (
          <div className={style.sort_buttons_container}>
            <ModalWrapper open={sortModalOpen} setOpen={setSortModalOpen}>
              <div className={style.sort_modal_container}>
                <div className={style.title}>{t('Sort')}</div>
                <SortModal
                  applyFn={(val1: string, val2: string) => {
                    if (val1.trim() === '' || val2.trim() === '') {
                      setActiveSort('')
                      setSortAsc('')
                      setSortModalOpen(false)
                      return
                    }
                    setActiveSort(val1)
                    setSortAsc(val2)
                    setSortModalOpen(false)
                  }}
                  dontClearModal={true}
                  elements={type === 'messages' ? messagesSort : feedSort}
                />
              </div>
            </ModalWrapper>
            <ModalWrapper open={filterModalOpen} setOpen={setFilterModalOpen}>
              <div className={style.sort_modal_container}>
                <div className={style.title}>{t('Filter')}</div>
                <SortModal
                  applyFn={(val1: string | boolean, val2: string) => {
                    setPostsGrouped(val1)
                    setActiveFilter(val2)
                    setFilterModalOpen(false)
                  }}
                  dontClearModal={true}
                  elements={feedFilter}
                />
              </div>
            </ModalWrapper>
            <button onClick={() => setSortModalOpen(true)}>
              <IconSortAsc color='#210F32' />
            </button>
            {type !== 'messages' && (
              <button onClick={() => setFilterModalOpen(true)}>
                <IconFilterOutline color='#210F32' />
              </button>
            )}
          </div>
        )}
      </div>
      {!user ? (
        <div className={style.links_container}>
          {userData.role === 'model' ? (
            <>
              <button
                className={`${style.link_button} ${type === 'feed' ? style.link_button_active : ''}`}
                onClick={() => setType('feed')}
              >
                Feed
              </button>
              <button
                className={`${style.link_button} ${type === 'premium' ? style.link_button_active : ''}`}
                onClick={() => setType('premium')}
              >
                Premium
              </button>
              <button
                className={`${style.link_button} ${type === 'messages' ? style.link_button_active : ''}`}
                onClick={() => setType('messages')}
              >
                Messages
              </button>
            </>
          ) : (
            <>
              <button
                className={`${style.link_button} ${type === 'all' ? style.link_button_active : ''}`}
                onClick={() => setType('all')}
              >
                All
              </button>
              <button
                className={`${style.link_button} ${type === 'paid' ? style.link_button_active : ''}`}
                onClick={() => setType('paid')}
              >
                Paid
              </button>
              <button
                className={`${style.link_button} ${type === 'unpaid' ? style.link_button_active : ''}`}
                onClick={() => setType('unpaid')}
              >
                Unpaid
              </button>
            </>
          )}
        </div>
      ) : (
        <div className={style.shared_with_container}>
          <div className={style.shared_with_text}>{t('sharedWith')}</div>
          <div className={style.user_details}>
            <div className={style.user_avatar}>
              <img src={user?.avatar?.url || avatarPlaceholder} alt='avatar' />
            </div>
            <div className={style.user_name}>
              <div>{user?.display_name || ''}</div>
              <div>@{user?.username || ''}</div>
            </div>
          </div>
        </div>
      )}

      <div className={style.cards_container}>
        {!isLoading &&
          media.length > 0 &&
          media
            .filter((item: any) => (item.story ? item.story.video_src || item.story.image_src : item)) // remove stories without media
            .map((media: any, index: number) => (
              <VaultCardGrouped
                onCirlceClick={toggleSelectedPosts}
                media={media}
                selected={allSelectedMedia.some((item: any) => item.id === media.id)}
                selectedText={selectedPosts.indexOf(media.id) + 1}
                grouped={postsGrouped}
                key={index}
              />
            ))}
        {(hasNextPage || isLoading) && (
          <div style={{ width: '100%' }} ref={lastPostRef}>
            <div className='loader'></div>
          </div>
        )}
      </div>
      <div className={style.buttons_container}>
        <Button color='grey' text={t('close')} clickFn={() => modalData.clearModal()} />
        <Button
          color='black'
          text={t('addMedia')}
          clickFn={() => {
            submitFn?.(allSelectedMedia)
            if (clearOnSubmit) {
              modalData.clearModal()
            }
          }}
        />
      </div>
    </div>
  )
}

export default SharedMediaModal
