import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useModalContext } from '../../../context/modalContext'

import { AllIcons } from '../../../helpers/allIcons'
import IconButton from '../../../components/UI/Buttons/IconButton'

import SortModal from '../../../components/UI/Modal/Sort/SortModal'
import * as spriteIcons from '../../../assets/svg/sprite'

const TitleWithButtons: FC<{
  titleWithIcon?: JSX.Element
  buttons?: any
  applyFn?: any
  sortingProps?: { selectedSort: string; selectedOrder: string }
}> = ({ titleWithIcon, buttons, applyFn, sortingProps }) => {
  const [actionDDActive, setActionDDActive] = useState<boolean>(false)
  const modalData = useModalContext()
  const { t } = useTranslation()

  return (
    <div className='layoutHeader__title__withbuttons'>
      <div className='layoutHeader__title__withbuttons__title'>{titleWithIcon}</div>
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
            applyFn?: any
            customClickFn?: () => void
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
                clickFn={
                  item.customClickFn
                    ? item.customClickFn
                    : () =>
                        modalData.addModal(
                          'Sort by',
                          <SortModal
                            elements={item.elements}
                            applyFn={item.applyFn ? item.applyFn : applyFn}
                            sortingProps={item.sortingProps ? item.sortingProps : sortingProps}
                          />
                        )
                }
              />
            )
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
          } else if (item.type === 'filter') {
            return (
              <IconButton
                key={key}
                icon={<spriteIcons.IconFilterOutline color='#ffffff' />}
                type={item.color ? item.color : 'black'}
                clickFn={
                  item.customClickFn
                    ? item.customClickFn
                    : () =>
                        modalData.addModal(
                          'Filter by',
                          <SortModal
                            sortingProps={item.sortingProps}
                            hasResetBtn={item.hasResetBtn ? item.hasResetBtn : false}
                            resetFn={item.resetFn ? item.resetFn : null}
                            elements={item.elements}
                            applyFn={item.applyFn ? item.applyFn : applyFn}
                          />
                        )
                }
              />
            )
          } else if (item.type === 'actions') {
            return (
              <div key={key}>
                <IconButton
                  icon={AllIcons.button_info}
                  type={item.color ? item.color : 'black'}
                  clickFn={() => {
                    setActionDDActive(!actionDDActive)
                  }}
                />
                <div
                  className={`layoutHeader__actiondd layoutHeader__actiondd--${actionDDActive ? 'active' : 'inactive'}`}
                >
                  {item.elements.map((item: any, key: any) => (
                    <div
                      className='layoutHeader__actiondd__item'
                      onClick={() => {
                        item.clickFn()
                        setActionDDActive(false)
                      }}
                    >
                      <img src={item.icon} alt={item.text} />
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

export default TitleWithButtons
