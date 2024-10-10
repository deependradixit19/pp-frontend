import { FC, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'
import Button from '../../../../components/UI/Buttons/Button'
import InputCard from '../../../../components/Form/InputCard/InputCard'
import { useModalContext } from '../../../../context/modalContext'
import { addToast } from '../../../../components/Common/Toast/Toast'
import '../AddFansGroupModal/_add-fans-group-modal.scss'
import { editFansGroup } from '../../../../services/endpoints/fans_groups'

const EditFansGroupModal: FC<{
  activeGroup: { id: number; name: string }
  dontClearModal?: boolean
  customCloseFn?: () => void
  closeDrawer?: () => void
  groupNames?: string[]
}> = ({ activeGroup, dontClearModal, customCloseFn, closeDrawer, groupNames }) => {
  const [fansGroupName, setFansGroupName] = useState(activeGroup.name)
  const modalData = useModalContext()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const editFansGroupMutation = useMutation(() => editFansGroup(activeGroup.id, { name: fansGroupName }), {
    onSuccess: () => {
      queryClient.invalidateQueries('fans-groups')
      addToast('success', t('successfullyUpdated'))
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

  const editFansGroupSubmit = () => {
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
    editFansGroupMutation.mutate()
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
            editFansGroupMutation.isLoading ? 'add-fans-group-modal-button-loading' : ''
          }`}
          clickFn={editFansGroupSubmit}
          height='3'
          width='13'
          font='mont-14-normal'
        />
      </div>
    </div>
  )
}

export default EditFansGroupModal
