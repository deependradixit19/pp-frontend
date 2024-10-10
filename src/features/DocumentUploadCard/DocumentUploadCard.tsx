import { FC, useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PayoutDocumentType, postDocument } from '../../services/endpoints/payout'

import styles from './DocumentUploadCard.module.scss'
import { IconFile } from '../../assets/svg/sprite'

const validFileTypes = ['pdf']
const MAX_BYTES = 10485760

const DocumentUploadCard: FC<{
  type: PayoutDocumentType
  title: string
}> = ({ type, title }) => {
  const { t } = useTranslation()
  const [progress, setProgress] = useState<number>()
  const [error, setError] = useState<string>('')
  const cancelCbRef = useRef<() => void>()

  const uploadDocument = useCallback(
    (file: File) => {
      const singleUpload = postDocument({
        file,
        type,
        setProgress: (loaded: number, total: number, cancelCb: () => void) => {
          const perc = Math.floor((100 * loaded) / total)
          cancelCbRef.current = cancelCb
          setProgress(perc)
        }
      })
        .then(resp => {
          return resp
        })
        .catch(err => {
          setError(t('error:errorUploadingFile'))
        })

      return singleUpload
    },
    [t, type]
  )

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    progress && progress < 100 && cancelCbRef?.current?.()
    try {
      error && setError('')
      if (file.size > MAX_BYTES || !validFileTypes.includes(file.type.split('/')[1])) {
        throw new Error('id_error')
      }
      setProgress(0)
      uploadDocument(file)
    } catch (err: any) {
      if (err.message === 'id_error') {
        setError(t('error:invalidFileTypeOrSize'))
      }
    }
  }

  return (
    <div className={styles.uploadCard}>
      <div className={styles.body}>
        <div className={styles.icon}>
          <IconFile />
        </div>
        <div className={styles.right}>
          <span className={styles.title}>{title}</span>
          <div className={styles.progressBar}>
            {!error ? (
              <span>
                {progress == null
                  ? `${t('clickHereTo')} ${t('uploadLC')}`
                  : progress < 100
                  ? t('Uploading')
                  : t('Completed')}
              </span>
            ) : (
              <span className={styles.error}>{error}</span>
            )}
            <progress max='100' value={progress ?? 0}></progress>
          </div>
        </div>
      </div>
      <p className={styles.error}>{error}</p>
      <input onChange={handleFileChange} type='file' id={type} hidden multiple={false} />
      <label htmlFor={type} className={styles.fileInput}></label>
    </div>
  )
}

export default DocumentUploadCard
