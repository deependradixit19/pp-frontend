import { FC } from 'react'
import ActionCard from '../../../features/ActionCard/ActionCard'

const MainSettingsPage: FC<{
  settingsTop?: Array<{
    icon?: string | JSX.Element | JSX.Element[]
    body: string | JSX.Element | JSX.Element[]
    currentData?: string | JSX.Element | JSX.Element[]
    info?: string | JSX.Element | JSX.Element[]
    link?: string
    absFix?: boolean
    hasToggle?: boolean
    hasToggleWithText?: boolean
    toggleText?: string
    toggleFn?: () => void
    toggleActive?: boolean
    hasArrow?: boolean
    hasWire?: boolean
    customClass?: string
  }>
  settingsBot?: Array<{
    icon?: string | JSX.Element | JSX.Element[]
    body: string | JSX.Element | JSX.Element[]
    currentData?: string | JSX.Element | JSX.Element[]
    info?: string | JSX.Element | JSX.Element[]
    link?: string
    absFix?: boolean
    hasToggle?: boolean
    hasToggleWithText?: boolean
    toggleText?: string
    toggleFn?: () => void
    toggleActive?: boolean
    hasArrow?: boolean
    hasWire?: boolean
    clickFn?: () => void
  }>
}> = ({ settingsTop, settingsBot }) => {
  return (
    <div className='settings settings__fields'>
      {settingsTop?.map(
        (
          card: {
            icon?: string | JSX.Element | JSX.Element[]
            body: string | JSX.Element | JSX.Element[]
            currentData?: string | JSX.Element | JSX.Element[]
            info?: string | JSX.Element | JSX.Element[]

            link?: string
            absfix?: boolean

            hasToggle?: boolean
            hasToggleWithText?: boolean
            toggleText?: string
            toggleFn?: () => void
            toggleActive?: boolean
            hasArrow?: boolean
            hasWire?: boolean
            customClass?: string
          },
          ind: number
        ) => (
          <ActionCard
            key={ind}
            link={card.link}
            icon={card.icon}
            text={card.body}
            subtext={card.currentData}
            description={card.info}
            hasArrow={card.hasArrow}
            hasToggle={card.hasToggle}
            hasToggleWithText={card.hasToggleWithText}
            toggleText={card.toggleText}
            toggleActive={card.toggleActive}
            toggleFn={card.toggleFn}
            absFix={card.absfix}
            hasWire={card.hasWire}
            customClass={card.customClass}
          />
        )
      )}
      {settingsBot ? <hr className='settings__fields__break' /> : ''}
      {settingsBot?.map(
        (
          card: {
            icon?: string | JSX.Element | JSX.Element[]
            body: string | JSX.Element | JSX.Element[]
            currentData?: string | JSX.Element | JSX.Element[]
            info?: string | JSX.Element | JSX.Element[]

            link?: string
            absfix?: boolean

            hasToggle?: boolean
            toggle?: any
            hasToggleWithText?: boolean
            toggleText?: string
            toggleFn?: () => void
            toggleActive?: boolean
            hasArrow?: boolean
            hasWire?: boolean
            clickFn?: () => void
          },
          ind: number
        ) => (
          <ActionCard
            key={ind}
            link={card.link}
            icon={card.icon}
            text={card.body}
            subtext={card.currentData}
            description={card.info}
            hasArrow={card.hasArrow}
            hasToggle={card.hasToggle}
            hasToggleWithText={card.hasToggleWithText}
            toggleText={card.toggleText}
            toggleActive={card.toggleActive}
            toggleFn={card.toggleFn}
            absFix={card.absfix}
            hasWire={card.hasWire}
            clickFn={card.clickFn}
          />
        )
      )}
    </div>
  )
}

export default MainSettingsPage
