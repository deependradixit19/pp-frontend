import { FC, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Icons as moreIcons } from '../../../helpers/icons'

import IconButton from '../../../components/UI/Buttons/IconButton'
import SvgIconButton from '../../../components/UI/Buttons/SvgIconButton'
import * as SvgIcons from '../../../assets/svg/sprite'
import { getSupportedMediaFormats } from '../../../helpers/media'

const PostMediaInputs: FC<{
  filesAdded: boolean
  handleSetUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  toggleReorder: () => void
  handleAddPollOpen: () => void
  handleAddGoalOpen: () => void
  reorderActive: boolean
  confirmReorder: any
  postType: string
  handleOpenRecorder: (type: string) => void
  hasAudio: boolean
}> = ({
  filesAdded,
  handleSetUpload,
  toggleReorder,
  handleAddPollOpen,
  handleAddGoalOpen,
  reorderActive,
  confirmReorder,
  postType,
  handleOpenRecorder,
  hasAudio
}) => {
  const postImgRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()

  const acceptedMediaFormats = getSupportedMediaFormats()

  return (
    <div
      className={`newpost__body__input newpost__body__input--media ${
        filesAdded ? 'newpost__body__input--media--active' : ''
      }`}
    >
      <div className='newpost__input__buttons'>
        <SvgIconButton
          icon={
            <SvgIcons.IconImageOutline color={postType ? (postType === 'media' ? '#200E32' : '#AFAFAF') : '#200E32'} />
          }
          clickFn={() => postImgRef.current!.click()}
          desc={t('addImage')}
          customClass='newpost__input__buttons__button'
          type='medium'
          input={
            <input
              ref={postImgRef}
              type='file'
              onChange={handleSetUpload}
              multiple={true}
              id='post__img__upload'
              accept={acceptedMediaFormats}
              hidden={true}
              key={Math.random().toString(36)}
              // disabled={
              //   postType
              //     ? postType === 'poll' || postType === 'goal'
              //       ? true
              //       : false
              //     : false
              // }
              disabled={!!postType && (postType === 'poll' || postType === 'goal')}
            />
          }
        />
        <SvgIconButton
          icon={
            <SvgIcons.IconVideoOutline color={postType ? (postType === 'media' ? '#200E32' : '#AFAFAF') : '#200E32'} />
          }
          clickFn={() => {
            !postType && handleOpenRecorder('video')
          }}
          desc={t('addVideo')}
          customClass='newpost__input__buttons__button'
          type='medium'
        />
        <SvgIconButton
          icon={
            <SvgIcons.IconAudioOutline
              color={hasAudio || postType === 'poll' || postType === 'goal' ? '#AFAFAF' : '#200E32'}
            />
          }
          desc={t('recordAudio')}
          customClass='newpost__input__buttons__button'
          clickFn={() => {
            if (!hasAudio && postType !== 'poll' && postType !== 'goal') {
              handleOpenRecorder('audio')
            }
          }}
          type='medium'
        />
        <SvgIconButton
          icon={<SvgIcons.IconPoll color={postType ? (postType !== 'poll' ? '#AFAFAF' : '#200E32') : '#200E32'} />}
          clickFn={() => {
            if (postType) {
              if (postType === 'poll') {
                // handleAddPollOpen();
              }
            } else {
              handleAddPollOpen()
            }
          }}
          desc={t('addPoll')}
          customClass='newpost__input__buttons__button'
          type='medium'
        />
        <SvgIconButton
          icon={<SvgIcons.IconGoal color={postType ? (postType !== 'goal' ? '#AFAFAF' : '#200E32') : '#200E32'} />}
          clickFn={() => {
            if (postType) {
              if (postType === 'goal') {
                // handleAddPollOpen();
              }
            } else {
              handleAddGoalOpen()
            }
          }}
          desc={t('addPoll')}
          customClass='newpost__input__buttons__button'
          type='medium'
        />
      </div>

      {filesAdded && postType !== 'poll' && postType !== 'goal' ? (
        <div className='newpost__input__reorder'>
          {!reorderActive ? (
            <IconButton
              customClass='newpost__input__reorder--icon'
              icon={moreIcons.change_order}
              desc={t('changeOrder')}
              clickFn={toggleReorder}
              type='medium'
            />
          ) : (
            <IconButton
              customClass='newpost__input__reorder--icon'
              icon={moreIcons.checkmark_outline_blue}
              desc={t('confirmReorder')}
              clickFn={confirmReorder}
              type='medium'
            />
          )}
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default PostMediaInputs
