import { FC, useState, useRef, useEffect } from 'react'
import { IconClose } from '../../../../assets/svg/sprite'
import BlackButton from '../../../../components/Common/BlackButton/BlackButton'
import WhiteButton from '../../../../components/Common/WhiteButton/WhiteButton'
import SearchField from '../../../../components/Form/SearchField/SearchField'
import AvatarHolder from '../../../../components/UI/AvatarHolder/AvatarHolder'
import StackedAvatar from '../../../../components/UI/StackedAvatar/StackedAvatar'
import ActionCard from '../../../../features/ActionCard/ActionCard'
import HighLightText from '../../../../features/HighLightText/HighLightText'
import styles from './_who-are-you-writing-to-modal.module.scss'
import avatarPlaceholder from '../../../../assets/images/user_placeholder.png'

const WhoAreYouWritingModal: FC<{
  groups: {}[]
  applyFn: (val: any, val2: any) => void
  closeFn: () => void
  allUsersData: any
  resetOnCancel?: boolean
}> = ({ groups, applyFn, closeFn, allUsersData, resetOnCancel = true }) => {
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<{}[]>([])
  const [selectedGroup, setSelectedGroup] = useState<{ id: string | number; name: string; avatars: string[] } | null>(
    null
  )
  const unFocusRef = useRef<any>(null)

  const toggleGroup = (group: { id: string | number; name: string; avatars: string[] }) => {
    if (selectedGroup && selectedGroup.id === group.id) {
      setSelectedGroup(null)
    } else {
      setSelectedGroup({
        id: group.id,
        name: group.name,
        avatars: group.avatars
      })
    }
    setSelectedUsers([])
  }

  const addSelectedUser = (user: { [key: string]: string | boolean | number | {} | {}[] }) => {
    setSelectedUsers((prevState: any) => {
      const oldArray = prevState.filter((item: any) => item.id !== user.id)
      if (oldArray.length === prevState.length) {
        return [...oldArray, user]
      }
      return prevState
    })
    if (unFocusRef.current) {
      unFocusRef.current.focus()
    }
    setSelectedGroup(null)
  }

  const deleteSelectedUser = (id: number) => {
    setSelectedUsers((prevState: any) => {
      const oldArray = prevState.filter((item: any) => item.id !== id)
      return oldArray
    })
  }

  return (
    <>
      <div className={styles.modal_container}>
        <div ref={unFocusRef} tabIndex={0}></div>
        <div className={styles.modal_title}>Send a Message</div>
        <div
          className={styles.input_container}
          onFocus={() => setSearchOpen(true)}
          onBlur={() => setSearchOpen(false)}
          tabIndex={0}
        >
          <SearchField
            value={search}
            changeFn={(val: string) => setSearch(val)}
            clearFn={() => setSearch('')}
            additionalProps={{ placeholder: 'Search Fans' }}
            customClass={`${styles.search_field} ${searchOpen && search.trim() !== '' ? styles.search_field_open : ''}`}
          />
          <div
            className={`${styles.search_results} ${
              searchOpen && search.trim() !== '' ? styles.search_results_open : ''
            }`}
          >
            {allUsersData?.data &&
              allUsersData.data
                .filter(
                  (user: any) =>
                    user.name.toLowerCase().trim().includes(search.toLowerCase().trim()) ||
                    user.username.toLowerCase().trim().includes(search.toLowerCase().trim())
                )
                .map((user: any) => (
                  <ActionCard
                    key={user.id}
                    text={<HighLightText text={user.name} highlight={search} />}
                    description={<HighLightText text={`@${user.username}`} highlight={search} />}
                    avatar={<AvatarHolder img={user?.avatar?.url || ''} size={'50'} />}
                    customHtml={
                      user.friends === 'Friends' ? (
                        <div className={`${styles.search_status} ${styles.search_status_friend}`}>Friend</div>
                      ) : user.isSubscribed ? (
                        <div className={styles.search_status}>Subscribed</div>
                      ) : (
                        <div></div>
                      )
                    }
                    customClass={styles.search_card}
                    clickFn={() => addSelectedUser(user)}
                  />
                ))}
          </div>
        </div>
        <div className={styles.users_container}>
          {!!selectedUsers.length &&
            selectedUsers
              .slice()
              .reverse()
              .map((user: any) => (
                <div className={styles.selected_user_container} key={user.id}>
                  <AvatarHolder img={user?.avatar?.url || avatarPlaceholder} size='50' />
                  <div className={styles.selected_user_name}>{user.name}</div>
                  <div className={styles.selected_user_delete} onClick={() => deleteSelectedUser(user.id)}>
                    <IconClose color='#0D1444' />
                  </div>
                </div>
              ))}
        </div>
        <div className={styles.separator}></div>
        <div className={styles.groups_conatiner}>
          {!!groups.length &&
            groups.map((group: any, index: any) => (
              <div key={group.id}>
                <div onClick={() => toggleGroup(group)}>
                  <ActionCard
                    text={group.name}
                    description={
                      group.count && group.count > 0
                        ? `${group.count} ${
                            group.name.toLowerCase() === 'fans' || group.name.toLowerCase() === 'friends'
                              ? group.name
                              : 'Users'
                          }`
                        : 'Empty'
                    }
                    hasRadio={true}
                    toggleActive={selectedGroup && selectedGroup.id === group.id}
                    customClass={styles.group_card}
                    customHtml={<StackedAvatar avatars={group.avatars || []} count={group.count} />}
                  />
                </div>
                {index === 0 && <div className={styles.separator}></div>}
              </div>
            ))}
        </div>
      </div>
      <div className={styles.buttons_container}>
        <WhiteButton
          text='Cancel'
          clickFn={() => {
            closeFn()
            if (resetOnCancel) {
              setSearch('')
              setSelectedGroup(null)
              setSelectedUsers([])
            }
          }}
          customClass={styles.button}
        />
        <BlackButton
          text='Apply'
          clickFn={() => {
            applyFn(selectedGroup, selectedUsers)
          }}
          customClass={styles.button}
        />
      </div>
    </>
  )
}

export default WhoAreYouWritingModal
