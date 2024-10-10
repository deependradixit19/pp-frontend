import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'

import NavigationBar from '../../../components/UI/NavigationBar/NavigationBar'
import { getSubscriptionLists } from '../../../services/endpoints/subscription_lists'

import './_feedNavbar.scss'

interface FeedNavbarProps {
  onApply: (id: number) => void
  chosenListId?: number
}

const FeedNavbar: FC<FeedNavbarProps> = ({ onApply, chosenListId }) => {
  const [lists, setLists] = useState<string[]>([])
  const { t } = useTranslation()

  const { data, error } = useQuery('allSubscriptionLists', getSubscriptionLists, {
    refetchOnWindowFocus: false,
    staleTime: 5000
  })

  useEffect(() => {
    if (data) {
      const customLists = data.data
        .filter((list: { selected: number; name: string }) => list.selected)
        .map((item: { name: string }) => item.name.toLowerCase())
      setLists([...customLists])
    }
  }, [data])

  return (
    <div className='feed__nav'>
      <NavigationBar
        navArr={lists}
        type='light'
        customClass='feed'
        // onApply={onApply}
        // chosenListId={chosenListId}
      />
    </div>
  )
}

export default FeedNavbar
