import { FC, useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from 'react-query'
import Button from '../../../../components/UI/Buttons/Button'
import LayoutHeader from '../../../../features/LayoutHeader/LayoutHeader'
import style from './_add_to_popup.module.scss'
import vaultStyle from '../../_vault.module.scss'
import * as spriteIcons from '../../../../assets/svg/sprite'
import { getVault } from '../../../../services/endpoints/vault'
import VaultCardGrouped from '../VaultCardGrouped/VaultCardGrouped'
import { getAllVaultMedia } from '../../../../services/endpoints/vault'
import { addToast } from '../../../../components/Common/Toast/Toast'

const AddToGroupPopUp: FC<{
  selectedCategory: any
  selectedCategoryPostIds: number[]
  submitFn: (val: any, val2: any) => void
  cancelFn: () => void
  open: boolean
  loading?: boolean
  setQueryToInvalidate?: any
}> = ({ selectedCategory, selectedCategoryPostIds, cancelFn, submitFn, open, loading, setQueryToInvalidate }) => {
  const { t } = useTranslation()
  const [selectedPosts, setSelecetedPosts] = useState<number[]>([])
  const [postIds, setPostIds] = useState<any>([])
  const [allSelectedMedia, setAllSelectedMedia] = useState<any>([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [postsFilter, setPostsFilter] = useState('')
  const [postsSort, setPostsSort] = useState('')
  const [postsAsc, setPostsAsc] = useState('')
  const [media, setMedia] = useState<any>([])
  const [allMediaLength, setAllMediaLength] = useState(0)

  const cardsTypes = ['All', 'Feed', 'Premium', 'Messages', 'Story']

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

  useEffect(() => {
    setQueryToInvalidate([
      'vaultMedia',
      activeFilter,
      selectedCategory,
      selectedCategoryPostIds,
      postsFilter,
      postsSort,
      postsAsc
    ])
  }, [activeFilter, selectedCategory, selectedCategoryPostIds, postsFilter, postsSort, postsAsc])

  useEffect(() => {
    setAllSelectedMedia([])
    setSelecetedPosts([])
    setPostIds([])
    setAllMediaLength(0)
  }, [activeFilter, selectedCategory, postsAsc, postsFilter, postsSort])

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['vaultMedia', activeFilter, selectedCategory, selectedCategoryPostIds, postsFilter, postsSort, postsAsc],
    ({ pageParam = 0 }) =>
      getAllVaultMedia(
        activeFilter,
        pageParam,
        null,
        {
          filter: 'postsFilter',
          sort: 'postsSort',
          sortAsc: 'postsAsc',
          grouped: true,
          filterExisting: selectedCategoryPostIds
        },
        null
      ),
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.nextPage
      }
    }
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
        const newArray = postIds.filter((item: number) => item !== val.id)
        setPostIds(newArray)
      } else {
        if (allMediaLength + calcNumber <= 40) {
          setPostIds((prevState: number[]) => [...prevState, val.id])
        }
      }
    }

    if (allSelectedMedia.some((item: any) => item.id === val.id)) {
      const newArray = allSelectedMedia.filter((item: any) => item.id !== val.id)
      setAllSelectedMedia(newArray)
    } else {
      if (allMediaLength + calcNumber <= 40) {
        setAllSelectedMedia((prevState: any) => [...prevState, val])
      } else {
        addToast('error', 'Only 40 media files can be selected at once')
      }
    }
  }

  return (
    <div className={`${style.container} ${open ? style.container_open : ''}`}>
      <div className={style.title}>
        <div className='header__linkback' onClick={cancelFn}></div>
        {t('sharedMedia')}
      </div>
      <div className={style.header}>
        <LayoutHeader
          type='title-with-buttons'
          buttons={
            activeFilter === 'feed' || activeFilter === 'premium' || activeFilter === 'messages'
              ? [
                  {
                    type: 'sort',
                    elements: activeFilter === 'feed' || activeFilter === 'premium' ? feedSort : messagesSort,
                    sortingProps: {
                      selectedSort: postsSort,
                      selectedOrder: postsAsc
                    },
                    applyFn: (val1: string, val2: string) => {
                      if (val1.trim() === '' || val2.trim() === '') {
                        setPostsSort('')
                        setPostsAsc('')
                        return
                      }
                      setPostsSort(val1)
                      setPostsAsc(val2)
                    }
                  },
                  {
                    type: 'filter',
                    elements: feedFilter,
                    sortingProps: {
                      selectedSort: 'group_by_post',
                      selectedOrder: postsFilter
                    },
                    applyFn: (val1: string | boolean, val2: string) => {
                      setPostsFilter(val2)
                    }
                  }
                ]
              : [
                  {
                    type: 'filter',
                    elements: feedFilter,
                    sortingProps: {
                      selectedSort: 'group_by_post',
                      selectedOrder: postsFilter
                    },
                    applyFn: (val1: string | boolean, val2: string) => {
                      setPostsFilter(val2)
                    }
                  }
                ]
          }
          titleWithIcon={
            <div className={vaultStyle.select_category_container}>
              <div className={vaultStyle.select_category_icon}>
                <spriteIcons.IconList color='#ffffff' width='14' height='14' />
              </div>
              <div className={vaultStyle.select_category_text}>{t(selectedCategory.name)}</div>
            </div>
          }
        />
      </div>
      <div className={style.separator}></div>
      <div className={style.cards_types_container}>
        {cardsTypes.map((cardType: string, index: number) => (
          <div
            className={`${style.card_type} ${activeFilter === cardType.toLowerCase() ? style.card_type_selected : ''}`}
            key={index}
            onClick={() => setActiveFilter(cardType.toLowerCase())}
          >
            {cardType}
          </div>
        ))}
      </div>
      <div className={style.cards_container}>
        {!isLoading &&
          media.length > 0 &&
          media
            .filter((item: any) => (item.story ? item.story.video_src || item.story.image_src : item)) // remove stories without media
            .map((media: any, index: number) => (
              <VaultCardGrouped
                key={index}
                onCirlceClick={toggleSelectedPosts}
                media={media}
                selected={allSelectedMedia.some((item: any) => item.id === media.id)}
                selectedText={selectedPosts.indexOf(media.id) + 1}
                grouped={true}
              />
            ))}
        {(hasNextPage || isLoading) && (
          <div style={{ width: '100%' }} ref={lastPostRef}>
            <div className='loader'></div>
          </div>
        )}
      </div>
      <div className={style.add_to_buttons}>
        <Button
          text={'Cancel'}
          color='grey'
          customClass={`${style.add_to_button} ${loading ? style.button_loading : ''}`}
          clickFn={cancelFn}
        />
        <Button
          text={'Add'}
          color='black'
          customClass={`${style.add_to_button} ${loading ? style.button_loading : ''}`}
          clickFn={() => submitFn(allSelectedMedia, selectedPosts)}
        />
      </div>
    </div>
  )
}

export default AddToGroupPopUp
