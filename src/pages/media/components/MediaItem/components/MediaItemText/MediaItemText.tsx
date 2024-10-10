import { FC } from 'react'
import { renderPostText } from '../../../../../../helpers/postHelpers'
import { IPostTag } from '../../../../../../types/interfaces/ITypes'

import styles from './mediaItemText.module.scss'

interface Props {
  text: string
  tags: IPostTag[]
}

const MediaItemText: FC<Props> = ({ text, tags }) => {
  return (
    <div className={styles.wrapper}>
      <p>{renderPostText(text || '', tags)}</p>
    </div>
  )
}

export default MediaItemText
