import { FC, useState } from 'react'
import { IconSortAsc } from '../../../../assets/svg/sprite'
import placeholderAvatar from '../../../../assets/images/user_placeholder.png'
import SearchField from '../../../../components/Form/SearchField/SearchField'
import LiveModal from '../LiveModal'
import './_viewersModal.scss'
import ViewersList from '../../ViewersList/ViewersList'

interface Props {
  onClose: () => void
}

const tmpViewers = [
  {
    avatarUrl: placeholderAvatar,
    name: 'Milan Stanojevic 1',
    handle: '@chomi 1',
    tipped: '$250'
  },
  {
    avatarUrl: placeholderAvatar,
    name: 'Milan Stanojevic 2',
    handle: '@chomi 2',
    tipped: '$50'
  },
  {
    avatarUrl: placeholderAvatar,
    name: 'Milan Stanojevic 3',
    handle: '@chomi 3',
    tipped: '$35'
  },
  {
    avatarUrl: placeholderAvatar,
    name: 'Milan Stanojevic 4',
    handle: '@chomi 4',
    tipped: '$225'
  },
  {
    avatarUrl: placeholderAvatar,
    name: 'Milan Stanojevic 5',
    handle: '@chomi 5',
    tipped: '$75'
  },
  {
    avatarUrl: placeholderAvatar,
    name: 'Milan Stanojevic 6',
    handle: '@chomi 6',
    tipped: '$25'
  },
  {
    avatarUrl: placeholderAvatar,
    name: 'Milan Stanojevic 7',
    handle: '@chomi 7',
    tipped: '$125'
  }
]

const ViewersModal: FC<Props> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <LiveModal title='Viewers' onClose={onClose}>
      <div className='viewersmodal'>
        <div className='viewersmodal__header'>
          <SearchField
            value={searchTerm}
            changeFn={(term: string) => setSearchTerm(term)}
            clearFn={() => setSearchTerm('')}
            additionalProps={{ placeholder: 'Search users' }}
          />
          <div className='viewersmodal__header--sort'>
            <IconSortAsc />
          </div>
        </div>
        <ViewersList viewers={tmpViewers} type='viewers' />
      </div>
    </LiveModal>
  )
}

export default ViewersModal
