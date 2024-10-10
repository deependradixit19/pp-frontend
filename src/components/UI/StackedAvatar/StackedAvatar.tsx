import { FC } from 'react'
import style from './_stacked-avatar.module.scss'

const StackedAvatar: FC<{ avatars: string[]; avtarsCount?: number; customClass?: string; count?: number }> = ({
  avatars,
  avtarsCount = 4,
  customClass = '',
  count
}) => {
  const countNumber = count ? count : avatars.length
  const renderAvatars = () => {
    return avatars
      .slice()
      .filter((avatar: string, index: number) => index < avtarsCount)
      .map((avatar: string, index: number) => (
        <div key={index} className={style.avatar_circle}>
          <img src={avatar} alt='avatar' />
        </div>
      ))
  }
  return (
    <div className={`${style.avatar_container} ${customClass}`}>
      {renderAvatars()}
      {avtarsCount < countNumber && <div className={style.remaining_avatars}>+{countNumber - avtarsCount}</div>}
    </div>
  )
}

export default StackedAvatar
