import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import './_viewersList.scss'

interface IViewer {
  avatarUrl: string
  name: string
  handle: string
  tipped: string
}

interface Props {
  viewers: IViewer[]
  type: string
}

const ViewersList: FC<Props> = ({ viewers, type }) => {
  const { t } = useTranslation()
  return (
    <div className='viewersmodal__list'>
      {viewers.map((viewer, idx) => {
        return (
          <div className='viewer' key={idx}>
            {type === 'leaderboard' && <div className='viewer__order'>{idx + 1}</div>}
            <div className='viewer__avatar'>
              <img src={viewer.avatarUrl} alt={t('avatar')} />
            </div>
            <div className='viewer__text'>
              <div className='viewer__text--name'>{viewer.name}</div>
              <div className='viewer__text--handle'>{viewer.handle}</div>
            </div>
            <div className={`viewer__tipped ${idx < 3 ? 'highest' : ''}`}>
              {t('tipped')} <span>{viewer.tipped}</span>
            </div>
            {type === 'viewers' && (
              <div className='viewer__menu'>
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ViewersList
