import React, { FC, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Icons } from '../../../helpers/newPostIcons'

const AddAnything: FC<{
  // addFile: (val: FileList | null, type: string[]) => void;
  handleSetUpload: any
}> = ({ handleSetUpload }) => {
  const fileRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()

  return (
    <div className='newpost__body__addanything' onClick={() => fileRef.current?.click()}>
      <img src={Icons.plus} alt={t('addFile')} />
      <input
        ref={fileRef}
        type='file'
        onClick={e => {
          const target = e.target as HTMLInputElement
          target.value = ''
        }}
        onChange={(e: React.FormEvent<HTMLInputElement>) => handleSetUpload(e)}
        multiple={true}
        id='post__anything__upload'
        accept='image/*,video/mp4,video/x-m4v,video/*,audio/*'
        hidden={true}
      />
    </div>
  )
}

export default AddAnything
