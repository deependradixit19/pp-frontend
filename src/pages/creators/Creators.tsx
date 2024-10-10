import { FC, useEffect, useState, useRef, useCallback } from 'react'
import { useInfiniteQuery, useQuery, useQueryClient, useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LinkTabs from '../../components/UI/LinkTabs/LinkTabs'
import CreatorsList from '../../features/CreatorsList/CreatorsList'
import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import WithHeaderSection from '../../layouts/WithHeaderSection/WithHeaderSection'
import { useFilterQuery } from '../../helpers/hooks'
import {
  deleteCreatorsRecentSearch,
  getCreators,
  getCreatorsRecentSearch,
  getFreeCreators
} from '../../services/endpoints/creators'
import SearchField from '../../components/Form/SearchField/SearchField'
import AvatarHolder from '../../components/UI/AvatarHolder/AvatarHolder'
import style from './_creators.module.scss'
import { IconClose } from '../../assets/svg/sprite'
import DesktopAdditionalContent from '../../features/DesktopAdditionalContent/DesktopAdditionalContent'

const Creators: FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchSubmit, setSearchSubmit] = useState('')
  const [activeFilter, setActiveFilter] = useState('')
  const [recentSearchOpen, setRecentSearchOpen] = useState(false)
  const [creators, setCreators] = useState<any>([])
  const navigate = useNavigate()
  const filter = useFilterQuery()

  const queryClient = useQueryClient()

  const searchRef = useRef<any>(null)

  const { t } = useTranslation()

  const filters = [
    { label: t('forYou'), value: 'forYou' },
    { label: t('free'), value: 'free' },
    { label: t('trending'), value: 'trending' },
    { label: t('live'), value: 'live' }
  ]

  const type = filter.get('type')

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus()
    }
  }, [searchSubmit])

  useEffect(() => {
    let replaceParam = typeof filters[0] === 'string' ? filters[0] : filters[0].value
    if (!type) {
      navigate(
        {
          pathname: '/creators',
          search: `?type=${replaceParam}`
        },
        { replace: true }
      )
    }

    if (type) {
      const newFilterArray = filters.filter((item: string | { label: string; value: string }) =>
        typeof item === 'string' ? item === type : item.value === type
      )
      if (newFilterArray.length === 0) {
        navigate(
          {
            pathname: '/creators',
            search: `?type=${replaceParam}`
          },
          { replace: true }
        )
      }
    }

    if (type) {
      setActiveFilter(type)
    }
  }, [type])

  const { hasNextPage, isFetching, fetchNextPage, isLoading } = useInfiniteQuery(
    ['creators', activeFilter, searchSubmit],
    ({ pageParam = 1 }) => {
      if (activeFilter === 'free') {
        return getFreeCreators({
          type: activeFilter,
          search: searchSubmit.trim() !== '' ? searchSubmit : null,
          page: pageParam
        })
      }
      return getCreators({
        type: activeFilter,
        search: searchSubmit.trim() !== '' ? searchSubmit : null,
        page: pageParam
      })
    },
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.sortedCreators.current_page === lastPage.sortedCreators.last_page
          ? undefined
          : lastPage.sortedCreators.current_page + 1
      },
      onSuccess: resp => {
        const newArray = resp.pages
          .map(page => page.sortedCreators.data)
          .reduce((prevVal, currentVal) => prevVal.concat(currentVal, []))
        const newObjects = newArray.map((creator: any) => {
          return {
            coverUrl: creator.cover,
            avatarUrl: creator.avatar,
            name: creator.name,
            handle: creator.username,
            isLive: creator.live_status || false,
            isOnline: creator.online_status || false,
            isActive: true,
            price: 14.99,
            save: 30,
            userId: creator.id
          }
        })
        queryClient.invalidateQueries('creators-recent-search')
        setCreators(newObjects)
      }
    }
  )

  const { data: recentSearches } = useQuery('creators-recent-search', getCreatorsRecentSearch)

  const observer = useRef<IntersectionObserver>()

  const lastCreatorRef = useCallback(
    (node: any) => {
      if (isFetching) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasNextPage && !isFetching) {
            fetchNextPage()
          }
        }
        // { rootMargin: '1500px' }
      )

      if (node) observer.current.observe(node)
    },
    [hasNextPage, isFetching]
  )

  const removeSearchResult = useMutation((idArray: number[]) => deleteCreatorsRecentSearch({ search_id: idArray }), {
    onMutate: async (newData: any) => {
      await queryClient.cancelQueries('creators-recent-search')
      const previousQueryData = queryClient.getQueryData('creators-recent-search')
      queryClient.setQueryData('creators-recent-search', (oldData: any) => {
        const newDataObject = {
          ...oldData.data[0],
          response: oldData.data[0].response.filter((item: any) => newData.indexOf(item.id) < 0)
        }
        const newQueryData = {
          message: oldData.message,
          data: [newDataObject]
        }
        return newQueryData
      })

      return previousQueryData
    },
    onError: (error, newData, context: any) => {
      queryClient.setQueryData('creators-recent-search', context.previousQueryData)
    }
  })

  return (
    <BasicLayout title={t('browseCreators')}>
      <WithHeaderSection
        headerSection={
          <>
            <div tabIndex={0} ref={searchRef} style={{ opacity: 0, outline: 'none' }}></div>
            <div
              className={style.search_wrapper}
              onFocus={() => setRecentSearchOpen(true)}
              onBlur={() => setRecentSearchOpen(false)}
              tabIndex={0}
            >
              <SearchField
                value={searchTerm}
                changeFn={(val: string) => setSearchTerm(val)}
                // clearFn={() => setSearchTerm('')}
                customClass={`${style.search_field} ${
                  !!recentSearches?.data[0]?.response.length && recentSearchOpen ? style.search_field_open : ''
                }`}
                additionalProps={{
                  placeholder: t('searchCreators')
                }}
                searchSettings={{
                  isForm: true,
                  formSubmitFn: e => {
                    e.preventDefault()
                    setSearchSubmit(searchTerm)
                  },
                  iconClickFn: () => setSearchSubmit(searchTerm)
                }}
                clearFn={() => {
                  setSearchTerm('')
                  setSearchSubmit('')
                }}
              />
              <div
                className={`${style.search_suggestions_container} ${
                  !!recentSearches?.data[0]?.response.length && recentSearchOpen
                    ? style.search_suggestions_container_open
                    : ''
                }`}
              >
                <div className={style.search_suggestions_title_container}>
                  <div className={style.search_suggestions_title}>{t('recentSearches')}</div>
                  <div
                    className={style.search_suggestions_clear}
                    onClick={() => {
                      if (!!recentSearches?.data[0]?.response.length) {
                        const idArray = recentSearches.data[0].response.map((recentSearch: any) => recentSearch.id)
                        removeSearchResult.mutate(idArray)
                      }
                    }}
                  >
                    {t('clear')}
                  </div>
                </div>
                <div className={style.search_suggestions_separator}></div>
                {!!recentSearches?.data[0]?.response.length &&
                  recentSearches.data[0].response.map((recentSearch: any) => (
                    <div key={recentSearch.id} className={style.search_suggestion}>
                      <AvatarHolder img={recentSearch.avatar} size='36' userId={recentSearch.id} />
                      <div className={style.search_suggestions_username_container}>
                        <div className={style.search_suggestions_name}>{recentSearch.name}</div>
                        <div className={style.search_suggestions_username}>@{recentSearch.username}</div>
                      </div>
                      <div
                        className={style.search_suggestions_remove_button}
                        onClick={e => {
                          e.stopPropagation()
                          removeSearchResult.mutate([recentSearch.id])
                        }}
                      >
                        <IconClose color='#778797' />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        }
      >
        <>
          <LinkTabs route='/creators' filters={filters} activeFilter={activeFilter} />

          {isLoading && <div className='loader'></div>}

          {!isLoading && (
            <CreatorsList
              creators={creators}
              customClass={style.browse_creators_list}
              renderLocation='creators'
              creatorRef={lastCreatorRef}
              customPlaceholderText={t('creatorsAppearHere')}
              creatorClikcFn={(creator: any) => navigate(`/profile/${creator.userId}/all`)}
            />
          )}
        </>
      </WithHeaderSection>
      <DesktopAdditionalContent />
    </BasicLayout>
  )
}

export default Creators
