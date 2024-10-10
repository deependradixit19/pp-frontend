import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconSortAsc } from '../../../../assets/svg/sprite'
import placeholderAvatar from '../../../../assets/images/user_placeholder.png'
import SearchField from '../../../../components/Form/SearchField/SearchField'
import LiveModal from '../LiveModal'
import './_privateMessageModal.scss'
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

const PrivateMessageModal: FC<Props> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const { t } = useTranslation()
  return (
    <LiveModal title={t('sendPrivateMessage')} onClose={onClose}>
      <div className='privateMessageModal'>
        <div className='privateMessageModal__header'>
          <SearchField
            value={searchTerm}
            changeFn={(term: string) => setSearchTerm(term)}
            additionalProps={{ placeholder: t('searchUsers') }}
          />
          <div className='privateMessageModal__header--sort'>
            <IconSortAsc />
          </div>
        </div>
        <ViewersList viewers={tmpViewers} type='viewers' />
      </div>
    </LiveModal>
  )
}

export default PrivateMessageModal
