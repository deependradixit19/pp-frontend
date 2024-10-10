import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SearchField from '../../../components/Form/SearchField/SearchField'

import IconButton from '../../../components/UI/Buttons/IconButton'

import { useModalContext } from '../../../context/modalContext'
import SortModal from '../../../components/UI/Modal/Sort/SortModal'
import { ISearchResult } from '../../../types/interfaces/ISearchResult'
import AddModal from '../../../components/UI/Modal/Add/AddModal'
import AddUsers from '../../../components/UI/Modal/AddUsers/AddUsers'
import * as spriteIcons from '../../../assets/svg/sprite'
import { IMediaSearchResult } from '../../../types/interfaces/IMediaSearchResult'

const SearchWithButtons: FC<{
  searchValue?: string
  searchFn?: any
  searchResults?: {
    resultsType: string
    resultsData: ISearchResult[]
  }
  mediaSearchResults?: IMediaSearchResult
  additionalProps?: any
  sortingProps?: { selectedSort: string; selectedOrder: string }
  buttons?: any
  applyFn?: any
  selectFn?: (value: string, id?: number) => void
  clearFn?: () => void
  searchSettings?: {
    isForm?: boolean
    iconClickFn?: () => void
    formSubmitFn?: (e: any) => void
    hideIconOnMobile?: boolean
  }
}> = ({
  searchValue,
  searchFn,
  searchResults,
  mediaSearchResults,
  additionalProps,
  sortingProps,
  buttons,
  applyFn,
  searchSettings,
  selectFn,
  clearFn
}) => {
  const [actionDDActive, setActionDDActive] = useState<boolean>(false)
  const modalData = useModalContext()
  const { t } = useTranslation()

  return (
    <div className='layoutHeader__search__withbuttons'>
      <SearchField
        value={searchValue}
        changeFn={searchFn}
        additionalProps={additionalProps}
        customClass='layoutHeader__search__withbuttons__input'
        searchResults={searchResults}
        mediaSearchResults={mediaSearchResults}
        searchSettings={searchSettings}
        selectFn={selectFn}
        clearFn={clearFn}
      />
      {buttons.map(
        (
          item: {
            type: string
            elements: any
            color?: string
            icon?: string
            action?: any
            customClass?: string
            hasResetBtn?: boolean
            resetFn?: any
            sortingProps?: {
              selectedSort: string
              selectedOrder: string
              selectProps: { [key: string]: string | number }
            }
            dontClearModal?: boolean
            applyFn?: any
            overlay?: boolean
            customClickFn?: () => void
            onModalOpen?: () => void
          },
          key: number
        ) => {
          /*
            ! For SORTing items
            buttons={[
              {
                type: "sort",
                //color: "white" (or default to black)
                elements: {
                  first_section: [
                    {
                      value: string,
                      name: string
                    }
                  ],
                  second_section: [...]
                }
            },
            * Add applyFn for apply button to do anything...

          */
          if (item.type === 'sort') {
            return (
              <IconButton
                key={key}
                icon={<spriteIcons.IconSortAsc />}
                type={item.color ? item.color : 'black'}
                customClass={item.customClass ? item.customClass : ''}
                clickFn={
                  item.customClickFn
                    ? item.customClickFn
                    : () => {
                        item.onModalOpen && item.onModalOpen()
                        modalData.addModal(
                          t('sortBy'),
                          <SortModal
                            elements={item.elements}
                            applyFn={item.applyFn ? item.applyFn : applyFn}
                            sortingProps={item.sortingProps ? item.sortingProps : sortingProps}
                            dontClearModal={item.dontClearModal}
                          />
                        )
                      }
                }
              />
            )
          } else if (item.type === 'filter') {
            return (
              <IconButton
                key={key}
                icon={<spriteIcons.IconFilterOutline color='#ffffff' />}
                type={item.color ? item.color : 'black'}
                customClass={item.customClass ? item.customClass : ''}
                clickFn={
                  item.customClickFn
                    ? item.customClickFn
                    : () => {
                        item.onModalOpen && item.onModalOpen()
                        modalData.addModal(
                          t('filterBy'),
                          <SortModal
                            sortingProps={item.sortingProps}
                            hasResetBtn={item.hasResetBtn ? item.hasResetBtn : false}
                            resetFn={item.resetFn ? item.resetFn : null}
                            elements={item.elements}
                            applyFn={item.applyFn ? item.applyFn : applyFn}
                          />
                        )
                      }
                }
              />
            )
          } else if (item.type === 'actions') {
            /*
              ! For smaller dropdown with ACTIONS butons (icon + text)
              buttons={[
                {
                  type: "actions",
                  //color: "white" (or default to black),
                  elements: [
                    {
                      icon: string,
                      text: string,
                      clickFn: onClick event
                    }
                  ]
                }
              ]}
            */
            return (
              <div key={key}>
                <IconButton
                  icon={item.icon ? item.icon : <spriteIcons.IconExcMarkCircle />}
                  type={item.color ? item.color : 'black'}
                  clickFn={() => {
                    setActionDDActive(!actionDDActive)
                  }}
                />
                {item.overlay && (
                  <div
                    className={`layoutHeader__actiondd__overlay ${
                      actionDDActive ? 'layoutHeader__actiondd__overlay--open' : ''
                    }`}
                    onClick={() => setActionDDActive(false)}
                  ></div>
                )}
                <div
                  className={`layoutHeader__actiondd layoutHeader__actiondd--${actionDDActive ? 'active' : 'inactive'}`}
                >
                  {item.elements.map((item: any, key: any) => (
                    <div
                      key={key}
                      className='layoutHeader__actiondd__item'
                      onClick={() => {
                        item.clickFn()
                        setActionDDActive(false)
                      }}
                    >
                      {typeof item.icon === 'string' ? <img src={item.icon} alt={item.text} /> : item.icon}
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            )
            /*
              ! Call to action - CTA - button with one action
              button{[
                {
                  type: "cta",
                  // color: "white" (or default to black)
                  icon: string,
                  action: onClick event
                }
              ]}
            */
          } else if (item.type === 'cta') {
            return (
              <IconButton
                key={key}
                icon={item.icon || ''}
                type={item.color ? item.color : 'black'}
                clickFn={() => item.action()}
                customClass={item.customClass || ''}
              />
            )
          } else if (item.type === 'add') {
            return (
              <IconButton
                key={key}
                icon={item.icon || ''}
                type={item.color ? item.color : 'white'}
                customClass={item.customClass || ''}
                clickFn={() => modalData.addModal(t('createNewGroup'), <AddModal />)}
              />
            )
          } else if (item.type === 'add-users') {
            return (
              <IconButton
                key={key}
                icon={item.icon || ''}
                type={item.color ? item.color : 'white'}
                customClass={item.customClass || ''}
                clickFn={() =>
                  modalData.addModal(t('addUsers'), <AddUsers />, false, false, 'add__users__modal-custom')
                }
              />
            )
          } else if (item.type === 'custom') {
            return (
              <IconButton
                key={key}
                icon={item.icon || ''}
                type={item.color || 'black'}
                customClass={item.customClass || ''}
                clickFn={() => item.action()}
              />
            )
          } else {
            return null
          }
        }
      )}
    </div>
  )
}

export default SearchWithButtons
