import { useState, useRef, VFC } from 'react'
import { useTranslation } from 'react-i18next'
import { useOutsideAlerter } from '../../../helpers/hooks'
import SidebarItem from '../Sidebar/SidebarItem'

import styles from './BackgroundPicker.module.scss'

export const GRADIENTS = [
  'linear-gradient(166deg, #E91C79 0%, #A36890 46.88%, #6E2A8F 100%)',
  'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(117.54deg, #672238 -10.6%, #2894FF 51.73%, #FFD54F 103.15%)',
  'linear-gradient(to right, #f857a6, #ff5858)',
  'linear-gradient(to right, #fc354c, #0abfbc)',
  'linear-gradient(to right, #dae2f8, #d6a4a4)'
]

type BackgroundPickerProps = {
  background: string
  setBackground: (background: string) => void
  isDisabled?: boolean
}

const BackgroundPicker: VFC<BackgroundPickerProps> = ({ background, setBackground, isDisabled }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()
  const pickerRef = useRef(null)
  useOutsideAlerter(
    pickerRef,
    () => {
      setIsOpen(false)
    },
    []
  )
  return (
    <SidebarItem
      onClick={() => {
        setIsOpen(bgPickerOpen => !bgPickerOpen)
      }}
      text={t('background')}
      icon={<div className={styles.icon} style={{ background }} />}
      isDisabled={isDisabled}
    >
      {isOpen && (
        <div ref={pickerRef} className={styles.picker}>
          {GRADIENTS.map((color, index) => {
            return (
              <div
                onClick={e => {
                  e.preventDefault()
                  setBackground(color)
                }}
                key={index}
                className={styles.pickerItem}
                style={{ background: color }}
              ></div>
            )
          })}
        </div>
      )}
    </SidebarItem>
  )
}

export default BackgroundPicker
