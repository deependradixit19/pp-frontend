import { FC } from 'react'
import { useQuery } from 'react-query'
import { getMassMessages } from '../../../../services/endpoints/api_messages'
import MassMessageCard from './components/MassMessageCard/MassMessageCard'
import { IMassMessage } from '../../../../types/interfaces/IMessage'

const MassMessagesModal: FC = () => {
  const { data, isLoading } = useQuery('mass-messages', getMassMessages)

  return (
    <div>
      {!isLoading &&
        data?.data &&
        data.data.map((message: IMassMessage, index: number) => <MassMessageCard key={index} message={message} />)}
      {isLoading && <div className='loader'></div>}
      {data?.data && data.data.length === 0 && <div>No mass messages</div>}
    </div>
  )
}

export default MassMessagesModal
