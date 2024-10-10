import { FC, useState } from 'react'
import { IconHeartFill, IconLikeOutline } from '../../../assets/svg/sprite'
import { useLiking } from '../../../helpers/hooks'
import { LikeableType } from '../../../types/types'
import styles from './_LikeHeart.module.scss'

export interface ILikeHeart {
  className?: string
  isLiked: boolean
  likeableType: LikeableType
  likeableId: number
  onLikedFn?: () => void
}

const LikeHeart: FC<ILikeHeart> = ({ className, isLiked, likeableType, likeableId, onLikedFn }) => {
  const { like } = useLiking(
    likeableId,
    likeableType,
    undefined,
    error => {
      console.error('Error while liking.', error)
    },
    onLikedFn
  )
  const [liked, setLiked] = useState<boolean>(isLiked)

  return (
    <div
      className={`${styles.likeAction} ${className}`}
      onClick={() => {
        like.mutate()
        setLiked(!liked)
      }}
    >
      {liked ? <IconHeartFill /> : <IconLikeOutline />}
    </div>
  )
}

export default LikeHeart
