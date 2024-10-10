import { FC } from 'react'

import './_liveStream.scss'
import LiveStreamCreator from './LiveStreamCreator/LiveStreamCreator'
import LiveStreamViewer from './LiveStreamViewer/LiveStreamViewer'

interface Props {
  role: string
}

const LiveStream: FC<Props> = ({ role }) => {
  return role === 'creator' ? <LiveStreamCreator /> : <LiveStreamViewer />
}

export default LiveStream
