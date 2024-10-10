import { FC, useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query'
import { addMediaToCategory, deleteFromVault, getAllVaultMedia } from '../../services/endpoints/vault'
import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import WithHeaderSection from '../../layouts/WithHeaderSection/WithHeaderSection'
import LinkTabs from '../../components/UI/LinkTabs/LinkTabs'
import { useFilterQuery } from '../../helpers/hooks'
import * as spriteIcons from '../../assets/svg/sprite'
import { getMediaCategories } from '../../services/endpoints/mediaCategories'
import LayoutHeader from '../../features/LayoutHeader/LayoutHeader'
import style from './_vault.module.scss'
import { useModalContext } from '../../context/modalContext'
import SelectCategoriesModal from '../../components/UI/Modal/SelectCategoriesModal/SelectCategoriesModal'
import { ICategory } from '../../types/interfaces/ITypes'
import AddToGroupPopUp from './components/AddToGroupPopUp/AddToGroupPopUp'
import VaultCardGrouped from './components/VaultCardGrouped/VaultCardGrouped'
import { addToast } from '../../components/Common/Toast/Toast'
import ShareModal from '../../components/UI/Modal/Share/ShareModal'
import ConfirmModal from '../../components/UI/Modal/Confirm/ConfirmModal'
import DesktopAdditionalContent from '../../features/DesktopAdditionalContent/DesktopAdditionalContent'

const Vault: FC = () => {
  const { t } = useTranslation()
  const [media, setMedia] = useState<any>([])
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const { id } = useParams<any>()
  const [activeCategory, setActiveCategory] = useState<any>([
    {
      name: id ? 'Loading...' : 'All',
      id: id ? id : null,
      posts: 0,
      premium: 0,
      selected: true
    }
  ])
  const [categoryExistingPosts, setCategoryExistingPosts] = useState<number[]>([])
  const [addToActive, setAddToActive] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedPosts, setSelecetedPosts] = useState<any>([])
  const [postIds, setPostIds] = useState<any>([])
  const [allSelectedMedia, setAllSelectedMedia] = useState<any>([])
  const [allMediaLength, setAllMediaLength] = useState<number>(0)

  const [postsSort, setPostsSort] = useState('')
  const [postsFilter, setPostsFilter] = useState('all_media')
  const [postsGrouped, setPostsGrouped] = useState<string | boolean>(false)
  const [postsAsc, setPostsAsc] = useState('')
  const [queryToInvalidate, setQueryToInvalidate] = useState('vault_media')

  const navigate = useNavigate()

  const filter = useFilterQuery()
  const type = filter.get('type')
  const modalData = useModalContext()

  const queryClient = useQueryClient()

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
    setPostsSort('')
    setPostsFilter('all_media')
    setPostsAsc('')
  }, [activeFilter])
  function setMediaFn() {
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
  }
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useInfiniteQuery(
    ['vaultMedia', activeFilter, activeCategory, postsGrouped, postsFilter, postsSort, postsAsc],
    ({ pageParam = 0 }) =>
      getAllVaultMedia(
        activeFilter,
        pageParam,
        activeCategory[0]?.id,
        {
          filter: postsFilter,
          sort: postsSort,
          sortAsc: postsAsc,
          grouped: postsGrouped,
          mapExistingPostId: !!activeCategory[0].id
        },
        null
      ),
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.nextPage
      },
      onSuccess: resp => {
        if (resp.pages[0].data) {
          const existingIds = resp.pages[0].existingIds
          setCategoryExistingPosts(existingIds)
        }
      }
    }
  )
  useEffect(() => {
    setMediaFn()
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

  const addMediaMutation = useMutation(
    (vars: { id: number; posts: number[] }) => addMediaToCategory(vars.id, vars.posts),
    {
      onSuccess: () => {
        setAllSelectedMedia([])
        setPostIds([])
        setMediaFn()
        queryClient.invalidateQueries('allMediaCategories')
        queryClient.invalidateQueries('allVaultMediaGrouped')
        queryClient.invalidateQueries([
          'vaultMedia',
          activeFilter,
          activeCategory,
          postsGrouped,
          postsFilter,
          postsSort,
          postsAsc
        ])
        queryClient.invalidateQueries(queryToInvalidate)
        addToast('success', 'Media successfully added.')
      },
      onError: () => {
        addToast('error', 'An error occured, please try again.')
      }
    }
  )

  const deleteMediaMutation = useMutation(() => deleteFromVault(postIds), {
    onSuccess: () => {
      setAllSelectedMedia([])
      setPostIds([])
      setMediaFn()
      queryClient.invalidateQueries('allMediaCategories')
      queryClient.invalidateQueries('vaultMedia')

      queryClient.invalidateQueries('allVaultMediaGrouped')
      // queryClient.invalidateQueries([
      //   'vaultMedia',
      //   activeFilter,
      //   activeCategory,
      //   postsGrouped,
      //   postsFilter,
      //   postsSort,
      //   postsAsc,
      // ]);
      queryClient.invalidateQueries(queryToInvalidate)
      addToast('success', 'Media successfully deleted.')
    },
    onError: () => {
      addToast('error', 'An error occured, please try again.')
    }
  })

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

  useEffect(() => {
    switch (type) {
      case 'feed':
        setActiveFilter('feed')
        break
      case 'premium':
        setActiveFilter('premium')
        break
      case 'messages':
        setActiveFilter('messages')
        break
      case 'story':
        setActiveFilter('story')
        break
      default:
        setActiveFilter('all')
    }
  }, [type])

  useEffect(() => {
    if (allSelectedMedia.length > 0) {
      setDrawerOpen(true)
    } else {
      setDrawerOpen(false)
    }
  }, [allSelectedMedia])

  useEffect(() => {
    setAllSelectedMedia([])
    setSelecetedPosts([])
    setPostIds([])
    setAllMediaLength(0)
  }, [activeFilter, activeCategory, postsGrouped, postsAsc, postsFilter, postsSort])

  const { data: mediaCategroiesData } = useQuery('allMediaCategories', getMediaCategories)

  useEffect(() => {
    if (mediaCategroiesData?.data && id) {
      if (mediaCategroiesData.data.length > 0) {
        const selectedCategory = mediaCategroiesData.data.filter((category: any) => category.id === parseFloat(id))
        setActiveCategory(selectedCategory)
      } else {
        navigate('/vault', { replace: true })
        setActiveCategory([{ name: 'All', id: null, posts: 0, premium: 0, selected: true }])
      }
    }
  }, [mediaCategroiesData, id])

  return (
    <BasicLayout title={t('sharedMedia')}>
      <WithHeaderSection
        customClass={style.vault_wrapper}
        headerSection={
          <LayoutHeader
            type='title-with-buttons'
            buttons={
              type === 'feed' || type === 'premium' || type === 'messages'
                ? [
                    {
                      type: 'sort',
                      elements: type === 'feed' || type === 'premium' ? feedSort : messagesSort,
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
                        selectedSort: postsGrouped,
                        selectedOrder: postsFilter
                      },
                      applyFn: (val1: string | boolean, val2: string) => {
                        setPostsGrouped(val1)
                        setPostsFilter(val2)
                      }
                    }
                  ]
                : [
                    {
                      type: 'filter',
                      elements: feedFilter,
                      sortingProps: {
                        selectedSort: postsGrouped,
                        selectedOrder: postsFilter
                      },
                      applyFn: (val1: string | boolean, val2: string) => {
                        setPostsGrouped(val1)
                        setPostsFilter(val2)
                      }
                    }
                  ]
            }
            titleWithIcon={
              <div
                className={style.select_category_container}
                onClick={() =>
                  modalData.addModal(
                    'Select category',
                    <SelectCategoriesModal
                      onlyOne={true}
                      selectedCategories={activeCategory}
                      onSave={(val: ICategory[]) => {
                        setActiveFilter('all')
                        if (val.length > 0) {
                          const id = val[0].id
                          navigate(`/vault/${id}`)
                          setActiveCategory(val)
                        } else {
                          navigate('/vault')
                          setActiveCategory([
                            {
                              name: 'All',
                              id: null,
                              posts: 0,
                              premium: 0,
                              selected: true
                            }
                          ])
                        }
                        modalData.clearModal()
                      }}
                      onCancel={() => modalData.clearModal()}
                    />
                  )
                }
              >
                <div className={style.select_category_icon}>
                  <spriteIcons.IconList color='#ffffff' width='14' height='14' />
                </div>
                <div className={style.select_category_text}>{activeCategory[0]?.name}</div>
              </div>
            }
          />
        }
      >
        <div className={style.vault__header}>
          <LinkTabs
            route={!id ? '/vault' : `/vault/${id}`}
            filters={['all', 'feed', 'premium', 'messages', 'story']}
            activeFilter={activeFilter}
          />
        </div>

        <div className={`${style.cards_container} ${drawerOpen ? style.cards_container_drawer_open : ''}`}>
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
        <div className={`${style.shared_media_drawer} ${drawerOpen ? style.shared_media_drawer_open : ''}`}>
          <div className={style.shared_media_drawer_inner}>
            <div className={style.shared_media_button_container}>
              <div
                className={style.shared_media_drawer_button}
                onClick={() =>
                  modalData.addModal(
                    'Delete Media',
                    <ConfirmModal
                      body='Are you sure you want to delete selected media?'
                      confirmFn={() => deleteMediaMutation.mutate()}
                    />
                  )
                }
              >
                <spriteIcons.IconTrashcanLarge color='#FCFCFC' />
              </div>
              <div className={style.shared_media_drawer_button_text}>Delete</div>
            </div>

            <div className={style.shared_media_button_container}>
              <div
                className={style.shared_media_drawer_button}
                onClick={() =>
                  modalData.addModal(
                    '',
                    <ShareModal
                      clickFns={{
                        newPost: () => {
                          localStorage.setItem('share-post', JSON.stringify(allSelectedMedia))
                          modalData.clearModal()
                          navigate('/new/post/create')
                        },
                        newTabPost: () => {
                          localStorage.setItem('share-post', JSON.stringify(allSelectedMedia))
                          modalData.clearModal()
                          const newWindow = window.open(`/new/post/create`)
                          newWindow?.focus()
                        },
                        message: () => {
                          localStorage.setItem('share-message', JSON.stringify(allSelectedMedia))
                          modalData.clearModal()
                          navigate('/messages/new')
                        },
                        story: () => {
                          localStorage.setItem('share-story', JSON.stringify(allSelectedMedia))
                          modalData.clearModal()
                          navigate('/new/story')
                        }
                      }}
                      storyDisabled={allSelectedMedia.length > 1}
                    />,
                    false,
                    true,
                    style.modal_share
                  )
                }
              >
                <spriteIcons.IconShare />
              </div>
              <div className={style.shared_media_drawer_button_text}>Share</div>
            </div>

            <div className={style.shared_media_button_container}>
              <div
                className={style.shared_media_drawer_button}
                onClick={() =>
                  modalData.addModal(
                    'Add To Category',
                    <SelectCategoriesModal
                      selectedCategories={[]}
                      onlyOne={true}
                      onCancel={() => modalData.clearModal()}
                      onSave={(val: any) => {
                        if (val.length > 0) {
                          addMediaMutation.mutate({
                            id: val[0].id,
                            posts: postIds
                          })
                          modalData.clearModal()
                          setSelecetedPosts([])
                          setAllSelectedMedia([])
                        } else {
                          addToast('error', 'Select a media category')
                        }
                      }}
                      categories={mediaCategroiesData.data.filter((item: any) => item.id !== activeCategory[0].id)}
                    />
                  )
                }
              >
                <spriteIcons.IconList color='#FCFCFC' />
              </div>
              <div className={style.shared_media_drawer_button_text}>Add to</div>
            </div>
          </div>
        </div>
        {activeCategory[0] && activeCategory[0].name !== 'All' && !addToActive && (
          <div className={style.add_to_category_button} onClick={() => setAddToActive(true)}>
            <spriteIcons.IconPlus color='#ffffff' />
          </div>
        )}
        {activeCategory[0] && activeCategory[0].name !== 'All' && (
          <AddToGroupPopUp
            selectedCategory={activeCategory[0]}
            selectedCategoryPostIds={categoryExistingPosts}
            submitFn={(val: any, val2: any) => {
              addMediaMutation.mutate({
                id: activeCategory[0].id,
                posts: val2
              })
              setAddToActive(false)
            }}
            cancelFn={() => setAddToActive(false)}
            open={addToActive}
            loading={addMediaMutation.isLoading}
            setQueryToInvalidate={setQueryToInvalidate}
          />
        )}
      </WithHeaderSection>
      <DesktopAdditionalContent />
    </BasicLayout>
  )
}

export default Vault
