import { FC, useState } from 'react'
import './_actionCard.scss'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { iActionCard } from '../../types/iTypes'

import SwitchButton from '../../components/Common/SwitchButton/SwitchButton'
import RadioButton from '../../components/Common/RadioButton/RadioButton'
import IconButton from '../../components/UI/Buttons/IconButton'
import * as spriteIcons from '../../assets/svg/sprite'
import React from 'react'

const ActionCard: FC<iActionCard> = ({
  link,
  icon,
  text,
  avatar,
  subtext,
  suptext,
  description,
  hasArrow,
  hasToggle,
  hasToggleWithText,
  toggleText,
  toggleActive,
  toggleFn,
  hasRadio,
  hasWire,
  wireText,
  hasTrash,
  trashFn,
  clickFn,
  customClass,
  absFix,
  inputId,
  pendingNumber,
  customHtml,
  bottomArea,
  selected,
  hasEdit,
  editFn,
  mediumIcon,
  dropDownContent,
  linkInArrow,
  disabled
}) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [dropDownOpen, setDropDownOpen] = useState(false)

  return (
    <div
      className={`actionCard ${customClass ? customClass : ''} ${!icon ? 'actionCard--withouticon' : ''} ${
        selected ? 'actionCard--selected' : ''
      } ${disabled ? 'actionCard--disabled' : ''} ${dropDownOpen ? 'actionCard__dropDown--open' : ''}`}
      onClick={(e: any) => {
        if (link && link !== 'undefined' && !linkInArrow) {
          navigate(link)
        }
        clickFn && clickFn(e)
      }}
    >
      <div className={`actionCard__selectIcon ${selected ? 'actionCard__selectIcon--visible' : ''}`}>
        <div className='actionCard__selectIcon--background'>
          <spriteIcons.IconCheckmark />
        </div>
      </div>
      <div className='actionCard--top-area'>
        {avatar ? <div className='actionCard--avatar'>{avatar}</div> : ''}
        {icon ? (
          typeof icon === 'string' ? (
            <div className='actionCard__icon'>
              <img src={icon} alt={t('actionIcon')} className={`${absFix ? 'actionCard__icon--absfix' : ''}`} />
            </div>
          ) : (
            <div
              className={`actionCard__icon ${absFix ? 'actionCard__icon--absfixsvg' : ''} ${
                mediumIcon ? 'actionCard__icon--medium' : ''
              }`}
            >
              {icon}
            </div>
          )
        ) : (
          ''
        )}

        <div className='actionCard__body'>
          {suptext && <div className='actionCard__body__suptext'>{suptext}</div>}
          {text ? (
            inputId && !link ? (
              <label
                className={`actionCard__body__text ${subtext || description ? 'actionCard__body__text--hassub' : ''}`}
                htmlFor={inputId}
                onClick={toggleFn}
              >
                {text}
              </label>
            ) : (
              <div
                className={`actionCard__body__text ${subtext || description ? 'actionCard__body__text--hassub' : ''}`}
              >
                {text}
              </div>
            )
          ) : (
            ''
          )}

          {subtext ? (
            <div className={`actionCard__body__subtext ${description ? 'actionCard__body__subtext--hassub' : ''}`}>
              {subtext}
            </div>
          ) : (
            ''
          )}
          {
            (typeof description === 'string' || React.isValidElement(description)) ? (
              <div className='actionCard__body__description'>{description}</div>
            ) : null
          }
        </div>
        {customHtml && (typeof customHtml === 'string' || React.isValidElement(customHtml) ? customHtml : null)}
        <div className='actionCard__buttons'>
          {pendingNumber ? <div className='actionCard__pending'>{pendingNumber}</div> : ''}

          {hasRadio ? <input type='checkbox' id={inputId} hidden /> : ''}
          {hasToggle ? <SwitchButton active={toggleActive} toggle={toggleFn} /> : ''}
          {hasToggleWithText ? <SwitchButton active={toggleActive} toggle={toggleFn} text={toggleText} /> : ''}

          {hasRadio ? <RadioButton active={toggleActive} clickFn={toggleFn} /> : ''}

          {hasTrash ? (
            <IconButton
              icon={<spriteIcons.IconTrashcan width='18' height='20' />}
              type='white'
              size='medium'
              customClass='actionCard__buttons__trash'
              clickFn={trashFn}
            />
          ) : (
            ''
          )}

          {hasEdit ? (
            <IconButton
              icon={<spriteIcons.IconEdit color='#B0B0B0' />}
              type='white'
              size='medium'
              customClass='actionCard__buttons__edit'
              clickFn={editFn}
            />
          ) : (
            ''
          )}

          {hasWire ? <div className='actionCard__buttons__wire'>{wireText}</div> : ' '}

          {dropDownContent && (
            <div
              className={`action-card-dropdown-arrow ${dropDownOpen ? 'action-card-dropdown-arrow-open' : ''}`}
              onClick={() => setDropDownOpen(!dropDownOpen)}
            >
              <spriteIcons.IconDownChevron width='15' />
            </div>
          )}

          {hasArrow ? (
            <div
              className={`actionCard__buttons__arrow ${
                hasToggle || hasRadio || hasTrash ? 'actionCard__buttons__arrow--withtoggle' : ''
              }`}
              onClick={() => {
                if (linkInArrow && link && link !== 'undefined') {
                  navigate(link)
                }
              }}
            >
              <spriteIcons.IconRightChevron />
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
      {bottomArea && <div className='action-card-bottom-area'>{bottomArea}</div>}
      {dropDownContent && (
        <div className={`action-card-dropdown-content ${dropDownOpen ? 'action-card-dropdown-content-open' : ''}`}>
          {dropDownContent}
        </div>
      )}
    </div>
  )
}

export default ActionCard
