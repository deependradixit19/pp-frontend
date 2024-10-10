import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from 'react-query'
import { addToast } from '../../../../components/Common/Toast/Toast'
import InputCard from '../../../../components/Form/InputCard/InputCard'
import Button from '../../../../components/UI/Buttons/Button'
import { useModalContext } from '../../../../context/modalContext'
import { editMediaCategories } from '../../../../services/endpoints/mediaCategories'
import './_edit-category-modal.scss'

const EditCategoryModal: FC<{
  selectedCategory: { name: string; id: number | null }
  closeDrawer: () => void
}> = ({ selectedCategory, closeDrawer }) => {
  const [categoryName, setCategoryName] = useState(selectedCategory.name || '')
  const modalData = useModalContext()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const editCategory = useMutation(() => editMediaCategories(categoryName, selectedCategory.id), {
    onSuccess: () => {
      addToast('success', t('categorySuccessfullyEdited'))
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

  const editCategorySubmit = () => {
    if (categoryName.trim() !== '') {
      editCategory.mutate()
    } else {
      addToast('error', t('error:pleaseInputCategoryName'))
    }
  }

  return (
    <div>
      <InputCard
        customClass='edit-category-modal-input'
        hasDesc={true}
        desc={`${categoryName.trim().length} / 30 characters`}
        type='text'
        label={t('categoryName')}
        maxChars={30}
        value={categoryName}
        changeFn={(value: string) => setCategoryName(value)}
      />
      <div className='edit-category-modal-buttons-container'>
        <Button
          text={t('back')}
          color='black'
          clickFn={() => {
            modalData.clearModal()
            setCategoryName('')
          }}
          height='3'
          width='13'
          font='mont-14-normal'
        />
        <Button
          text={t('save')}
          color='blue'
          customClass={`edit-category-modal-button ${
            editCategory.isLoading ? 'edit-category-modal-button-loading' : ''
          }`}
          clickFn={editCategorySubmit}
          height='3'
          width='13'
          font='mont-14-normal'
        />
      </div>
    </div>
  )
}

export default EditCategoryModal
