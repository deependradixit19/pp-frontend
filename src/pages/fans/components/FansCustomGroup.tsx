import { FC, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'
import LayoutHeader from '../../../features/LayoutHeader/LayoutHeader'
import WithHeaderSection from '../../../layouts/WithHeaderSection/WithHeaderSection'
import * as Icons from '../../../assets/svg/sprite'
import ActionCard from '../../../features/ActionCard/ActionCard'
import { useModalContext } from '../../../context/modalContext'
import AddUsers from '../../../components/UI/Modal/AddUsers/AddUsers'
import { addFanToGroups, getFansGroups, getUsersFromFansGroup } from '../../../services/endpoints/fans_groups'
import { editFansGroup } from '../../../services/endpoints/fans_groups'
import { addToast } from '../../../components/Common/Toast/Toast'
import AddUserToGroups from '../../../components/UI/Modal/AddUserToGroups/AddUserToGroups'
import UserDetails from '../../../components/UI/Modal/UserDetails/UserDetails'

const FansCustomGroup: FC<{ name?: any }> = ({ name }) => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [dependecyArray, setDependecyArray] = useState<number[]>([])
  const initialFilterSelect = {
    total_spent: 100,
    tipped: 10,
    subscribed: 1,
    inactive: 1
  }
  const [filterSelectDefaults, setFilterSelectDefaults] = useState<{
    [key: string]: string | number
  }>(initialFilterSelect)
  const [filterOption, setFilterOption] = useState('')
  const [sortOption, setSortOption] = useState('')
  const [sortAscOrDesc, setSortAscOrDesc] = useState('')

  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [groupName, setGroupName] = useState(
    location.state?.groupName === 'All' ? t('allActive') : location.state?.groupName || 'Loading...'
  )
  const [groupDefault, setGroupDefault] = useState(location.state?.defaultGroup === 0 ? 0 : 1 || 1)
  const modalData = useModalContext()
  const queryClient = useQueryClient()
  const [id, setId] = useState(location.state?.id || null)

  const { data, isLoading } = useQuery(
    ['fans-groups', id, filterOption, filterSelectDefaults],
    () =>
      getUsersFromFansGroup(id, {
        filter_by: filterOption,
        filter_value: filterSelectDefaults[filterOption as keyof typeof filterSelectDefaults]
      }),
    {
      enabled: id ? true : false,
      onSuccess: resp => {
        if (resp.data.length > 0) {
          setDependecyArray([])
          for (let i = 0; i < resp.data.length; i++) {
            setDependecyArray((prevState: any) => [...prevState, resp.data[i].id])
          }
        } else {
          setDependecyArray([])
        }
      },
      onError: () => {
        addToast('error', t('anErrorOccuredPleaseTryAgain'))
      }
    }
  )

  const { isLoading: isLoadingGroup } = useQuery('fans-groups', getFansGroups, {
    enabled: groupName === 'Loading...',
    onSuccess: resp => {
      let nameCompare = name === 'all_active' ? 'all' : name.toLowerCase().replace('_', ' ')
      for (let i = 0; i < resp.data.length; i++) {
        if (resp.data[i].name.toLowerCase().replace('_', ' ') === nameCompare) {
          setGroupName(resp.data[i].name === 'All' ? t('allActive') : resp.data[i].name)
          setGroupDefault(resp.data[i].default)
          setId(resp.data[i].id)
        }
      }
    }
  })

  const addFansToGroup = useMutation((val: number[]) => editFansGroup(id, { name: groupName, participants: val }), {
    onSuccess: (resp, params) => {
      addToast('success', t('successfullyUpdated'))
      queryClient.invalidateQueries(['fans-groups', id, filterOption, filterSelectDefaults])
      queryClient.invalidateQueries('fans-groups')
      for (let i = 0; i < params.length; i++) {
        queryClient.invalidateQueries([['fan-active-groups', params[i]]])
      }
      modalData.clearModal()
    },
    onError: () => {
      addToast('error', t('anErrorOccuredPleaseTryAgain'))
      modalData.clearModal()
    }
  })

  const addFanToGroupsMutation = useMutation(
    (mutationInfo: { id: number; groupIds: string[] | number[] }) =>
      addFanToGroups(mutationInfo.id, mutationInfo.groupIds),
    {
      onSuccess: (resp, params) => {
        addToast('success', t('successfullyUpdated'))
        queryClient.invalidateQueries(['fans-groups', id, filterOption, filterSelectDefaults])
        queryClient.invalidateQueries('fans-groups')
        queryClient.invalidateQueries([['fan-active-groups', params.id]])
        modalData.clearModal()
      },
      onError: () => {
        addToast('error', t('anErrorOccuredPleaseTryAgain'))
        queryClient.invalidateQueries('fans-groups')
        modalData.clearModal()
      }
    }
  )

  const sortListsGroups = [
    {
      value: 'expiring',
      name: t('expiring')
    },
    {
      value: 'total_spent',
      name: t('totalSpent')
    },
    {
      value: 'last_activity',
      name: t('lastActivity')
    },
    {
      value: 'name',
      name: t('name')
    },
    {
      value: 'join_date',
      name: t('joinDate')
    },
    {
      value: 'total_months_subscribed',
      name: t('totalMonthsSubscribed')
    },
    {
      value: 'upsell_conversion_ratio',
      name: t('upsellConversionRatio')
    }
  ]

  const sortElementsOrder = [
    {
      value: 'asc',
      name: t('ascending')
    },
    {
      value: 'desc',
      name: t('descending')
    }
  ]

  const filterItemsBy = [
    {
      value: 'total_spent',
      name: t('totalSpent'),
      selectOptions: [
        {
          value: 100,
          label: '$100+'
        },
        {
          value: 200,
          label: '$200+'
        },
        {
          value: 300,
          label: '$300+'
        },
        {
          value: 400,
          label: '$400+'
        },
        {
          value: 500,
          label: '$500+'
        },
        {
          value: 600,
          label: '$600+'
        },
        {
          value: 700,
          label: '$700+'
        },
        {
          value: 800,
          label: '$800+'
        },
        {
          value: 900,
          label: '$900+'
        },
        {
          value: 1000,
          label: '$1000+'
        }
      ]
    },
    {
      value: 'tipped',
      name: t('tipped'),
      selectOptions: [
        {
          value: 10,
          label: '$10+'
        },
        {
          value: 20,
          label: '$20+'
        },
        {
          value: 30,
          label: '$30+'
        },
        {
          value: 40,
          label: '$40+'
        },
        {
          value: 50,
          label: '$50+'
        },
        {
          value: 60,
          label: '$60+'
        },
        {
          value: 70,
          label: '$70+'
        },
        {
          value: 80,
          label: '$80+'
        },
        {
          value: 90,
          label: '$90+'
        },
        {
          value: 100,
          label: '$100+'
        },
        {
          value: 110,
          label: '$110+'
        },
        {
          value: 120,
          label: '$120+'
        },
        {
          value: 130,
          label: '$130+'
        },
        {
          value: 140,
          label: '$140+'
        },
        {
          value: 150,
          label: '$150+'
        },
        {
          value: 160,
          label: '$160+'
        },
        {
          value: 170,
          label: '$170+'
        },
        {
          value: 180,
          label: '$180+'
        },
        {
          value: 190,
          label: '$190+'
        },
        {
          value: 200,
          label: '$200+'
        }
      ]
    },
    {
      value: 'subscribed',
      name: t('subscribed'),
      selectOptions: [
        {
          value: 1,
          label: '1 month+'
        },
        {
          value: 2,
          label: '2 months+'
        },
        {
          value: 3,
          label: '3 months+'
        },
        {
          value: 4,
          label: '4 months+'
        },
        {
          value: 5,
          label: '5 months+'
        },
        {
          value: 6,
          label: '6 months+'
        },
        {
          value: 7,
          label: '7 months+'
        },
        {
          value: 8,
          label: '8 months+'
        },
        {
          value: 9,
          label: '9 months+'
        },
        {
          value: 10,
          label: '10 months+'
        },
        {
          value: 11,
          label: '11 months+'
        },
        {
          value: 12,
          label: '12 months+'
        }
      ]
    },
    {
      value: 'inactive',
      name: t('inactive'),
      selectOptions: [
        {
          value: 1,
          label: '1 day+'
        },
        {
          value: 2,
          label: '2 days+'
        },
        {
          value: 3,
          label: '3 days+'
        },
        {
          value: 4,
          label: '4 days+'
        },
        {
          value: 5,
          label: '5 days+'
        },
        {
          value: 6,
          label: '6 days+'
        },
        {
          value: 7,
          label: '7 days+'
        }
      ]
    },
    {
      value: 'online',
      name: t('online')
    },
    {
      value: 'renew_on',
      name: t('renewOn')
    },
    {
      value: 'renew_off',
      name: t('renewOff')
    }
  ]

  const sortFans = (a: any, b: any) => {
    if (sortOption === '' || sortAscOrDesc === '') return 0

    if (sortOption === 'name') {
      const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: 'base'
      })
      if (sortAscOrDesc === 'asc') return collator.compare(a.statistics.name, b.statistics.name)
      if (sortAscOrDesc === 'desc') return collator.compare(b.statistics.name, a.statistics.name)
    }

    if (sortOption === 'expiring' || sortOption === 'last_activity' || sortOption === 'join_date') {
      if (a.statistics[sortOption] && b.statistics[sortOption]) {
        if (
          new Date(a.statistics[sortOption].replace(/\s/, 'T')) > new Date(b.statistics[sortOption].replace(/\s/, 'T'))
        )
          return sortAscOrDesc === 'asc' ? 1 : -1
        if (
          new Date(a.statistics[sortOption].replace(/\s/, 'T')) < new Date(b.statistics[sortOption].replace(/\s/, 'T'))
        )
          return sortAscOrDesc === 'asc' ? -1 : 1
      }
    }

    if (
      sortOption === 'total_spent' ||
      sortOption === 'total_months_subscribed' ||
      sortOption === 'upsell_conversion_ratio'
    ) {
      if (a.statistics[sortOption] && b.statistics[sortOption]) {
        if (sortAscOrDesc === 'asc') return a.statistics[sortOption] - b.statistics[sortOption]
        if (sortAscOrDesc === 'desc') return b.statistics[sortOption] - a.statistics[sortOption]
      }
    }

    return 0
  }

  const renderSortOptionTags = (user: any) => {
    if (sortOption !== '' && sortOption !== 'name') {
      const monthArray = [
        t('jan'),
        t('feb'),
        t('mar'),
        t('apr'),
        t('may'),
        t('jun'),
        t('jul'),
        t('aug'),
        t('sept'),
        t('oct'),
        t('nov'),
        t('dec')
      ]
      if (sortOption === 'expiring' || sortOption === 'last_activity' || sortOption === 'join_date') {
        const tagText =
          sortOption === 'expiring'
            ? t('subRenewDate')
            : sortOption === 'last_activity'
            ? t('lastActivityOn')
            : sortOption === 'join_date'
            ? t('joinDateOn')
            : ''
        const expiringDate = user.statistics[sortOption]
          ? new Date(user.statistics[sortOption].replace(/\s/, 'T'))
          : null
        const day = expiringDate ? expiringDate.getDate() : null
        const year = expiringDate ? expiringDate.getFullYear() : null
        const month = expiringDate ? monthArray[expiringDate.getMonth()] : null

        return expiringDate ? (
          <div className='fans-group-sort-option-tag'>
            {tagText}
            <span>{`${month} ${day}, ${year}`}</span>
          </div>
        ) : (
          ''
        )
      }

      if (sortOption === 'total_spent') {
        return user.statistics.total_spent ? (
          <div className='fans-group-sort-option-tag'>
            {t('totalSpent')} <span>${user.statistics.total_spent}</span>
          </div>
        ) : (
          ''
        )
      }

      if (sortOption === 'total_months_subscribed') {
        return user.statistics.total_months_subscribed ? (
          <div className='fans-group-sort-option-tag'>
            {t('totalMonthsSubscribed')} <span>{user.statistics.total_months_subscribed}</span>
          </div>
        ) : (
          ''
        )
      }

      if (sortOption === 'upsell_conversion_ratio') {
        return user.statistics.upsell_conversion_ratio ? (
          <div className='fans-group-sort-option-tag'>
            {t('upsellConversionRatio')} <span>{user.statistics.upsell_conversion_ratio}</span>
          </div>
        ) : (
          ''
        )
      }
    }
    return ''
  }

  useEffect(() => {
    if (name.toLowerCase() === 'all') {
      navigate('/fans/all_active', { replace: true })
    }
    if (name.toLowerCase() === 'friends' || name.toLowerCase() === 'fans') {
      navigate('/fans', { replace: true })
    }
  }, [name])

  return (
    <WithHeaderSection
      headerSection={
        <LayoutHeader
          type='search-with-buttons'
          searchValue={searchTerm}
          searchFn={(term: string) => setSearchTerm(term)}
          clearFn={() => setSearchTerm('')}
          additionalProps={{ placeholder: t('searchFans') }}
          buttons={[
            {
              type: 'sort',
              customClass: 'aaa',
              elements: {
                first_section: sortListsGroups,
                second_section: sortElementsOrder
              },
              sortingProps: {
                selectedSort: sortOption,
                selectedOrder: sortAscOrDesc
              },
              applyFn: (val1: string, val2: string) => {
                if (val1.trim() === '' || val2.trim() === '') {
                  setSortOption('')
                  setSortAscOrDesc('')
                  return
                }
                setSortOption(val1)
                setSortAscOrDesc(val2)
              }
            },
            {
              type: 'filter',
              elements: {
                first_section: filterItemsBy
              },
              hasResetBtn: true,
              sortingProps: {
                selectedSort: filterOption,
                selectedOrder: '',
                selectProps: filterSelectDefaults
              },
              applyFn: (val1: string, val2: string, selectVal: { [key: string]: string | number }) => {
                setFilterOption(val1)
                setFilterSelectDefaults(selectVal)
              },
              resetFn: (setVal: any, setVal2: any, setSelectVal: any) => {
                setFilterOption('')
                setFilterSelectDefaults(initialFilterSelect)
                setVal('')
                setVal2('')
                setSelectVal(initialFilterSelect)
              }
            },
            groupDefault === 0 && {
              type: 'custom',
              icon: <Icons.IconPlus />,
              color: `${groupDefault === 0 ? 'white' : 'disabled'}`,
              action: () => {
                if (groupDefault === 0) {
                  modalData.addModal(
                    t('addUsers'),
                    <AddUsers customSubmit={(val: any) => addFansToGroup.mutate(val)} dependecyArray={dependecyArray} />
                  )
                }
              },
              customClass: 'fans-group-add-button'
            }
          ]}
        />
      }
    >
      <div className='fans-custom-group-title-container'>
        <h1 className='fansCustomGroup--h1'>{groupName}</h1>

        {!isLoading && (
          <div className='fans-custom-group-count'>
            <span>{data?.data?.length}</span> {t('Fans')}
          </div>
        )}
      </div>
      {filterOption !== '' && (
        <div className='fans-custom-group-active-filter'>
          <div className='fans-custom-group-active-filter-close' onClick={() => setFilterOption('')}>
            <Icons.IconClose />
          </div>
          {filterItemsBy.filter((item: any) => item.value === filterOption)[0].name}

          {filterSelectDefaults[filterOption] && (
            <span>
              {
                filterItemsBy
                  .filter((item: any) => item.value === filterOption)[0]
                  .selectOptions?.filter((item: any) => item.value === filterSelectDefaults[filterOption])[0].label
              }
            </span>
          )}
        </div>
      )}
      {(isLoading || isLoadingGroup) && (
        <div className='fans-home-loader-container'>
          <div className='loader'></div>
        </div>
      )}
      {!isLoading &&
        !isLoadingGroup &&
        data?.data
          ?.slice()
          .sort(sortFans)
          .filter((user: any) => user.display_name.toLowerCase().trim().includes(searchTerm.toLowerCase().trim()))
          .map((user: any) => (
            <ActionCard
              key={user.id}
              text={user.display_name || ''}
              subtext={user.username ? `@${user.username}` : ''}
              description={renderSortOptionTags(user)}
              customClass='fans-group-action-card'
              avatar={
                <img
                  onClick={() => modalData.addModal('', <UserDetails user={user} />, true)}
                  className='addUsers__modal__avatar'
                  src={user.avatar?.url}
                  alt={t('avatar')}
                />
              }
              customHtml={
                <div className='actionCard__fans__icons'>
                  <div
                    className='actionCard__fans__icons--twoPeople'
                    onClick={() =>
                      modalData.addModal(
                        t('addUserToGroups'),
                        <AddUserToGroups
                          applyFn={(val: any) =>
                            addFanToGroupsMutation.mutate({
                              id: user.id,
                              groupIds: val
                            })
                          }
                          id={user.id}
                        />
                      )
                    }
                  >
                    <Icons.IconTwoPeopleOutline />
                  </div>
                  <Link to={`/chat/${user.id}`} className='actionCard__fans__icons--chatOutline'>
                    <Icons.IconChatOutline color='#2894FF' />
                  </Link>
                </div>
              }
            />
          ))}
      {/* {(!isLoading && (filterOption !== "" && data?.data?.length === 0)) &&
        <div>No fans with this filter</div>
      } */}
      {!isLoading && !isLoadingGroup && groupDefault === 0 && (
        <ActionCard
          subtext={t('addUsers')}
          icon={<Icons.IconPlusInBox width='28' height='28' />}
          clickFn={() =>
            modalData.addModal(
              t('addUsers'),
              <AddUsers customSubmit={(val: any) => addFansToGroup.mutate(val)} dependecyArray={dependecyArray} />
            )
          }
        />
      )}
    </WithHeaderSection>
  )
}

export default FansCustomGroup
