import React, { FC, useState } from 'react'
import './_dropdownSelect.scss'
import ReactCountryFlag from 'react-country-flag'
import { useTranslation } from 'react-i18next'
import { Icons } from '../../helpers/icons'
import RadioButton from '../../components/Common/RadioButton/RadioButton'

const DropdownSelect: FC<{
  icon?: string
  botIcon?: string
  placeHolder: string
  hasBottomSection?: boolean
  searchTerm: string
  setSearchTerm: (val: string) => void
  botSearchTerm?: string
  setBotSearchTerm?: (val: string) => void
  elementsArr: Array<any>
  botElementsArr?: Array<any>
  topSectionSelected: any
  topSectionSelect: any
  botSectionSelected?: any
  botSectionSelect?: any
  customClass?: string
}> = ({
  icon,
  botIcon,
  placeHolder,
  hasBottomSection,

  searchTerm,
  setSearchTerm,
  elementsArr,
  topSectionSelected,
  topSectionSelect,

  botSearchTerm,
  setBotSearchTerm,
  botElementsArr,
  botSectionSelected,
  botSectionSelect,
  customClass = ''
}) => {
  const [dropdownActive, setDropdownActive] = useState<boolean>(false)
  const [altDropdownActive, setAltDropdownActive] = useState<boolean>(false)
  const { t } = useTranslation()

  const renderTopElements = () => {
    return elementsArr?.map((item: any, key: number) => (
      <div
        key={key}
        className='dropdownSelect__element'
        onClick={() => {
          topSectionSelect(item)
          setDropdownActive(false)
        }}
      >
        <div className='dropdownSelect__element__icon'>
          <div className='flag__wrapper'>
            <ReactCountryFlag
              countryCode={item.flag_code || item.code}
              svg
              cdnUrl='https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/4x3/'
              cdnSuffix='svg'
              title={item.flag_code || item.code}
              style={{
                width: '4em',
                height: '3em'
              }}
            />
          </div>
        </div>
        <div className='dropdownSelect__element__name'>{item.name}</div>
        <RadioButton active={topSectionSelected?.code === item.code} />
      </div>
    ))
  }

  const renderBotElements = () => {
    return botElementsArr?.map((item: any, key: number) => (
      <div
        key={key}
        className='dropdownSelect__element'
        onClick={() => {
          botSectionSelect(item)
          setAltDropdownActive(false)
        }}
      >
        <div className='dropdownSelect__element__icon' />
        <div className='dropdownSelect__element__name'>{item.name}</div>
        <RadioButton active={botSectionSelected === item} />
      </div>
    ))
  }

  return (
    <>
      <div className={`dropdownSelect${botElementsArr?.length ? ' dropdownSelect--top' : ''} ${customClass}`}>
        <div className='dropdownSelect__head' onClick={() => setDropdownActive(!dropdownActive)}>
          {icon ? (
            <div className='dropdownSelect__head__icon'>
              <img src={icon} alt={t('dropdownIcon')} />
            </div>
          ) : (
            ''
          )}
          <div className='dropdownSelect__head__text'>
            {topSectionSelected && !dropdownActive ? (
              <p className='dropdownSelect__head__text__title'>{t('country')}</p>
            ) : (
              ''
            )}
            <input
              type='text'
              placeholder={placeHolder}
              value={!topSectionSelected ? searchTerm : topSectionSelected.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                topSectionSelect('')
                setSearchTerm(e.currentTarget.value)
              }}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.stopPropagation()
                if (!dropdownActive) setDropdownActive(true)
              }}
            />
          </div>
          <div
            className={`dropdownSelect__head__arrow dropdownSelect__head__arrow--${
              dropdownActive ? 'active' : 'inactive'
            }`}
          >
            <img src={Icons.chevronRight} alt={t('toggleArrow')} />
          </div>
        </div>
        <div className={`dropdownSelect__body dropdownSelect__body--${dropdownActive ? 'active' : 'inactive'}`}>
          {renderTopElements()}
        </div>
      </div>

      {hasBottomSection ? (
        <div className='dropdownSelect dropdownSelect--bot'>
          <div className='dropdownSelect__head' onClick={() => setAltDropdownActive(!altDropdownActive)}>
            {icon ? (
              <div className='dropdownSelect__head__icon'>
                <img src={botIcon} alt={t('dropdownIcon')} />
              </div>
            ) : (
              ''
            )}
            <div className='dropdownSelect__head__text'>
              {botSectionSelected && !altDropdownActive ? (
                <p className='dropdownSelect__head__text__title'>{t('stateProvince')}</p>
              ) : (
                ''
              )}
              <input
                type='text'
                placeholder={t('selectStateProvince')}
                value={!botSectionSelected ? botSearchTerm : botSectionSelected.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  botSectionSelect('')
                  setBotSearchTerm && setBotSearchTerm(e.currentTarget.value)
                }}
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  e.stopPropagation()
                  if (!altDropdownActive) setAltDropdownActive(true)
                }}
              />
            </div>
            <div
              className={`dropdownSelect__head__arrow dropdownSelect__head__arrow--${
                altDropdownActive ? 'active' : 'inactive'
              }`}
            >
              <img src={Icons.chevronRight} alt={t('toggleArrow')} />
            </div>
          </div>
          <div className={`dropdownSelect__body dropdownSelect__body--${altDropdownActive ? 'active' : 'inactive'}`}>
            {renderBotElements()}
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  )
}

export default DropdownSelect
