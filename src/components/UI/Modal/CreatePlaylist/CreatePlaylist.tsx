import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { IconModalClose } from '../../../../assets/svg/sprite'
import { createPlaylist } from '../../../../services/endpoints/media'
import { addToast } from '../../../Common/Toast/Toast'
import TextArea from '../../../Form/TextArea/TextArea'
import Button from '../../Buttons/Button'
import styles from './createPlaylist.module.scss'

interface Props {
  closeFn: () => void
  setSelectedPlaylist: (val: number) => void
}

const CreatePlaylist: FC<Props> = ({ closeFn, setSelectedPlaylist }) => {
  const [name, setName] = useState('')
  const { t } = useTranslation()

  const newPlaylist = useMutation((name: string) => createPlaylist(name), {
    onMutate: mutateData => {},
    onSuccess: data => {
      setSelectedPlaylist(data.data.id)
      closeFn()
    },
    onError: () => {
      addToast('error', t('error:errorSomethingWentWrong'))
    },
    onSettled: () => {}
  })
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.title}>{t('createNewPlaylist')}</div>
        <div className={styles.button} onClick={() => closeFn()}>
          <IconModalClose />
        </div>
      </div>
      <TextArea
        id='createPlaylist'
        value={name}
        changeFn={(val: string) => {
          name.length < 30 && setName(val)
        }}
        placeholder={t('playlistName')}
        label={t('playlistName')}
        customClass='createPlaylist'
        maxChar={30}
        showCount={true}
      />

      <div className={styles.footer}>
        <Button
          text={t('cancel')}
          color='grey'
          type='transparent--black1px'
          font='mont-14-normal'
          width='10'
          height='3'
          clickFn={closeFn}
        />

        <Button
          text={t('create')}
          color='blue'
          font='mont-14-normal'
          width='13'
          height='3'
          clickFn={() => newPlaylist.mutate(name)}
          // disabled={!selectedOption}
        />
      </div>
    </div>
  )
}

export default CreatePlaylist
