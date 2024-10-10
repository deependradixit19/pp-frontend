import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'

// Services
import { useDebounce } from '../../helpers/hooks'
import { IPlaylist } from '../../types/interfaces/ITypes'
import { getMediaAutocomplete, getPlaylists } from '../../services/endpoints/media'

// Components
import FeedLoader from '../../components/Common/Loader/FeedLoader/FeedLoader'
import LayoutHeader from '../../features/LayoutHeader/LayoutHeader'
import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import WithHeaderSection from '../../layouts/WithHeaderSection/WithHeaderSection'
import MediaItemPlaylist from '../media/components/MediaItemPlaylist/MediaItemPlaylist'

// Styling
import styles from './playlists.module.scss'

const Playlists: FC = () => {
  const [autocompleteTerm, setAutocompleteTerm] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const { t } = useTranslation()

  const navigate = useNavigate()

  const debouncedAutocompleteTerm = useDebounce(autocompleteTerm, 500)

  const { data: autocompleteResults } = useQuery(
    ['getMediaAutocomplete', debouncedAutocompleteTerm],
    () => getMediaAutocomplete({ searchTerm: debouncedAutocompleteTerm }),
    { enabled: !!debouncedAutocompleteTerm }
  )

  const { data, status } = useQuery(['getPlaylists', searchTerm], () => getPlaylists(searchTerm), {
    refetchOnWindowFocus: false,
    staleTime: 10000
  })

  return (
    <BasicLayout title={t('customPlaylists')} customContentClass='media__content__wrapper'>
      <WithHeaderSection
        headerSection={
          <LayoutHeader
            type='search-with-buttons'
            searchValue={autocompleteTerm}
            searchFn={(term: string) => setAutocompleteTerm(term)}
            clearFn={() => setSearchTerm('')}
            additionalProps={{ placeholder: t('searchMedia') }}
            buttons={[]}
            selectFn={(value: string) => {
              setSearchTerm(value)
              setAutocompleteTerm('')
            }}
            mediaSearchResults={autocompleteResults}
          />
        }
      >
        <div className={styles.wrapper}>
          <div className={styles.content}>
            {status === 'loading' ? (
              <div className={styles.loader}>
                <FeedLoader />
              </div>
            ) : (
              <>
                {data &&
                  !!data.length &&
                  data.map((playlist: IPlaylist) => (
                    <MediaItemPlaylist
                      key={playlist.playlist_info.id}
                      playlistData={playlist}
                      active={false}
                      setIsActive={() => navigate(`/playlists/${playlist.playlist_info.id}`)}
                      customClass='customPlaylistsFeed'
                    />
                  ))}
              </>
            )}
          </div>
        </div>
      </WithHeaderSection>
    </BasicLayout>
  )
}

export default Playlists
