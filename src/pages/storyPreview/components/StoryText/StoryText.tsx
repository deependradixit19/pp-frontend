import React, { FC } from 'react'

import styles from './StoryText.module.scss'

type CoordiantesType = {
  x: number
  y: number
}

const StoryText: FC<{ text: string; coordinates: CoordiantesType }> = ({ text, coordinates }) => {
  return (
    <div className={styles.textContainer} style={{ left: `${coordinates.x}%`, top: `${coordinates.y}%` }}>
      <span>{text}</span>
    </div>
  )
}

export default StoryText
