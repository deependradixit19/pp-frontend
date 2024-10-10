import { FC, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ICreator } from '../../types/interfaces/ICreator'
import Creator from './Creator/Creator'
import './_creatorsList.scss'
import noSubscriptions from '../../assets/images/no-subscriptions.png'

interface Props {
  creators: ICreator[]
  heightAdjustment?: number
  renderLocation: string
  selectedItems?: number[]
  onSelect?: (id: number) => void
  customClass?: string
  creatorRef?: any
  customPlaceholderText?: string | JSX.Element | JSX.Element[]
  creatorClikcFn?: (creator: any) => void
}

const CreatorsList: FC<Props> = ({
  creators,
  heightAdjustment,
  renderLocation,
  selectedItems,
  onSelect,
  customClass,
  creatorRef,
  customPlaceholderText,
  creatorClikcFn
}) => {
  const [wrapperStyle, setWrapperStyle] = useState<any>(null)
  const { t } = useTranslation()

  useLayoutEffect(() => {
    if (renderLocation === 'newList') {
      setWrapperStyle({ maxHeight: `32rem` })
    }
  }, [renderLocation, heightAdjustment])

  return (
    <div className={`creatorsList ${customClass ? customClass : ''}`} style={wrapperStyle}>
      {!!creators.length ? (
        creators.map((creator, idx) => (
          <div
            ref={creatorRef ? creatorRef : null}
            key={creator.userId}
            onClick={() => (creatorClikcFn ? creatorClikcFn(creator) : null)}
          >
            <Creator
              creatorData={creator}
              renderLocation={renderLocation}
              selected={selectedItems?.includes(creator.userId)}
              onSelect={() => onSelect && onSelect(creator.userId)}
            />
          </div>
        ))
      ) : (
        <div className='creatorsList__empty'>
          <img src={noSubscriptions} alt={t('noActiveSubscriptions')} />
          <div className='creatorsList__empty__text'>
            {renderLocation === 'subscriptionsActive' && (
              <div className='creatorsList__empty__text--title'>{t('noActiveSubscriptions')}</div>
            )}
            {renderLocation === 'subscriptionsExpired' && (
              <div className='creatorsList__empty__text--title'>{t('noExpiredSubscriptions')}</div>
            )}
            <div className='creatorsList__empty__text--sub'>
              {customPlaceholderText ? customPlaceholderText : t('yourSubscriptionsAppearHere')}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default CreatorsList
