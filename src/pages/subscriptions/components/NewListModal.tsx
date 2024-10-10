import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { t } from 'i18next'

// Services
import { useModalContext } from '../../../context/modalContext'
import { ICreator, ISubscriptionModelsServerResponse } from '../../../types/interfaces/ICreator'
import { getSubscriptionModels } from '../../../services/endpoints/api_subscription'
import { addUsersToSubscriptionList, createSubscripitonList } from '../../../services/endpoints/subscription_lists'
import { ISubscriptionList } from '../../../types/interfaces/ITypes'
import { addToast } from '../../../components/Common/Toast/Toast'

// Components
import CheckboxField from '../../../components/Form/CheckboxField/CheckboxField'
import LayoutHeader from '../../../features/LayoutHeader/LayoutHeader'
import CreatorsList from '../../../features/CreatorsList/CreatorsList'
import Button from '../../../components/UI/Buttons/Button'
import InputField from '../../../components/Form/InputField/InputField'

// Styling
import './_newListModal.scss'

interface NewListModalProps {
  chosenSort?: string
  chosenOrder?: string
  chosenListName?: string
  chosenSearchFilter?: string
  chosenCreators?: number[]
}

const useSortSubsTop = () => {
  const { t } = useTranslation()
  return [
    {
      value: 'name',
      name: t('name')
    },
    {
      value: 'recently_added',
      name: t('recentlyAdded')
    },
    {
      value: 'total_subscriptions',
      name: t('totalSubscriptions')
    }
  ]
}

const useSubsOrder = () => {
  return [
    {
      value: 'ascending',
      name: t('ascending')
    },
    {
      value: 'descending',
      name: t('descending')
    }
  ]
}

