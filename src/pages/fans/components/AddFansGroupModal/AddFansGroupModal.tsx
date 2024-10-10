import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from 'react-query'
import { addToast } from '../../../../components/Common/Toast/Toast'
import InputCard from '../../../../components/Form/InputCard/InputCard'
import Button from '../../../../components/UI/Buttons/Button'
import { useModalContext } from '../../../../context/modalContext'
import { createFansGroup } from '../../../../services/endpoints/fans_groups'
import './_add-fans-group-modal.scss'

const AddFansGroupModal: FC<{
  dontClearModal?: boolean
  customCloseFn?: () => void
  groupNames?: string[]
}> = ({ dontClearModal, customCloseFn, groupNames }) => {
  const [fansGroupName, setFansGroupName] = useState('')
  const modalData = useModalContext()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const addFansGroup = useMutation(() => createFansGroup(fansGroupName.trim()), {
    onSuccess: () => {
      addToast('success', t('groupSuccesfullyAdded'))
      queryClient.invalidateQueries('fans-groups')
      if (!dontClearModal) {
        modalData.clearModal()
      }
      if (customCloseFn) {
        customCloseFn()
      }
    },
    onError: () => {
      addToast('error', t('error:anErrorOccuredPleaseTryAgain'))
      queryClient.invalidateQueries('fans-groups')
      if (!dontClearModal) {
        modalData.clearModal()
      }
      if (customCloseFn) {
        customCloseFn()
      }
    }
  })

  const addFansGroupSubmit = () => {
    if (fansGroupName.trim() === '') {
      addToast('error', t('error:pleaseInputGroupName'))
      return
    }
    if (groupNames) {
      const groupNamesLowerCase = groupNames.map(group => group.toLowerCase())
      if (
        fansGroupName.toLowerCase().trim() === 'friends' ||
        fansGroupName.toLowerCase().trim() === 'fans' ||
        fansGroupName.toLowerCase().trim() === 'all'
      ) {
        addToast('error', t('error:invalidGroupName'))
        return
      }
      if (
        groupNamesLowerCase.includes(fansGroupName.toLowerCase().replace('_', ' ').trim()) ||
        fansGroupName.toLowerCase().replace('_', ' ').trim() === 'all active'
      ) {
        addToast('error', t('error:groupWithThatNameAlreadyExists'))
        return
      }
    }
    addFansGroup.mutate()
  }

  return (
    <div className='add-fans-group-modal-container'>
      <InputCard
        value={fansGroupName}
        changeFn={(val: any) => setFansGroupName(val)}
        label={t('groupName')}
        hasDesc={true}
        desc={`${fansGroupName.trim().length} / 30 ${t('characters')}`}
        maxChars={30}
        type='text'
      />
      <div className='add-fans-group-modal-buttons'>
        <Button
          text={t('back')}
          color='transparent'
          type='transparent--black1px'
          clickFn={() => {
            if (!dontClearModal) {
              modalData.clearModal()
            }
            if (customCloseFn) {
              customCloseFn()
            }
            setFansGroupName('')
          }}
          height='3'
          width='13'
          font='mont-14-normal'
        />
        <Button
          text={t('add')}
          color='blue'
          customClass={`add-fans-group-modal-button ${
            addFansGroup.isLoading ? 'add-fans-group-modal-button-loading' : ''
          }`}
          clickFn={addFansGroupSubmit}
          height='3'
          width='13'
          font='mont-14-normal'
        />
      </div>
    </div>
  )
}

export default AddFansGroupModal
