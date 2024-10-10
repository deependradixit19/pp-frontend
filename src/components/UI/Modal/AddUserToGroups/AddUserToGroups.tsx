import { FC, useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import ActionCard from '../../../../features/ActionCard/ActionCard'
import LayoutHeader from '../../../../features/LayoutHeader/LayoutHeader'
import { getFansGroups, getGroupsFromFan } from '../../../../services/endpoints/fans_groups'
import { IconTwoPeople, IconPlusInBox, IconPlus } from '../../../../assets/svg/sprite'
import RadioButton from '../../../Common/RadioButton/RadioButton'
import './_add-user-to-groups.scss'
import Button from '../../Buttons/Button'
import ModalWrapper from '../../../../features/ModalWrapper/ModalWrapper'
import SortModal from '../Sort/SortModal'
import AddFansGroupModal from '../../../../pages/fans/components/AddFansGroupModal/AddFansGroupModal'
const AddUserToGroups: FC<{
  applyFn: (item: string[] | number[]) => void
  id: number
}> = ({ applyFn, id }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortModalOpen, setSortModalOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [selectAll, setSelectAll] = useState(false)
  const [sortOptions, setSortOptions] = useState({ asc_or_desc: '', type: '' })
  const [radioArray, setRadioArray] = useState<any>([])
  const [isSubmitLoading, setIsSubmitLoading] = useState(false)

  const { data, isLoading } = useQuery('fans-groups', getFansGroups)
  const { t } = useTranslation()

  const { isLoading: isLoadingGroups } = useQuery(['fan-active-groups', id], () => getGroupsFromFan(id), {
    onSuccess: resp => {
      setRadioArray(resp)
    },
    onError: () => {
      setRadioArray([])
    }
  })

  const sortListsGroups = [
    {
      value: 'number_of_fans',
      name: t('numberOfFans')
    },
    {
      value: 'name',
      name: t('name')
    },
    {
      value: 'date_added',
      name: t('dateAdded')
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

  const sortFansGroup = (a: any, b: any) => {
    if (sortOptions.asc_or_desc === '' || sortOptions.type === '') return 0
    if (sortOptions.type === 'name') {
      const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: 'base'
      })
      if (sortOptions.asc_or_desc === 'asc') return collator.compare(a.name, b.name)
      if (sortOptions.asc_or_desc === 'desc') return collator.compare(b.name, a.name)
    }
    if (sortOptions.type === 'number_of_fans') {
      return sortOptions.asc_or_desc === 'asc' ? a.count - b.count : b.count - a.count
    }
    if (sortOptions.type === 'date_added') {
      if (new Date(a.date_added) < new Date(b.date_added)) return sortOptions.asc_or_desc === 'asc' ? -1 : 1
      if (new Date(a.date_added) > new Date(b.date_added)) return sortOptions.asc_or_desc === 'asc' ? 1 : -1
    }
  }

  const toggleCheckbox = (id: number) => {
    if (radioArray.includes(id)) {
      setRadioArray(radioArray.filter((item: any) => item !== id))
      setSelectAll(false)
    } else {
      setRadioArray([...radioArray, id])
    }
  }

  const selectAllFn = () => {
    if (!selectAll) {
      if (!isLoading && !isLoadingGroups && data?.data?.length > 0) {
        for (let i = 0; i < data?.data?.length; i++) {
          if (radioArray.indexOf(data.data[i].id) === -1) {
            setRadioArray((prevState: any) => [...prevState, data.data[i].id])
          }
        }
        setSelectAll(true)
      }
    } else {
      setRadioArray([])
      setSelectAll(false)
    }
  }

  useEffect(() => {
    if (data?.data) {
      if (data?.data.length === radioArray.length) {
        setSelectAll(true)
      } else {
        setSelectAll(false)
      }
    }
  }, [data, radioArray])

  return (
    <div className='add-users-to-groups-modal-container'>
      <LayoutHeader
        type='search-with-buttons'
        searchValue={searchTerm}
        searchFn={(val: string) => setSearchTerm(val)}
        clearFn={() => setSearchTerm('')}
        additionalProps={{ placeholder: t('searchGroups') }}
        searchSettings={{
          hideIconOnMobile: true
        }}
        buttons={[
          {
            type: 'sort',
            customClickFn: () => setSortModalOpen(true)
          },
          {
            type: 'custom',
            icon: <IconPlus />,
            color: 'white',
            action: () => setAddModalOpen(true),
            customClass: 'add-user-to-groups-add-button'
          }
        ]}
      />
      <div className='add-user-to-groups-separator'></div>
      <div className='add-user-to-groups-select-all-container'>
        <RadioButton active={selectAll} clickFn={selectAllFn} />
        <p className='add-user-to-groups-select-all-text'>{t('selectAll')}</p>
      </div>
      <div className='add-user-to-groups-container'>
        {(isLoading || isLoadingGroups) && (
          <div className='add-user-to-groups-loader'>
            <div className='loader'></div>
          </div>
        )}
        {!isLoading &&
          !isLoadingGroups &&
          data?.data
            .slice()
            .sort((a: any, b: any) => sortFansGroup(a, b))
            .filter((group: any) => group.default === 0)
            .filter((group: any) => group.name.toLowerCase().trim().includes(searchTerm.toLowerCase().trim()))
            .map((group: any) => (
              <ActionCard
                key={group.id}
                icon={<IconTwoPeople />}
                text={group.name}
                subtext={`${group.count ? group.count : 0} fans`}
                absFix={true}
                customClass='add-user-to-groups-action-card'
                hasRadio={true}
                toggleActive={radioArray.includes(group.id) ? true : false}
                toggleFn={() => toggleCheckbox(group.id)}
              />
            ))}

        {!isLoading && !isLoadingGroups && (
          <ActionCard
            icon={<IconPlusInBox width='28' height='28' />}
            subtext={t('addNewGroup')}
            clickFn={() => setAddModalOpen(true)}
            customClass='add-user-to-groups-action-card'
          />
        )}
      </div>
      <div className='add-user-to-groups-button-container-wrapper'>
        <div className='add-user-to-groups-button-container'>
          <Button
            text={t('add')}
            color='black'
            width='13'
            height='3'
            font='mont-14-normal'
            customClass={`add-user-to-groups-button ${isSubmitLoading ? 'add-user-to-groups-button-loading' : ''}`}
            clickFn={() => {
              applyFn(radioArray)
              setIsSubmitLoading(true)
            }}
          />
        </div>
      </div>
      <ModalWrapper open={sortModalOpen} setOpen={setSortModalOpen} customClass='add-user-to-groups-modal-wrapper-card'>
        <div className='add-user-to-groups-modal-title'>{t('sortBy')}</div>
        <SortModal
          elements={{
            first_section: sortListsGroups,
            second_section: sortElementsOrder
          }}
          sortingProps={{
            selectedSort: sortOptions.type,
            selectedOrder: sortOptions.asc_or_desc
          }}
          hasResetBtn={false}
          dontClearModal={true}
          applyFn={(val1: string, val2: string) => {
            setSortModalOpen(false)
            if (val1.trim() === '' || val2.trim() === '') {
              setSortOptions({ asc_or_desc: '', type: '' })
              return
            }
            setSortOptions({ asc_or_desc: val2, type: val1 })
          }}
        />
      </ModalWrapper>
      <ModalWrapper open={addModalOpen} setOpen={setAddModalOpen} customClass='add-user-to-groups-modal-wrapper-card'>
        <div className='add-user-to-groups-modal-title'>{t('addNewGroup')}</div>
        <AddFansGroupModal dontClearModal={true} customCloseFn={() => setAddModalOpen(false)} />
      </ModalWrapper>
    </div>
  )
}

export default AddUserToGroups
