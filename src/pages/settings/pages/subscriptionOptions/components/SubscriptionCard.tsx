import { FC, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { iSubscriptionCard } from '../../../../../types/iTypes'
import { AllIcons } from '../../../../../helpers/allIcons'
import { useModalContext } from '../../../../../context/modalContext'

import SwitchButton from '../../../../../components/Common/SwitchButton/SwitchButton'
import IconButton from '../../../../../components/UI/Buttons/IconButton'
import ConfirmModal from '../../../../../components/UI/Modal/Confirm/ConfirmModal'

const SubscriptionCard: FC<iSubscriptionCard> = ({
  type,
  icon,
  name,
  subname,
  price,
  discount,
  isSelected,
  isActive = false,
  clickFn,
  switchFn,
  modalFn,
  editFn,
  deleteFn,
  descritpion,
  selectable = true,
  alwaysExpanded,
  hideArrow,
  customClass = '',
  hideEdit,
  hideToggle,
  monthCount,
  displayMonthlyPrice
}) => {
  const [expanded, setExpanded] = useState<boolean>(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const modalData = useModalContext()
  const { t } = useTranslation()

  const removePlan = () =>
    modalData.addModal(
      t('deletePricingPlan'),
      <ConfirmModal body={t('onceYouDeleteThisPricingPlan')} confirmFn={() => deleteFn && deleteFn()} />
    )

  if (type === 'card') {
    return (
      <div className={`subsOption__card__wrapper ${customClass}`}>
        <div
          className={`subsOptions__card ${expanded && selectable ? ' subsOptions__card--selected' : ''} ${
            expanded || alwaysExpanded ? 'subsOptions__card--expanded' : ''
          }`}
        >
          <div className='subsOptions__card__head' onClick={() => setExpanded(!expanded)}>
            <div className='subsOptions__card__icon'>
              {!icon ? (
                type === 'card' ? (
                  <img className='subsOptions__card__icon--plan' src={AllIcons.payment_sub} alt={t('plan')} />
                ) : (
                  <img className='subsOptions__card__icon--add' src={AllIcons.post_add} alt={t('add')} />
                )
              ) : typeof icon === 'string' ? (
                <img className='subsOptions__card__icon' src={icon} alt='icon' />
              ) : (
                icon
              )}
            </div>

            <div className='subsOptions__card__info'>
              {name && typeof name === 'string' ? <h3 className='subsOptions__card__info__plan'>{name}</h3> : name}
              {subname && subname}
              <div className='subsOptions__card__info__price'>
                {price && <p>${Math.round(price * 100) / 100}</p>}
                {/* <span>/ {t('monthShort')}</span> */}
                {discount && <div className='subsOptions__card__info__discount'>Save {discount}%</div>}
              </div>
              {/* <p className="subsOptions__card__info__monthly">$12.99/month</p> */}
              {displayMonthlyPrice ? (
                <p className='subsOptions__card__info__monthly'>
                  ${price && monthCount && Math.round((price / monthCount) * 100) / 100} / {t('month')}
                </p>
              ) : (
                ''
              )}
            </div>

            {!hideArrow && (
              <div className='subsOptions__card__buttons'>
                <div
                  className={`subsOptions__card__buttons__chevron${
                    expanded ? ' subsOptions__card__buttons__chevron--active' : ''
                  }`}
                >
                  <img src={AllIcons.chevron_down} alt={t('icon')} />
                </div>
              </div>
            )}
          </div>

          <div
            ref={cardRef}
            className={`subsOptions__card__body${expanded || alwaysExpanded ? ' subsOptions__card__body--active' : ''}`}
          >
            {/* <div className="subsOptions__features">
              <h3>{t('features')}</h3>

              <div className="subsOptions__features__feature">
                <img src={AllIcons.checkmark_blue} alt="Landing pages" />
                <p>{t('landingPages')}</p>
              </div>
              <div className="subsOptions__features__feature">
                <img src={AllIcons.checkmark_blue} alt="Email sign up forms" />
                <p>{t('emailSignUpForms')}</p>
              </div>
              <div className="subsOptions__features__feature">
                <img src={AllIcons.checkmark_blue} alt="Integrations" />
                <p>{t('integrations')}</p>
              </div>
            </div> */}
            {descritpion && descritpion}

            <div className='subsOptions__actions'>
              {!hideToggle && (
                <SwitchButton
                  active={isActive}
                  toggle={() => {
                    switchFn && switchFn()
                  }}
                />
              )}

              <div
                className={`subsOptions__actions__buttons ${
                  hideToggle ? 'subsOptions__actions__buttons-toggleHidden' : ''
                }`}
              >
                <IconButton
                  icon={AllIcons.chat_delete}
                  type='white'
                  customClass='subsOptions__actions__button'
                  clickFn={removePlan}
                />
                {!hideEdit && (
                  <IconButton
                    icon={AllIcons.post_edit}
                    type='white'
                    customClass='subsOptions__actions__button'
                    clickFn={() => editFn && editFn()}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {expanded && selectable ? (
          <div className='subsOptions__card__selected'>
            <img src={AllIcons.checkmark_blue} alt={t('selected')} />
          </div>
        ) : (
          ''
        )}
      </div>
    )
  } else {
    return (
      <div className={`subsOptions__card ${customClass}`} onClick={() => clickFn && clickFn()}>
        <div className='subsOptions__card__head subsOptions__card__head--center'>
          <div className='subsOptions__card__icon'>
            <img className='subsOptions__card__icon--add' src={AllIcons.post_add} alt={t('add')} />
          </div>

          <div className='subsOptions__card__info'>
            <p className='subsOptions__card__info__add'>{name ? name : t('addNewPricing')}</p>{' '}
          </div>
        </div>
      </div>
    )
  }
}

export default SubscriptionCard
