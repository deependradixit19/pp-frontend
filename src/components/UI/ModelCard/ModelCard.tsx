import { FC, useState } from 'react'
import './_modelCard.scss'
import { useTranslation } from 'react-i18next'
import { AllIcons } from '../../../helpers/allIcons'

import AvatarHolder from '../../../components/UI/AvatarHolder/AvatarHolder'
import IconButton from '../../../components/UI/Buttons/IconButton'
import RadioButton from '../../../components/Common/RadioButton/RadioButton'
import Button from '../Buttons/Button'

import AvatarPlaceholder from '../../../assets/images/user_placeholder.png'
import bg1 from '../../../assets/images/home/bg1.png'

const ModelCard: FC<{
  type: string
  isNew?: boolean
  twitterStats?: number
  hasButtons?: boolean
  acceptButton?: () => void
  denyButton?: () => void
}> = ({ type, isNew, twitterStats, hasButtons, acceptButton, denyButton }) => {
  const [expanded, setExpanded] = useState<boolean>(false)

  const { t } = useTranslation()

  return (
    <div className={`subscriptions__model${type === 'card' && expanded ? ' subscriptions__model--active' : ''}`}>
      <div
        className={`modelCard__head${expanded ? ' modelCard__head--active' : ''}`}
        style={{ backgroundImage: `url(${bg1})` }}
      >
        <AvatarHolder img={AvatarPlaceholder} size='80' />

        {isNew ? <div className='modelCard__head__new'>{t('new')}</div> : ''}

        <div className='modelCard__head__actions'>
          <div className='modelCard__head__user'>
            <p className='modelCard__head__user--name'>Alex White</p>
            <p className='modelCard__head__user--username'>@whitealexy</p>
          </div>

          {type === 'card' ? (
            <div className='modelCard__head__buttons'>
              <IconButton icon={AllIcons.coin} size='medium' type='black--transparent' />
              <IconButton icon={AllIcons.chat_bubble} size='medium' type='black--transparent' />
              <IconButton
                icon={AllIcons.chevron_down}
                type='black--transparent'
                customClass={`modelCard__head__buttons--chevron${
                  expanded ? ' modelCard__head__buttons--chevron--rotated' : ''
                }`}
                clickFn={() => setExpanded(!expanded)}
              />
            </div>
          ) : (
            ''
          )}

          {hasButtons ? (
            <>
              <div className='modelCard__head__buttons__deny' onClick={() => denyButton && denyButton()}>
                <img src={AllIcons.close} alt={t('deny')} />
              </div>
              <Button
                text={t('accept')}
                color='blue'
                font='mont-14-normal'
                width='fit'
                height='4'
                padding='2'
                clickFn={() => acceptButton && acceptButton()}
              />
            </>
          ) : (
            ''
          )}

          {twitterStats ? (
            <div className='modelCard__head__twitter'>
              <img src={AllIcons.twitter_active} alt='Twitter' />
              {twitterStats} {t('followers')}
            </div>
          ) : (
            ''
          )}
        </div>

        {type === 'radio' ? (
          <div className='modelCard__head__radio'>
            <RadioButton active={false} />
          </div>
        ) : (
          ''
        )}
      </div>
      {type === 'card' ? (
        <div className={`modelCard__body`}>
          <div className='modelCard__line'>
            <span className='modelCard__line__item'>{t('subscriptionTier')}</span>
            <div className='modelCard__line__sub'>{t('subscription')}</div>
          </div>
          <div className='modelCard__line'>
            <span className='modelCard__line__item'>{t('status')}</span>
            <div className='modelCard__line__active'>{t('active')}</div>
          </div>
          <div className='modelCard__line'>
            <span className='modelCard__line__item'>{t('billingCicle')}</span>
            <span className='modelCard__line__value'>1 {t('month')}</span>
          </div>
          <div className='modelCard__line'>
            <span className='modelCard__line__item'>{t('totalMonthsSubscribed')}</span>
            <span className='modelCard__line__value'>2 {t('months')}</span>
          </div>
          <div className='modelCard__line'>
            <span className='modelCard__line__item'>{t('subscriptionPrice')}</span>
            <span className='modelCard__line__value'>
              <b>$14.99</b> {t('willRenewAt')} <b>$14.99</b>
            </span>
          </div>
          <div className='modelCard__line'>
            <span className='modelCard__line__item'>{t('subRenewDate')}</span>
            <span className='modelCard__line__value'>Tuesday, Oct 5, 2021</span>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default ModelCard
