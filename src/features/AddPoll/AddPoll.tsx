import { FC, useRef, useState } from 'react'
import classNames from 'classnames'

import { useTranslation } from 'react-i18next'
import { IconPollGradient, IconPollAsk, IconPollBgImg, IconPollYesNo, IconStatsClose } from '../../assets/svg/sprite'
import Button from '../../components/UI/Buttons/Button'
import Poll from './Poll'
import './_addPoll.scss'
import YesNoQuestion from './YesNoQuestion'
import AskQuestion from './AskQuestion'
import { getImageOrientation } from '../../helpers/util'
import { useOrientation } from '../../helpers/helperHooks'
import { IPoll, PollType } from '../../types/interfaces/ITypes'
import BackgroundPicker, { GRADIENTS } from '../../components/UI/BackgroundPicker/BackgroundPicker'
import Sidebar from '../../components/UI/Sidebar/Sidebar'
import SidebarItem from '../../components/UI/Sidebar/SidebarItem'

interface Props {
  handleClose: () => void
  handleSetPollData: (data: IPoll) => void
  noControls?: boolean
  backgroundColor?: string
}

interface IPollOptions {
  a: string
  b: string
  c: string
  d?: string
}

const AddPoll: FC<Props> = ({ handleClose, handleSetPollData, noControls, backgroundColor }) => {
  const [bgColor, setBgColor] = useState(backgroundColor || GRADIENTS[0])
  const [bgImg, setBgImg] = useState<string | null>(null)
  const [bgImgFile, setBgImgFile] = useState<File | null>(null)
  const [bgImgOrientation, setBgImgOrientation] = useState<string>('')
  const [selectedPollType, setSelectedPollType] = useState<PollType>('poll')
  const [yesNoQuestion, setYesNoQuestion] = useState('')
  const [askQuestion, setAskQuestion] = useState('')
  const [pollTitle, setPollTitle] = useState('')
  const [pollOptions, setPollOptions] = useState<IPollOptions>({
    a: '',
    b: '',
    c: ''
  })
  const [validationError, setValidationError] = useState('')

  const pollImgRef = useRef<HTMLInputElement>(null)
  const deviceOrientation = useOrientation()
  const { t } = useTranslation()

  const handleImgUpload = (e: React.FormEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.length ? e.currentTarget.files[0] : null

    if (!file) return

    const reader = new FileReader()

    reader.onload = async () => {
      const imgBlob: string = reader.result as string
      setBgImg(imgBlob)
      setBgImgFile(file)
      if (imgBlob) {
        const orientation: string = await getImageOrientation(imgBlob)
        if (orientation) {
          setBgImgOrientation(orientation)
        }
      }
    }

    reader.readAsDataURL(file)
  }
  const validatePoll = (pollTitle: string, pollOptions: IPollOptions, cb: () => void) => {
    const optionsWithData = Object.values(pollOptions).filter(option => option && option && option.trim().length)
    if (!pollTitle) {
      setValidationError(t('validation:pollTitleIsRequired'))
      setTimeout(() => {
        setValidationError('')
      }, 5000)
    } else if (!pollTitle.trim().length) {
      setValidationError(t('validation:pollTitleCannotBeEmpty'))
      setTimeout(() => {
        setValidationError('')
      }, 5000)
    } else if (optionsWithData && optionsWithData.length < 2) {
      setValidationError(t('validation:pollMustHaveMinimum2Options'))
      setTimeout(() => {
        setValidationError('')
      }, 5000)
    } else {
      cb()
    }
  }
  const validateQuestion = (yesNoValue: string, cb: () => void) => {
    if (!yesNoValue || !yesNoValue.trim().length) {
      setValidationError(t('validation:questionIsRequired'))
      setTimeout(() => {
        setValidationError('')
      }, 5000)
    } else {
      cb()
    }
  }

  const handleSavePoll = () => {
    switch (selectedPollType) {
      case 'poll':
        validatePoll(pollTitle, pollOptions, () => {
          const trimedTitle = pollTitle.trim()
          const trimedOptions = { ...pollOptions }
          Object.values(trimedOptions).forEach(value => {
            value.trim()
          })
          handleSetPollData({
            type: 'poll',
            question: trimedTitle,
            pollBg: bgImg ? bgImg : bgColor,
            pollBgImg: bgImgFile,
            answers: [...Object.values(trimedOptions).filter(el => el)]
          })
          handleClose()
        })

        break
      case 'yes/no':
        validateQuestion(yesNoQuestion, () => {
          handleSetPollData({
            type: 'yes/no',
            question: yesNoQuestion,
            pollBg: bgImg ? bgImg : bgColor,
            pollBgImg: bgImgFile,
            answers: null
          })
          handleClose()
        })
        break
      case 'ask':
        validateQuestion(askQuestion, () => {
          handleSetPollData({
            type: 'ask',
            question: askQuestion,
            pollBg: bgImg ? bgImg : bgColor,
            pollBgImg: bgImgFile,
            answers: null
          })
          handleClose()
        })
        break
      default:
        handleClose()
        return null
    }
  }

  if (!deviceOrientation) return null

  return (
    <div
      className={classNames('addPoll', {
        'addPoll--withBgImg': bgImg,
        'device-portrait': deviceOrientation.type.includes('portrait'),
        'device-landscape': deviceOrientation.type.includes('landscape'),
        'img-portrait': bgImgOrientation === 'portrait',
        'img-landscape': bgImgOrientation === 'landscape'
      })}
      style={{ backgroundImage: bgImg ? `url(${bgImg})` : bgColor }}
    >
      <div className='addPoll__wrapper'>
        <div className='addPoll__header'>
          <div className='addPoll__header__title'>{t('addPoll')}</div>
          <div className='add__header__close' onClick={() => handleClose()}>
            <IconStatsClose />
          </div>
        </div>

        <div className='addPoll__tabs'>
          <div
            className={`addPoll__tab addPoll__tab--${selectedPollType === 'poll' ? 'active' : ''}`}
            onClick={() => {
              if (selectedPollType !== 'poll') {
                setSelectedPollType('poll')
                validationError && setValidationError('')
              }
            }}
          >
            <div className='addPoll__tab__icon'>
              <IconPollGradient />
            </div>
            <div className='addPoll__tab__text'>{t('poll')}</div>
          </div>
          <div
            className={`addPoll__tab addPoll__tab--${selectedPollType === 'yes/no' ? 'active' : ''}`}
            onClick={() => {
              if (selectedPollType !== 'yes/no') {
                setSelectedPollType('yes/no')
                validationError && setValidationError('')
              }
            }}
          >
            <div className='addPoll__tab__icon'>
              <IconPollYesNo />
            </div>
            <div className='addPoll__tab__text'>{t('yesNo')}</div>
          </div>
          <div
            className={`addPoll__tab addPoll__tab--${selectedPollType === 'ask' ? 'active' : ''}`}
            onClick={() => {
              if (selectedPollType !== 'ask') {
                setSelectedPollType('ask')
                validationError && setValidationError('')
              }
            }}
          >
            <div className='addPoll__tab__icon'>
              <IconPollAsk />
            </div>
            <div className='addPoll__tab__text'>{t('ask')}</div>
          </div>
        </div>
        {!noControls && (
          <Sidebar>
            <SidebarItem icon={<IconPollBgImg />} text={t('upload')} onClick={() => pollImgRef.current!.click()}>
              <input
                ref={pollImgRef}
                type='file'
                onChange={handleImgUpload}
                multiple={true}
                id='poll__img__upload'
                accept='image/*'
                hidden={true}
                key={Math.random().toString(36)}
              />
            </SidebarItem>
            <BackgroundPicker background={bgColor} setBackground={setBgColor} />
          </Sidebar>
        )}
        <div className='addPoll__content'>
          {selectedPollType === 'poll' && (
            <Poll
              title={pollTitle}
              setPollTitle={(title: string) => setPollTitle(title)}
              options={pollOptions}
              handleOptionChange={(key: string, value: string) => {
                setPollOptions({ ...pollOptions, [key]: value })
              }}
              handleAddOption={() => setPollOptions({ ...pollOptions, d: '' })}
              validationError={validationError}
            />
          )}
          {selectedPollType === 'yes/no' && (
            <YesNoQuestion
              question={yesNoQuestion}
              handleQuestionChange={(value: string) => {
                setYesNoQuestion(value)
              }}
              validationError={validationError}
            />
          )}
          {selectedPollType === 'ask' && (
            <AskQuestion
              question={askQuestion}
              handleQuestionChange={(value: string) => {
                setAskQuestion(value)
              }}
              validationError={validationError}
            />
          )}
        </div>
        <div className='addPoll__footer'>
          <Button text={t('cancel')} color='white' font='mont-14-normal' width='12' height='3' clickFn={handleClose} />
          <Button
            text={t('save')}
            color='black'
            font='mont-14-normal'
            width='13'
            height='3'
            clickFn={() => handleSavePoll()}
          />
        </div>
      </div>
    </div>
  )
}

export default AddPoll
