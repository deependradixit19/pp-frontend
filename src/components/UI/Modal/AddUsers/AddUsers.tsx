import { FC, useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import './_addUsers.scss'
import { useTranslation } from 'react-i18next'
import LayoutHeader from '../../../../features/LayoutHeader/LayoutHeader'
import ActionCard from '../../../../features/ActionCard/ActionCard'
import RadioButton from '../../../Common/RadioButton/RadioButton'
import Button from '../../Buttons/Button'
import { getUserFans } from '../../../../services/endpoints/fans_groups'
import ModalWrapper from '../../../../features/ModalWrapper/ModalWrapper'
import SortModal from '../Sort/SortModal'
import { IconClose } from '../../../../assets/svg/sprite'

const AddUsers: FC<{ customSubmit?: any; dependecyArray?: any[] }> = ({ customSubmit, dependecyArray }) => {
  const [searchTerm, setSearchTerm] = useState<any>('')
  const [toggleRadio, setToggleRadio] = useState<Array<number>>([])
  const initialFilterSelect = {
    total_spent: 100,
    tipped: 10,
    subscribed: 1,
    inactive: 1
  }
  const [filterSelectDefaults, setFilterSelectDefaults] = useState<{
    [key: string]: string | number
  }>(initialFilterSelect)
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [filterOption, setFilterOption] = useState('')
  const [sortModalOpen, setSortModalOpen] = useState(false)
  const [sortOption, setSortOption] = useState('')
  const [sortAscOrDesc, setSortAscOrDesc] = useState('')
  const [selectAll, setSelectAll] = useState<boolean>(false)
  const [isSubmitLoading, setIsSubmitLoading] = useState(false)

  const { data, isLoading } = useQuery(
    ['user-fans', sortOption, sortAscOrDesc, filterOption, filterSelectDefaults],
    () =>
      getUserFans({
        filter_by: filterOption === '' ? null : filterOption,
        filter_value: filterSelectDefaults[filterOption as keyof typeof filterSelectDefaults],
        sort_by: sortOption,
        sort_value: sortAscOrDesc
      })
  )

  const { t } = useTranslation()

  useEffect(() => {
    if (dependecyArray) {
      setToggleRadio(dependecyArray)
    }
    if (data?.data && dependecyArray) {
      if (data?.data.length === dependecyArray.length) {
        setSelectAll(true)
      }
    }
  }, [dependecyArray, data])

  useEffect(() => {
    if (data?.data) {
      if (data?.data.length === toggleRadio.length) {
        setSelectAll(true)
      } else {
        setSelectAll(false)
      }
    }
  }, [data, toggleRadio])

  const toggleCheckbox = (id: number) => {
    if (toggleRadio.includes(id)) {
      setToggleRadio(toggleRadio.filter(item => item !== id))
      setSelectAll(false)
    } else {
      setToggleRadio([...toggleRadio, id])
    }
  }

  const selectAllFn = () => {
    if (!selectAll) {
      if (!isLoading && data?.data?.length > 0) {
        for (let i = 0; i < data?.data?.length; i++) {
          if (toggleRadio.indexOf(data.data[i].id) === -1) {
            setToggleRadio((prevState: any) => [...prevState, data.data[i].id])
          }
        }
        setSelectAll(true)
      }
    } else {
      setToggleRadio([])
      setSelectAll(false)
    }
  }

  const submitAdd = () => {
    if (customSubmit) {
      customSubmit(toggleRadio)
    }
  }

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
          label: `1 ${t('month')}+`
        },
        {
          value: 2,
          label: `2 ${t('months')}+`
        },
        {
          value: 3,
          label: `3 ${t('months')}+`
        },
        {
          value: 4,
          label: `4 ${t('months')}+`
        },
        {
          value: 5,
          label: `5 ${t('months')}+`
        },
        {
          value: 6,
          label: `6 ${t('months')}+`
        },
        {
          value: 7,
          label: `7 ${t('months')}+`
        },
        {
          value: 8,
          label: `8 ${t('months')}+`
        },
        {
          value: 9,
          label: `9 ${t('months')}+`
        },
        {
          value: 10,
          label: `10 ${t('months')}+`
        },
        {
          value: 11,
          label: `11 ${t('months')}+`
        },
        {
          value: 12,
          label: `12 ${t('months')}+`
        }
      ]
    },
    {
      value: 'inactive',
      name: t('inactive'),
      selectOptions: [
        {
          value: 1,
          label: `1 ${t('day')}+`
        },
        {
          value: 2,
          label: `2 ${t('days')}+`
        },
        {
          value: 3,
          label: `3 ${t('days')}+`
        },
        {
          value: 4,
          label: `4 ${t('days')}+`
        },
        {
          value: 5,
          label: `5 ${t('days')}+`
        },
        {
          value: 6,
          label: `6 ${t('days')}+`
        },
        {
          value: 7,
          label: `7 ${t('days')}+`
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

  const sortConversionRatio = (a: any, b: any) => {
    if (sortOption !== 'upsell_conversion_ratio') return 0
    if (a.upsell_conversion_ratio && b.upsell_conversion_ratio) {
      if (sortAscOrDesc === 'asc') return a.upsell_conversion_ratio - b.upsell_conversion_ratio
      if (sortAscOrDesc === 'desc') return b.upsell_conversion_ratio - a.upsell_conversion_ratio
    }

    return 0
  }

  return (
    <div className='addUsers__modal'>
      <LayoutHeader
        type='search-with-buttons'
        searchValue={searchTerm}
        searchFn={(term: string) => setSearchTerm(term)}
        clearFn={() => setSearchTerm('')}
        additionalProps={{ placeholder: t('searchFans') }}
        searchSettings={{
          hideIconOnMobile: true
        }}
        buttons={[
          {
            type: 'sort',
            customClickFn: () => setSortModalOpen(true)
          },
          {
            type: 'filter',
            customClickFn: () => setFilterModalOpen(true)
          }
        ]}
      />
      {filterOption !== '' && (
        <div className='add-users-active-filter'>
          <div className='add-users-active-filter-close' onClick={() => setFilterOption('')}>
            <IconClose />
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
      <div className='addUsers__modal__borderLine'></div>
      <div className='addUsers__modal__selectAll'>
        <RadioButton active={selectAll} clickFn={selectAllFn} />
        <p className='addUsers__modal__selectAll--p'>{t('selectAll')}</p>
      </div>
      <div className='addUsers__modal__actionCardContainer'>
        {isLoading && (
          <div className='add-users-loader-container'>
            <div className='loader'></div>
          </div>
        )}
        {!isLoading &&
          data?.data
            .slice()
            .sort(sortConversionRatio)
            .filter((user: any) => user.name.toLowerCase().trim().includes(searchTerm.toLowerCase().trim()))
            .map((user: any) => (
              <ActionCard
                key={user.id}
                text={user.name}
                subtext={user.username}
                hasRadio={true}
                toggleActive={toggleRadio.includes(user.id) ? true : false}
                avatar={<img className='addUsers__modal__avatar' src={user.avatar} />}
                toggleFn={() => toggleCheckbox(user.id)}
              />
            ))}
      </div>
      <div className='addUsers__modal__bottomArea--wrapper'>
        <div className='addUsers__modal__bottomArea'>
          {!isLoading && (
            <Button
              text={t('add')}
              color='black'
              width='13'
              height='3'
              font='mont-14-normal'
              customClass={`addUsers__modal__bottomArea--btn ${isSubmitLoading ? 'add-users-button-loading' : ''}`}
              clickFn={() => {
                submitAdd()
                setIsSubmitLoading(true)
              }}
            />
          )}
        </div>
      </div>
      <ModalWrapper open={filterModalOpen} setOpen={setFilterModalOpen} customClass='add-users-modal-wrapper'>
        <div className='add-users-filter-sort-title'>{t('filterBy')}</div>
        <SortModal
          elements={{ first_section: filterItemsBy }}
          sortingProps={{
            selectedSort: filterOption,
            selectedOrder: '',
            selectProps: filterSelectDefaults
          }}
          hasResetBtn={true}
          dontClearModal={true}
          applyFn={(val1: string, val2: string, selectVal: { [key: string]: string | number }) => {
            setFilterOption(val1)
            setFilterSelectDefaults(selectVal)
            setFilterModalOpen(false)
          }}
          resetFn={(setVal: any, setVal1: any, setSelectVal: any) => {
            setFilterOption('')
            setFilterSelectDefaults(initialFilterSelect)
            setVal('')
            setVal1('')
            setSelectVal(initialFilterSelect)
          }}
        />
      </ModalWrapper>
      <ModalWrapper open={sortModalOpen} setOpen={setSortModalOpen} customClass='add-users-modal-wrapper'>
        <div className='add-users-filter-sort-title'>{t('sortBy')}</div>
        <SortModal
          elements={{
            first_section: sortListsGroups,
            second_section: sortElementsOrder
          }}
          sortingProps={{
            selectedSort: sortOption,
            selectedOrder: sortAscOrDesc
          }}
          hasResetBtn={false}
          dontClearModal={true}
          applyFn={(val1: string, val2: string) => {
            setSortModalOpen(false)
            if (val1.trim() === '' || val2.trim() === '') {
              setSortOption('')
              setSortAscOrDesc('')
              return
            }
            setSortOption(val1)
            setSortAscOrDesc(val2)
          }}
        />
      </ModalWrapper>
    </div>
  )
}

export default AddUsers