const NewListModal: FC<NewListModalProps> = ({
  chosenOrder,
  chosenSort,
  chosenListName,
  chosenSearchFilter,
  chosenCreators
}) => {
  const [isCreatingSubscriptionList, setIsCreatingSubscrioptionList] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedSort, setSelectedSort] = useState('name')
  const [selectedOrder, setSelectedOrder] = useState('ascending')

  const [selectAll, setSelectAll] = useState(false)
  const [listName, setListName] = useState('')
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [creatorsData, setCreatorsData] = useState<ICreator[]>([])
  const [displayedCreatorsData, setDisplayedCreatorsData] = useState<ICreator[]>([])

  const modalData = useModalContext()
  const sortSubsTop = useSortSubsTop()
  const sortSubsOrder = useSubsOrder()
  const queryClient = useQueryClient()

  useEffect(() => {
    const sortedData = sortCreators(creatorsData, selectedOrder)

    setCreatorsData(sortedData)
    setDisplayedCreatorsData(sortedData)
  }, [selectedSort, selectedOrder])

  useEffect(() => {
    if (selectedItems.length === creatorsData.length) {
      setSelectAll(true)
    } else {
      setSelectAll(false)
    }
  }, [selectedItems, creatorsData])

  useEffect(() => {
    chosenSort && setSelectedSort(chosenSort)
    chosenOrder && setSelectedOrder(chosenOrder)
    chosenListName && setListName(chosenListName)
    chosenSearchFilter && setSearchTerm(chosenSearchFilter)
    chosenCreators && setSelectedItems(chosenCreators)
    setScubscriptions()
  }, [])

  useEffect(() => {
    const filteredList = creatorsData.filter(creator => creator.name.toLowerCase().includes(searchTerm))

    setDisplayedCreatorsData(filteredList)
  }, [searchTerm])

  const setScubscriptions = async () => {
    if (!creatorsData.length) {
      const data: { data: ISubscriptionModelsServerResponse[] } = await getSubscriptionModels()
      let ICreators = data.data.map(element => {
        return convertSubscriptionModelToICreator(element)
      })

      if (chosenSearchFilter) {
        ICreators = ICreators.filter(creator => {
          return creator.name.includes(chosenSearchFilter)
        })
      }
      setCreatorsData(ICreators)

      const order = chosenOrder ? chosenOrder : selectedOrder
      setDisplayedCreatorsData(sortCreators(ICreators, order))
    }
  }

  const convertSubscriptionModelToICreator = (subscriptionModel: ISubscriptionModelsServerResponse): ICreator => {
    const date = new Date()
    const dateString = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.000000Z`
    return {
      coverUrl: subscriptionModel.cover.url,
      avatarUrl: subscriptionModel.avatar.url,
      name: subscriptionModel.name,
      handle: subscriptionModel.username,
      isLive: subscriptionModel.is_live,
      isActive: subscriptionModel.online_status,
      isOnline: subscriptionModel.online_status,
      price: 0,
      save: null,
      userId: subscriptionModel.id,
      initialSubscriptionDate: dateString,
      numberOfSubs: Math.random() * (1000 - 0),
      registeredAt: 0 //not sure what i need here
    }
  }

  const sortCreators = (list: ICreator[], order: string) => {
    const key = chosenSort ? chosenSort : selectedSort
    switch (key) {
      case 'name':
        return sortCreatorsByName(order, list)
      case 'recently_added':
        return sortCreatorsByDate(order, list)
      case 'total_subscriptions':
        return sortCreatorsBySubCount(order, list)

      default:
        return sortCreatorsByName(order, list)
    }
  }

  const sortCreatorsByName = (order: string, list: ICreator[]): ICreator[] => {
    const orderingConst = order === 'ascending' ? 1 : -1
    const newList = list

    newList.sort((a, b) => a.name.localeCompare(b.name, 'en') * orderingConst)

    return newList
  }

  const sortCreatorsByDate = (order: string, list: ICreator[]): ICreator[] => {
    const orderingConst = order === 'ascending' ? 1 : -1
    const newList = list

    newList.sort((a, b) => {
      if (a.initialSubscriptionDate && b.initialSubscriptionDate) {
        const firstDate = new Date(a.initialSubscriptionDate)
        const secondDate = new Date(b.initialSubscriptionDate)
        return (firstDate.getTime() - secondDate.getTime()) * orderingConst
      } else {
        return 1
      }
    })

    return newList
  }

  const sortCreatorsBySubCount = (order: string, list: ICreator[]): ICreator[] => {
    const orderingConst = order === 'ascending' ? 1 : -1
    const newList = list

    newList.sort((a, b) => {
      if (a.numberOfSubs && b.numberOfSubs) {
        return (a.numberOfSubs - b.numberOfSubs) * orderingConst
      } else {
        return 1
      }
    })

    return newList
  }

  const onSortAndOrderChoose = (sort: string, order: string) => {
    setSelectedSort(sort)
    setSelectedOrder(order)

    modalData.addModal(
      t('createNewList'),
      <NewListModal
        chosenOrder={order}
        chosenSort={sort}
        chosenListName={listName}
        chosenSearchFilter={searchTerm}
        chosenCreators={selectedItems}
      />,
      false
    )
  }

  const handleSelect = (id: number) => {
    if (selectedItems.includes(id)) {
      const tmp = selectedItems.filter(item => item !== id)
      setSelectedItems(tmp)
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const handleSelectAll = () => {
    if (!selectAll) {
      const tmp = creatorsData.map(creator => creator.userId)
      setSelectedItems(tmp)
    } else {
      setSelectedItems([])
    }
  }

  const handleNextClick = async () => {
    if (listName && selectedItems.length > 0) {
      setIsCreatingSubscrioptionList(true)
      const data: { subscription_list: ISubscriptionList } = await createSubscripitonList(listName)
      await addUsersToSubscriptionList(data.subscription_list.id, selectedItems)
      queryClient.invalidateQueries(['allSubscriptionLists'])
      setIsCreatingSubscrioptionList(false)
      modalData.clearModal()
      addToast('success', t('successfulAddingList'))
    } else {
      addToast('error', t('error:addNameAndMembers'))
    }
  }

  return (
    <div className='newListModal'>
      <div>
        <InputField
          id='inputId'
          type='text'
          value={listName}
          changeFn={(changedValue: string) => setListName(changedValue)}
          label={t('listName')}
          additionalProps={{
            placeholder: t('listName'),
            maxlength: '16'
          }}
        />
      </div>
      <div className='newListModal__divider'></div>
      <LayoutHeader
        type='search-with-buttons'
        searchValue={searchTerm}
        searchFn={(term: string) => setSearchTerm(term)}
        clearFn={() => setSearchTerm('')}
        buttons={[
          {
            type: 'sort',
            elements: {
              first_section: sortSubsTop,
              second_section: sortSubsOrder
            },
            dontClearModal: true
          }
        ]}
        applyFn={(tempVal: string, tempVal1: string) => {
          onSortAndOrderChoose(tempVal, tempVal1)
        }}
      />
      <div className='newListModal__divider'></div>
      <div className='newListModal__selection'>
        <CheckboxField
          id='subscribers-select-all'
          value='selectAll'
          label={t('selectAll')}
          checked={selectAll}
          changeFn={() => handleSelectAll()}
        />
        <p>
          <span>{selectedItems.length}</span> {t('selected')}
        </p>
      </div>
      <div className='newListModal__subscribers'>
        <CreatorsList
          heightAdjustment={320}
          creators={displayedCreatorsData}
          renderLocation='newList'
          selectedItems={selectedItems}
          onSelect={handleSelect}
        />
      </div>
      <div className='newListModal__footer'>
        <Button
          text={t('next')}
          color='black'
          font='mont-14-normal'
          width='13'
          height='3'
          disabled={isCreatingSubscriptionList}
          clickFn={handleNextClick}
        />
      </div>
    </div>
  )
}

export default NewListModal
