import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from 'react-query'
import { addToast } from '../../../../components/Common/Toast/Toast'
import Button from '../../../../components/UI/Buttons/Button'
import { useModalContext } from '../../../../context/modalContext'
import { deleteMediaCategory } from '../../../../services/endpoints/mediaCategories'
import './_delete-category-modal.scss'

const DeleteCategoryModal: FC<{
  selectedCategory: { name: string; id: number | null }
  closeDrawer: () => void
}> = ({ selectedCategory, closeDrawer }) => {
  const modalData = useModalContext()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const deleteCategory = useMutation(() => deleteMediaCategory(selectedCategory.id), {
    onSuccess: () => {
      addToast('success', t('categorySuccessfullyDeleted'))
      modalData.clearModal()
      closeDrawer()
      queryClient.invalidateQueries('allMediaCategories')
    },
    onError: () => {
      addToast('error', t('error:anErrorOccuredPleaseTryAgain'))
      modalData.clearModal()
      closeDrawer()
      queryClient.invalidateQueries('allMediaCategories')
    }
  })
  return (
    <div className='delete-category-modal-container'>
      <p className='delete-category-modal-text'>
        {t('areYouSureYouWantToDelete')} <span className='delete-category-name'>{selectedCategory.name} </span>?
      </p>
      <div className='delete-category-modal-button-container'>
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
          customClass={`delete-category-modal-button ${
            deleteCategory.isLoading ? 'delete-category-modal-button-loading' : ''
          }`}
          clickFn={() => deleteCategory.mutate()}
          height='3'
          width='13'
          font='mont-14-normal'
        />
      </div>
    </div>
  )
}

export default DeleteCategoryModal
