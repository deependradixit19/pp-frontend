import { FC, useRef } from 'react'
import style from './_inbox-container.module.scss'
import { IInboxContext } from './types'
import { InboxContext } from './InboxContext'

const InboxContainer: FC<{
  children: JSX.Element | JSX.Element[]
  customClass?: string
  scrollToBottom?: boolean
  containerRef?: any
}> = ({ children, customClass = '', containerRef }) => {
  const inboxRef = useRef()

  const changeClass = (className: string, type: 'add' | 'remove') => {
    const element = containerRef?.current ? containerRef?.current : inboxRef.current ? inboxRef.current : null

    if (element) {
      if (type === 'add') {
        element.classList.add(className)
      } else if (type === 'remove') {
        element.classList.remove(className)
      }
    }
  }

  const contextObject: IInboxContext = {
    changeClass
  }

  return (
    <InboxContext.Provider value={contextObject}>
      <div ref={containerRef || inboxRef} className={`${style.container} ${customClass}`}>
        {children}
      </div>
    </InboxContext.Provider>
  )
}

export default InboxContainer
