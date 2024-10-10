import { ReactNode } from 'react'
import style from './Sidebar.module.scss'

const Sidebar = ({ children }: { children: ReactNode }) => {
  return (
    <div className={style.container}>
      <div className={style.sidebar}>{children}</div>
    </div>
  )
}

export default Sidebar
