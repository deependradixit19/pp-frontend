import { FC, useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { t } from 'i18next'
import toast from 'react-hot-toast'
import { getSubscriptionLists, selectSubscriptionLists } from '../../../../services/endpoints/subscription_lists'
import { ISubscriptionList } from '../../../../types/interfaces/ITypes'
import FansList from '../../../../features/FansList/FansList'
import RadioButton from '../../../Common/RadioButton/RadioButton'
import { useModalContext } from '../../../../context/modalContext'
import { addToast } from '../../../Common/Toast/Toast'

interface ManageFeedProps {
  onApply?: (id: number) => void
  chosenListId?: number
}

const ManageFeed: FC<ManageFeedProps> = () => {
  const [selectedLists, setSelectedLists] = useState<number[]>([])
  const modalData = useModalContext()
  const queryClient = useQueryClient()

  const { data } = useQuery('allSubscriptionLists', getSubscriptionLists, {
    refetchOnWindowFocus: false,
    staleTime: 5000
  })

  const selectListsMutation = useMutation(() => selectSubscriptionLists(selectedLists), {
    onSuccess: () => {
      queryClient.invalidateQueries('allSubscriptionLists')
      toast.dismiss()
      addToast('success', 'Successfully updated')
      modalData.clearModal()
    },
    onError: () => {
      toast.dismiss()
      addToast('error', 'An error occured, please try again')
      modalData.clearModal()
    }
  })

  useEffect(() => {
    if (data) {
      const selected = data.data
        .filter((list: { selected: number }) => list.selected)
        .map((item: { id: number }) => item.id)
      setSelectedLists(selected)
    }
  }, [data])

  const toggleList = (id: number) => {
    if (selectedLists.includes(id)) {
      const tmp = selectedLists.filter(listId => listId !== id)
      if (!tmp.length) {
        setSelectedLists([data.data[0].id])
      } else {
        setSelectedLists(tmp)
      }
    } else {
      setSelectedLists([...selectedLists, id])
    }
  }

  return (
    <div>
      <ul className='groupsDd__body__list'>
        <div className='groupsDd__body__list--primary'>
          {Boolean(data && data.data) &&
            data.data.map((list: ISubscriptionList, index: number) => (
              <li key={index} className={`groupsDd__body__list__item`}>
                <FansList
                  type='creators'
                  title={list.name}
                  fans={{ avatars: list.avatars, count: list.count }}
                  customClass='groupsDd__body__list__withRadio'
                />
                <RadioButton
                  active={selectedLists.includes(list.id)}
                  customClass='groupsDd__body__list__radio'
                  clickFn={() => {
                    toggleList(list.id)
                  }}
                />
              </li>
            ))}
        </div>
      </ul>
      <div className='buttons__wrapper'>
        <button
          className='groupsDd__close'
          onClick={() => {
            modalData.clearModal()
          }}
        >
          {t('cancel')}
        </button>

        <button className='groupsDd__apply' onClick={() => selectListsMutation.mutate()}>
          {t('apply')}
        </button>
      </div>
    </div>
  )
}

export default ManageFeed
