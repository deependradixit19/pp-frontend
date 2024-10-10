import { FC } from 'react'
import styles from './feedLoader.module.scss'

const FeedLoader: FC = () => {
  return (
    <div className={styles.ldsRing}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}
export default FeedLoader
