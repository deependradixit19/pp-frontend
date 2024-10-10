import { FC, ReactNode } from 'react'

import styles from './Sidebar.module.scss'

type SidebarItemProps = {
  icon: ReactNode
  text: string
  onClick: () => void
  isDisabled?: boolean
  children?: ReactNode
}

const SidebarItem: FC<SidebarItemProps> = ({ icon, text, onClick, children, isDisabled }) => {
  return (
    <button className={styles.item} onClick={onClick} disabled={isDisabled}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.label}>{text}</div>
      {children}
    </button>
  )
}

export default SidebarItem
