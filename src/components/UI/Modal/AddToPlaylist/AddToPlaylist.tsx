import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { addToPlaylist } from '../../../../services/endpoints/media'
import { addToast } from '../../../Common/Toast/Toast'
import CreatePlaylist from '../CreatePlaylist/CreatePlaylist'
import Playlists from './Playlists'

interface Props {
  postId: number
  closeFn: () => void
}

const AddToPlaylist: FC<Props> = ({ postId, closeFn }) => {
  const [newPlaylistOpen, setNewPlaylistOpen] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState<number>(0)

  const { t } = useTranslation()

  const addPostToPlaylist = useMutation(
    (variables: { playlistId: number; postIds: number[] }) => addToPlaylist(variables),
    {
      onSuccess: (data, variables) => {
        addToast('success', t('postAddedToPlaylist'))
        closeFn()
      },
      onError: () => {
        addToast('error', t('error:errorSomethingWentWrong'))
      }
    }
  )
  return newPlaylistOpen ? (
    <CreatePlaylist
      closeFn={() => newPlaylistOpen && setNewPlaylistOpen(false)}
      setSelectedPlaylist={(val: number) => setSelectedPlaylist(val)}
    />
  ) : (
    <Playlists
      closeFn={closeFn}
      confirmFn={() => {
        addPostToPlaylist.mutate({
          playlistId: selectedPlaylist,
          postIds: [postId]
        })
      }}
      addNew={() => !newPlaylistOpen && setNewPlaylistOpen(true)}
      selectedPlaylist={selectedPlaylist}
      setSelectedPlaylist={(val: number) => setSelectedPlaylist(val)}
    />
  )
}

export default AddToPlaylist
