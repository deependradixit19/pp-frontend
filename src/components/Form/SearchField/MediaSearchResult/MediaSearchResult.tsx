import { FC } from 'react'
import { IconCloseSm } from '../../../../assets/svg/sprite'
import placeholderAvatar from '../../../../assets/images/user_placeholder.png'

interface Props {
  user?: {
    id: number
    name: string
    username: string
    avatarSrc: string | null
  }
  media?: {
    src: string
    name: string
    thumbnail: string | null
  }
  clickFn?: () => void
}

const MediaSearchResult: FC<Props> = ({ user, media, clickFn }) => {
  if (media) {
    return (
      <div
        className='searchResult'
        onClick={() => {
          clickFn && clickFn()
        }}
      >
        <div className='searchResult__content'>
          <div className='searchResult__avatar'>
            <img src={media.thumbnail ?? media.src ?? placeholderAvatar} alt='' />
          </div>
          <div className='searchResult__text'>
            <div className='searchResult__text--name'>{media?.name}</div>
          </div>
        </div>
        {/* <div className="searchResult__close">
          <IconCloseSm />
        </div> */}
      </div>
    )
  }
  if (user) {
    return (
      <div
        className='searchResult'
        onClick={() => {
          clickFn && clickFn()
        }}
      >
        <div className='searchResult__content'>
          <div className='searchResult__avatar'>
            <img src={user.avatarSrc ?? placeholderAvatar} alt='' />
          </div>
          <div className='searchResult__text'>
            <div className='searchResult__text--name'>{user.name}</div>
            <div className='searchResult__text--handle'>{user.username}</div>
          </div>
        </div>
        {/* <div className="searchResult__close">
          <IconCloseSm />
        </div> */}
      </div>
    )
  }
  return null
}

export default MediaSearchResult
