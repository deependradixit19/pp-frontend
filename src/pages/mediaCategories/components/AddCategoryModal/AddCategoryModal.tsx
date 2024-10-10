import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from 'react-query'
import { addToast } from '../../../../components/Common/Toast/Toast'
import InputCard from '../../../../components/Form/InputCard/InputCard'
import Button from '../../../../components/UI/Buttons/Button'
import { useModalContext } from '../../../../context/modalContext'
import { createMediaCategories } from '../../../../services/endpoints/mediaCategories'
import './_add-category-modal.scss'

interface Props {
  onClose?: () => void
  existingNamesArray?: string[]
}

const AddCategoryModal: FC<Props> = ({ onClose, existingNamesArray }) => {
  const [categoryName, setCategoryName] = useState<string>('')
  const modalData = useModalContext()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const createCategory = useMutation(() => createMediaCategories(categoryName), {
    onSuccess: () => {
      addToast('success', t('categorySuccesfullyAdded'))
      queryClient.invalidateQueries('allMediaCategories')
      onClose ? onClose() : modalData.clearModal()
    },
    onError: () => {
      addToast('error', t('error:anErrorOccuredPleaseTryAgain'))
      queryClient.invalidateQueries('allMediaCategories')
      onClose ? onClose() : modalData.clearModal()
    }
  })

  const createCategorySubmit = () => {
    if (categoryName.trim() === '') {
      addToast('error', t('pleaseInputCategoryName'))
      return
    }
    if (existingNamesArray && existingNamesArray.includes(categoryName.trim())) {
      addToast('error', t('categoryNameAlreadyExists'))
      return
    }

    createCategory.mutate()
  }

  return (
    <div>
      <InputCard
        customClass='add-category-modal-input'
        hasDesc={true}
        desc={`${categoryName.trim().length} / 30 ${t('characters')}`}
        maxChars={30}
        type='text'
        value={categoryName}
        changeFn={(value: any) => setCategoryName(value)}
        label={t('categoryName')}
      />
      <div className='category-modal-buttons-container'>
        <Button
          text={t('back')}
          color='black'
          clickFn={() => {
            onClose ? onClose() : modalData.clearModal()
            setCategoryName('')
          }}
          height='3'
          width='13'
          font='mont-14-normal'
        />
        <Button
          text={t('add')}
          color='blue'
          customClass={`add-category-modal-button ${
            createCategory.isLoading ? 'add-category-modal-button-loading' : ''
          }`}
          clickFn={createCategorySubmit}
          height='3'
          width='13'
          font='mont-14-normal'
        />
      </div>
    </div>
  )
}

export default AddCategoryModal
