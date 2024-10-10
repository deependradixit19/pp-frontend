import { FC, useEffect } from 'react'
import { useQueryClient } from 'react-query'
import { IntersectionOptions, useInView } from 'react-intersection-observer'
import axiosInstance from '../../services/http/axiosInstance'

import UserCardFriend from '../../components/UI/UserCard/UserCardFriend'
import UserCardFan from '../../components/UI/UserCard/UserCardFan'

const inViewOptions: IntersectionOptions = {
  threshold: 0.1
}

const UsersList: FC<{
  activeTab: string
  users: Array<any>
  userCardType: string

  listBtn?: () => void
  chatBtn?: () => void

  loadMoreCb?: () => void
}> = ({ activeTab, users, userCardType, listBtn, chatBtn, loadMoreCb }) => {
  const queryClient = useQueryClient()

  const { ref, inView } = useInView(inViewOptions)

  useEffect(() => {
    if (inView && loadMoreCb) {
      loadMoreCb()
    }
  }, [inView])

  const handleFriendReq = (path: string) => {
    axiosInstance({
      method: 'post',
      url: path
    })
      .then(() => {
        queryClient.invalidateQueries('friendsRequests')
        queryClient.invalidateQueries('friends')
      })
      .catch(err => console.log(err))
  }

  const renderUsersCards = () => {
    switch (userCardType) {
      case 'friendReq':
        return users.map((user: any, key: number, array) => (
          <UserCardFriend
            key={`${user.id}${key}`}
            type='request'
            user={user}
            friendReqAccept={() => handleFriendReq(user.accept_action)}
            friendReqDeny={() => handleFriendReq(user.deny_action)}
            lastItemRef={key === array.length - 1 ? ref : undefined}
          />
        ))

      case 'friend':
        return users.map((user: any, key: number, array) => (
          <UserCardFriend
            key={`${user.id}${key}`}
            user={user}
            type='friend'
            lastItemRef={key === array.length - 1 ? ref : undefined}
          />
        ))

      case 'fan':
        return users.map((user: any, key: number) => <UserCardFan key={key} user={user} type='default' />)

      case 'fan-with-buttons':
        return users.map((user: any, key: number) => (
          <UserCardFan
            key={key}
            user={user}
            type='with-buttons'
            listBtn={() => console.log('list btn')}
            chatBtn={() => console.log('chat btn')}
          />
        ))

      default:
        return null
    }
  }

  return <>{renderUsersCards()}</>
}

export default UsersList
