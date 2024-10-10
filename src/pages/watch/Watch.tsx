import { FC } from 'react'
import ReactDom from 'react-dom'
import LiveStream from '../../features/LiveStream/LiveStream'

interface Props {}

const Watch: FC<Props> = () => {
  const portal = document.getElementById('portal')

  if (!portal) return null
  !portal.classList.contains('portal--open') && portal.classList.add('portal--open')
  return ReactDom.createPortal(<LiveStream role='viewer' />, portal)
}

export default Watch
