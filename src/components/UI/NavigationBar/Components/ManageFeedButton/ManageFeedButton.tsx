import { FC } from 'react'
// Services
import { useModalContext } from '../../../../../context/modalContext'
// Components
import ManageFeed from '../../../Modal/ManageFeed/ManageFeed'
// Styling
import styles from './ManageFeedButton.module.scss'

interface ManageFeedButton {
  onClick?: () => any
  onApply?: (id: number) => void
  chosenListId?: number
}

const ManageFeedButton: FC<ManageFeedButton> = ({ onApply, chosenListId }) => {
  const modalData = useModalContext()
  const openManageFeedModal = () => {
    modalData.addModal('Manage Feed', <ManageFeed onApply={onApply} chosenListId={chosenListId} />, false)
  }

  return (
    <button className={styles.manageFeedButton} onClick={() => openManageFeedModal()}>
      +
    </button>
  )
}

export default ManageFeedButton
