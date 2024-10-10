import { FC, useEffect, useState } from 'react'
import './_sortModal.scss'
import { useTranslation } from 'react-i18next'
import { useModalContext } from '../../../../context/modalContext'
import RadioButton from '../../../Common/RadioButton/RadioButton'
import Button from '../../Buttons/Button'
import { ListSorting } from '../../../../types/types'
import { IconPlus, IconMinus } from '../../../../assets/svg/sprite'
import SwitchButton from '../../../Common/SwitchButton/SwitchButton'

const SortModal: FC<{
  elements: ListSorting
  applyFn: any
  filter?: string
  sort?: string
  sortingProps?: {
    selectedSort: string
    selectedOrder: string
    selectProps?: { [key: string]: string | number }
  }
  hasResetBtn?: any
  resetFn?: any
  dontClearModal?: boolean
}> = ({ elements, applyFn, filter, sort, sortingProps, hasResetBtn, resetFn, dontClearModal }) => {
  const default1 = elements?.first_section?.find(el => el.default)
  const default2 = elements?.second_section?.find(el => el.default)

  const [tempVal, setTempVal] = useState<string>(default1?.value || '')
  const [tempVal1, setTempVal1] = useState<string>(default2?.value || '')
  const [selectTempVal, setSelectTempVal] = useState<{}>(sortingProps?.selectProps || {})
  const modalData = useModalContext()
  const { t } = useTranslation()

  useEffect(() => {
    if (sortingProps) {
      setTempVal(sortingProps.selectedSort)
      setTempVal1(sortingProps.selectedOrder)
    }
  }, [sortingProps])

  const renderSelectedValue = (key: string | number) => {
    let selectedValue = null
    for (let i = 0; i < Object.keys(selectTempVal).length; i++) {
      if (Object.keys(selectTempVal)[i] === key) {
        selectedValue = selectTempVal[Object.keys(selectTempVal)[i] as keyof typeof selectTempVal]
      }
    }
    return selectedValue
  }

  const checkIfSelected = (key: string | number, value: string | number) => {
    let isSelected = false
    for (let i = 0; i < Object.keys(selectTempVal).length; i++) {
      if (Object.keys(selectTempVal)[i] === key) {
        if (selectTempVal[Object.keys(selectTempVal)[i] as keyof typeof selectTempVal] === value) {
          isSelected = true
        } else {
          isSelected = false
        }
      }
    }
    return isSelected
  }

  const setNextSelected = (
    array: { label: string | number; value: string | number }[],
    key: string | number,
    prevOrNext: string
  ) => {
    let newIndex = 0
    for (let i = 0; i < array.length; i++) {
      if (array[i].value === selectTempVal[key as keyof typeof selectTempVal]) {
        newIndex = prevOrNext === 'next' ? array.indexOf(array[i]) + 1 : array.indexOf(array[i]) - 1
      }
    }
    if (newIndex >= 0 && newIndex <= array.length - 1) {
      setSelectTempVal((prevState: any) => {
        return { ...prevState, [key]: array[newIndex].value }
      })
    }
  }

  return (
    <div className='sortModal__sort__wrapper'>
      {elements?.first_section ? (
        <ul className='sortModal__sort'>
          {elements?.first_section?.map(
            (
              item: {
                value: string
                name: string
                selectOptions?: {
                  value: string | number
                  label: string | number
                }[]
                isToggle?: boolean
              },
              key: number
            ) => (
              <li
                className='sortModal__sort__item'
                key={key}
                onClick={() => {
                  if (tempVal !== item.value) {
                    setTempVal(item.value)
                  } else {
                    setTempVal('')
                  }
                }}
              >
                <span className='sortModal__sort__item__name'>{item.name}</span>
                {item.selectOptions && (
                  <div className='sort-modal-select-options-container' onClick={(e: any) => e.stopPropagation()}>
                    <div
                      className='sort-modal-select-options-nav-buttons'
                      onClick={() => {
                        setNextSelected(item.selectOptions || [], item.value, 'prev')
                      }}
                    >
                      <IconMinus />
                    </div>
                    <label
                      htmlFor={`sortModalSelectCheck${item.value}`}
                      className={`sort-modal-select-options-selected ${
                        tempVal === item.value ? 'sort-modal-select-options-selected-active' : ''
                      }`}
                    >
                      {sortingProps?.selectProps &&
                        item.selectOptions.filter((option: any) => option.value === renderSelectedValue(item.value))[0]
                          .label}
                    </label>
                    <div
                      className='sort-modal-select-options-nav-buttons'
                      onClick={() => {
                        setNextSelected(item.selectOptions || [], item.value, 'next')
                      }}
                    >
                      <IconPlus color='#9B9B9B' width='10' height='10' />
                    </div>
                    <input
                      type='checkbox'
                      id={`sortModalSelectCheck${item.value}`}
                      className='sort-modal-select-options-checkbox'
                    />
                    <label
                      htmlFor={`sortModalSelectCheck${item.value}`}
                      className='sort-modal-select-options-all-options-overlay'
                    ></label>
                    <div className='sort-modal-select-options-all-options'>
                      {item.selectOptions.map((option: any) => (
                        <label
                          key={option.value}
                          htmlFor={`sortModalSelectCheck${item.value}`}
                          className={`sort-modal-select-options-single-option ${
                            checkIfSelected(item.value, option.value)
                              ? 'sort-modal-select-options-single-option-selected'
                              : ''
                          }`}
                          onClick={() =>
                            setSelectTempVal((prevState: any) => {
                              return {
                                ...prevState,
                                [item.value]: option.value
                              }
                            })
                          }
                        >
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                {!item.isToggle ? (
                  <RadioButton active={tempVal === item.value} />
                ) : (
                  <SwitchButton
                    active={tempVal === item.value}
                    toggle={() => {
                      if (tempVal !== item.value) {
                        setTempVal(item.value)
                      } else {
                        setTempVal('')
                      }
                    }}
                  />
                )}
              </li>
            )
          )}
        </ul>
      ) : (
        ''
      )}
      {elements?.second_section ? (
        <ul className='sortModal__sort sortModal__sort__2nd'>
          {elements?.second_section?.map((item: { value: string; name: string; isToggle?: boolean }, key: number) => (
            <li
              className='sortModal__sort__item'
              key={key}
              onClick={() => {
                if (tempVal1 !== item.value) {
                  setTempVal1(item.value)
                } else {
                  setTempVal1('')
                }
              }}
            >
              {item.name}
              {!item.isToggle ? (
                <RadioButton active={tempVal1 === item.value} />
              ) : (
                <SwitchButton
                  active={tempVal1 === item.value}
                  toggle={() => {
                    if (tempVal !== item.value) {
                      setTempVal(item.value)
                    } else {
                      setTempVal('')
                    }
                  }}
                />
              )}
            </li>
          ))}
        </ul>
      ) : (
        ''
      )}
      {elements?.third_section ? (
        <ul className='sortModal__sort sortModal__sort__3rd'>
          {elements?.third_section?.map((item: { value: string; name: string; isToggle?: boolean }, key: number) => (
            <li
              className='sortModal__sort__item'
              key={key}
              onClick={() => {
                if (tempVal1 !== item.value) {
                  setTempVal1(item.value)
                } else {
                  setTempVal1('')
                }
              }}
            >
              {item.name}
              {!item.isToggle ? (
                <RadioButton active={tempVal1 === item.value} />
              ) : (
                <SwitchButton
                  active={tempVal1 === item.value}
                  toggle={() => {
                    if (tempVal !== item.value) {
                      setTempVal(item.value)
                    } else {
                      setTempVal('')
                    }
                  }}
                />
              )}
            </li>
          ))}
        </ul>
      ) : (
        ''
      )}
      {/* <button onClick={() => applyFn(tempVal, tempVal1)}>Apply</button> */}
      <div className='sortModal__buttons'>
        {hasResetBtn && (
          <Button
            text={t('reset')}
            color='grey'
            font='mont-14-normal'
            width='10'
            height='3'
            clickFn={() => resetFn(setTempVal, setTempVal1, setSelectTempVal)}
            customClass='sortModal--btn'
          />
        )}
        <Button
          text={t('apply')}
          color='black'
          font='mont-14-normal'
          width='13'
          height='3'
          clickFn={() => {
            applyFn(tempVal, tempVal1, selectTempVal)
            if (!dontClearModal) {
              modalData.clearModal()
            }
          }}
          customClass='sortModal--btn'
        />
      </div>
    </div>
  )
}

export default SortModal
