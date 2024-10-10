import { FC, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import {
  IconActionDollar,
  IconCaretDownSm,
  IconCaretUpSm,
  IconChatOutline,
  IconTwoPeopleOutline
} from '../../../assets/svg/sprite'
import CheckboxField from '../../../components/Form/CheckboxField/CheckboxField'
import Button from '../../../components/UI/Buttons/Button'
import TipModal from '../../../components/UI/Modal/Tip/TipModal'
import { useModalContext } from '../../../context/modalContext'
import { AllIcons } from '../../../helpers/allIcons'
import { ICreator } from '../../../types/interfaces/ICreator'
import './_creator.scss'
import { toFixedNumber } from '../../../helpers/dataTransformations'
import { localeDate, localeShortWordDate, wordedDayDate } from '../../../lib/dayjs'

interface Props {
  creatorData: ICreator
  renderLocation: string
  selected?: boolean
  onSelect?: () => void
}

const CreatorExpired: FC<{ creatorData: any }> = ({ creatorData }) => {
  const { t } = useTranslation()
  return (
    <div className={`creator`}>
      {!!creatorData.save && (
        <div className='creator__discount'>
          {t('save')} {creatorData.save}%
        </div>
      )}

      <div
        className={`creator__wrapper creator__wrapper--expired`}
        style={{ backgroundImage: `url(${creatorData.coverUrl})` }}
      >
        <div className='creator__expired--bg'></div>

        <div className={`creator__avatar ${creatorData.isOnline ? 'active' : ''}`}>
          <img src={creatorData.avatarUrl} alt='' />

          {creatorData.isLive && (
            <div className='creator__live'>
              <span>{t('live')}</span>
            </div>
          )}
        </div>
        <div className='creator__expired'>
          <div className='creator__expired__text'>
            <p className='creator__expired__text--name creator__text--name'>{creatorData.name}</p>
            <p className='creator__expired__text--handle creator__text--handle'>@{creatorData.handle}</p>
            <p className='creator__expired__text--date creator__text--expired'>
              <span>{t('expired')}</span> {localeShortWordDate(creatorData.expires)}
            </p>
          </div>
          <div className='creator__expired__actions'>
            <div className='creator__expired__actions--bg'></div>
            <div className='creator__expired__actions--price'>
              ${toFixedNumber(creatorData.price)}
              <span>&nbsp;/&nbsp;{t('monthShort')}</span>
            </div>
            <div className='creator__expired__actions--button'>
              <Button text={t('subscribe')} color='blue' width='11' height='3' padding='2' font='mont-14-normal' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const CreatorReferral: FC<{
  creatorData: ICreator
  statsExpanded: boolean
  addTip: () => void
  toggleExpanded: () => void
}> = ({ creatorData, statsExpanded, addTip, toggleExpanded }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className={`creator statsExpanded`}>
      <div className={`creator__wrapper`} style={{ backgroundImage: `url(${creatorData.coverUrl})` }}>
        <div className={`creator__avatar ${creatorData.isOnline ? 'active' : ''}`}>
          <img src={creatorData.avatarUrl} alt='' />
          {creatorData.isLive && (
            <div className='creator__live'>
              <span>{t('live')}</span>
            </div>
          )}
        </div>
        <div className='creator__text'>
          <div className='creator__text--bg'></div>
          <div className='creator__text--wrapper'>
            <div className='creator__text--name'>{creatorData.name}</div>
            <div className='creator__text--handle'>@{creatorData.handle}</div>
          </div>
          <div className='creator__actions'>
            <div className='creator__actions__button' onClick={addTip}>
              <IconTwoPeopleOutline color='#ffffff' />
            </div>
            <div
              className='creator__actions__button creator__actions__button--message'
              onClick={() => navigate(`/chat/${creatorData.userId}`)}
            >
              <IconChatOutline />
            </div>
          </div>
        </div>
      </div>
      <div className={`creator__stats creator__stats__referrals `}>
        <div className='creator__stat'>
          <div className='creator__stat__name'>{t('DateRegistered')}</div>
          <div className='creator__stat__value'>{dayjs(creatorData.registeredAt).format('ll')}</div>
        </div>
        <div className='creator__stat'>
          <div className='creator__stat__name'>{t('earnings')}</div>
          <div className='creator__stat__value'>
            <span>${toFixedNumber(creatorData.price, 2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const CreatorActive: FC<{
  creatorData: any
  statsExpanded: boolean
  addTip: () => void
  toggleExpanded: () => void
}> = ({ creatorData, statsExpanded, addTip, toggleExpanded }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const expiresSoon = (date: string) => {
    const currentDate = new Date()
    const afterSevenDays = new Date()
    const dataDate = new Date(date)

    afterSevenDays.setDate(currentDate.getDate() + 7)

    return dataDate >= currentDate && dataDate <= afterSevenDays
  }

  const expiresDate = expiresSoon(creatorData.expires)

  return (
    <div className={`creator ${statsExpanded ? 'statsExpanded' : ''}`}>
      <Link
        to={`/profile/${creatorData.userId}/all`}
        className={`creator__wrapper`}
        style={{ backgroundImage: `url(${creatorData.coverUrl})` }}
      >
        <Link
          to={`/profile/${creatorData.userId}/all`}
          className={`creator__avatar ${creatorData.isOnline ? 'active' : ''}`}
        >
          <img src={creatorData.avatarUrl} alt='' />
          {creatorData.isLive && (
            <div className='creator__live'>
              <span>{t('live')}</span>
            </div>
          )}
        </Link>
        {(expiresDate || creatorData.newPostsCount > 0) && (
          <div className='creator__topinfo'>
            {creatorData.newPostsCount > 0 && (
              <div className='creator__topinfo__item'>
                <div className='creator__topinfo__item__bg creator__topinfo__item__bg--blue'></div>
                <p>
                  <span>{creatorData.newPostsCount}</span>
                  {t('newPosts')}
                </p>
              </div>
            )}
            {expiresDate && (
              <div className='creator__topinfo__item'>
                <div className='creator__topinfo__item__bg creator__topinfo__item__bg--trans'></div>
                <p>
                  {t('expires')} {localeDate(creatorData.expires)}
                </p>
              </div>
            )}
          </div>
        )}
        <div className='creator__text'>
          <div className='creator__text--bg'></div>
          <div className='creator__text--wrapper'>
            <Link to={`/profile/${creatorData.userId}/all`} className='creator__text--name'>
              {creatorData.name}
            </Link>
            <Link to={`/profile/${creatorData.userId}/all`} className='creator__text--handle'>
              @{creatorData.handle}
            </Link>
          </div>
          <div className='creator__actions'>
            <Link
              to='/subscriptions'
              className='creator__actions__button'
              onClick={e => {
                addTip()
                e.stopPropagation()
              }}
            >
              <IconActionDollar />
            </Link>
            <Link
              to={`/chat/${creatorData.userId}`}
              className='creator__actions__button creator__actions__button--message'
              onClick={e => {
                e.stopPropagation()
                navigate(`/chat/${creatorData.userId}`)
              }}
            >
              <IconChatOutline />
            </Link>
            <Link
              to='/subscriptions'
              className='creator__actions__button creator__actions__button--small'
              onClick={e => {
                toggleExpanded()
                e.stopPropagation()
              }}
            >
              {statsExpanded ? <IconCaretUpSm /> : <IconCaretDownSm />}
            </Link>
          </div>
        </div>
      </Link>
      <div className={`creator__stats `}>
        <div className='creator__stat'>
          <div className='creator__stat__name'>{t('status')}</div>
          <div
            className={`creator__stat__value creator__stat__value--status creator__stat__value--${
              creatorData.isActive ? 'active' : 'expired'
            }`}
          >
            {creatorData.isActive ? t('active') : t('expired')}
          </div>
        </div>
        <div className='creator__stat'>
          <div className='creator__stat__name'>{t('billingCicle')}</div>
          <div className='creator__stat__value'>
            {creatorData.billingCycle} {t('month')}
          </div>
        </div>
        <div className='creator__stat'>
          <div className='creator__stat__name'>{t('totalMonthSubscribed')}</div>
          <div className='creator__stat__value'>
            {creatorData.monthsSubscribed} {t('months')}
          </div>
        </div>
        <div className='creator__stat'>
          <div className='creator__stat__name'>{t('subscriptionPrice')}</div>
          <div className='creator__stat__value'>
            <span>${toFixedNumber(creatorData.price)}</span> {t('willRenewAt')}{' '}
            <span>${toFixedNumber(creatorData.renewalPrice)}</span>
          </div>
        </div>
        {creatorData.renewDate && (
          <div className='creator__stat'>
            <div className='creator__stat__name'>{t('subRenewDate')}</div>
            <div className='creator__stat__value'>{wordedDayDate(creatorData.renewDate)}</div>
          </div>
        )}
      </div>
    </div>
  )
}
const CreatorDefault: FC<{
  creatorData: ICreator
  withSubscribed?: boolean
}> = ({ creatorData, withSubscribed = false }) => {
  const { t } = useTranslation()
  return (
    <Link to={`/profile/${creatorData.userId}/all`} key={creatorData.userId}>
      <div className={`creator`}>
        <div className={`creator__wrapper`} style={{ backgroundImage: `url(${creatorData.coverUrl})` }}>
          <div className={`creator__avatar ${creatorData.isOnline ? 'active' : ''}`}>
            <img src={creatorData.avatarUrl} alt='' />
            {creatorData.isLive && (
              <div className='creator__live'>
                <span>{t('live')}</span>
              </div>
            )}
          </div>
          <div className='creator__text'>
            <div className='creator__text--bg'></div>
            <div className='creator__text--wrapper'>
              <div className='creator__text--name'>{creatorData.name}</div>
              <div className='creator__text--handle'>@{creatorData.handle}</div>
            </div>
            {withSubscribed && creatorData.subscribed ? (
              <div className='creator__text--subscribed'>
                <img src={AllIcons.profile_checkcircle} alt='checked circle' />
                <span>{t('subscribed')}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  )
}
const CreatorSelect: FC<{
  creatorData: ICreator
  selected: boolean
  clickFn?: () => void
}> = ({ creatorData, selected, clickFn }) => {
  const { t } = useTranslation()
  return (
    <div className={`creator`}>
      <div className={`creator__wrapper`} style={{ backgroundImage: `url(${creatorData.coverUrl})` }}>
        <div className={`creator__avatar ${creatorData.isOnline ? 'active' : ''}`}>
          <img src={creatorData.avatarUrl} alt='' />
          {creatorData.isLive && (
            <div className='creator__live'>
              <span>{t('live')}</span>
            </div>
          )}
        </div>
        <div className='creator__text'>
          <div className='creator__text--bg'></div>
          <div className='creator__text--wrapper'>
            <div className='creator__text--name'>{creatorData.name}</div>
            <div className='creator__text--handle'>@{creatorData.handle}</div>
          </div>
        </div>
        <div className='creator__select'>
          <CheckboxField
            id='subscribers-select-subscriber'
            value='select'
            label=''
            checked={selected}
            changeFn={() => clickFn && clickFn()}
          />
        </div>
      </div>
    </div>
  )
}

const Creator: FC<Props> = ({ creatorData, renderLocation, selected, onSelect }) => {
  const [statsExpanded, setStatsExpanded] = useState(false)

  const modalData = useModalContext()
  const { t } = useTranslation()

  const addTip = () => {
    modalData.addModal(
      t('tipAmount'),
      <TipModal
        avatar={creatorData.avatarUrl}
        modelData={{
          modelId: creatorData.userId,
          avatarSrc: creatorData.avatarUrl
        }}
      />
    )
  }

  switch (renderLocation) {
    case 'subscriptionsExpired':
      return <CreatorExpired creatorData={creatorData} />
    case 'subscriptionsActive':
      return (
        <CreatorActive
          creatorData={creatorData}
          statsExpanded={statsExpanded}
          addTip={addTip}
          toggleExpanded={() => setStatsExpanded(statsExpanded => !statsExpanded)}
        />
      )
    case 'referrals':
      return (
        <CreatorReferral
          creatorData={creatorData}
          statsExpanded={statsExpanded}
          addTip={addTip}
          toggleExpanded={() => setStatsExpanded(statsExpanded => !statsExpanded)}
        />
      )
    case 'creators':
      return <CreatorDefault creatorData={creatorData} />
    case 'suggested':
      return <CreatorDefault creatorData={creatorData} />
    case 'publicFriends':
      return <CreatorDefault creatorData={creatorData} withSubscribed={true} />
    case 'newList':
      return <CreatorSelect creatorData={creatorData} selected={!!selected} clickFn={onSelect} />
    default:
      return <CreatorDefault creatorData={creatorData} />
  }
}

export default Creator
