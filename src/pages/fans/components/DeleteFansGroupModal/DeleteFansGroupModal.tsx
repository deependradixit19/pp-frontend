import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from 'react-query'
import { addToast } from '../../../../components/Common/Toast/Toast'
import Button from '../../../../components/UI/Buttons/Button'
import { useModalContext } from '../../../../context/modalContext'
import { deleteFansGroup } from '../../../../services/endpoints/fans_groups'
import './_delete-fans-group-modal.scss'

const DeleteFansGroupModal: FC<{
  activeGroup: { id: number; name: string }
  closeDrawer?: () => void
  customCloseFn?: () => void
  dontClearModal?: boolean
}> = ({ activeGroup, closeDrawer, customCloseFn, dontClearModal }) => {
  const modalData = useModalContext()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const deleteGroup = useMutation(() => deleteFansGroup(activeGroup.id), {
    onSuccess: () => {
      queryClient.invalidateQueries('fans-groups')
      addToast('sucess', t('successfullyDeleted'))
      if (!dontClearModal) {
        modalData.clearModal()
      }
      if (closeDrawer) {
        closeDrawer()
      }
    },
    onError: () => {
      addToast('error', t('error:anErrorOccuredPleaseTryAgain'))
      if (!dontClearModal) {
        modalData.clearModal()
      }
      if (closeDrawer) {
        closeDrawer()
      }
    }
  })

  return (
    <div className='delete-fans-group-modal-container'>
      <p className='delete-fans-group-modal-text'>
        {t('areYouSureYouWantToDelete')} <span className='delete-fans-group-name'>{activeGroup.name} </span>?
      </p>
      <div className='delete-fans-group-modal-button-container'>
        <Button
          text={t('back')}
          color='black'
          clickFn={() => modalData.clearModal()}
          height='3'
          width='13'
          font='mont-14-normal'
        />
        <Button
          text={t('delete')}
          color='blue'
          customClass={`delete-fans-group-modal-button ${
            deleteGroup.isLoading ? 'delete-fans-group-modal-button-loading' : ''
          }`}
          clickFn={() => deleteGroup.mutate()}
          height='3'
          width='13'
          font='mont-14-normal'
        />
      </div>
    </div>
  )
}

export default DeleteFansGroupModal
