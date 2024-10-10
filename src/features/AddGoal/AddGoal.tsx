import { FC, useRef, useState } from 'react'
import classNames from 'classnames'

import { useTranslation } from 'react-i18next'
import { IconPollBgImg } from '../../assets/svg/sprite'
import Button from '../../components/UI/Buttons/Button'
import { getImageOrientation } from '../../helpers/util'
import { useOrientation } from '../../helpers/helperHooks'
import BackgroundPicker, { GRADIENTS } from '../../components/UI/BackgroundPicker/BackgroundPicker'
import Sidebar from '../../components/UI/Sidebar/Sidebar'
import SidebarItem from '../../components/UI/Sidebar/SidebarItem'
import './_addGoal.scss'
import { IGoal } from '../../types/interfaces/ITypes'
import Goal from '../../components/UI/Goal/Goal'

interface Props {
  handleClose: () => void
  handleSetGoalData: (data: IGoal) => void
  noControls?: boolean
}

const AddGoal: FC<Props> = ({ handleClose, handleSetGoalData, noControls }) => {
  const [goalTitle, setGoalTitle] = useState('')
  const [goalAmount, setGoalAmount] = useState<string>('')
  const [bgColor, setBgColor] = useState(GRADIENTS[0])
  const [bgImg, setBgImg] = useState<string | null>(null)
  const [bgImgFile, setBgImgFile] = useState<File | null>(null)
  const [bgImgOrientation, setBgImgOrientation] = useState<string>('')

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

  const validateGoal = (title: string, amount: number, cb: () => void) => {
    if (!title || !title.trim().length || !amount) {
      if ((title || title.trim().length) && isNaN(amount)) {
        setValidationError('You must enter a valid amount')
      } else if (amount === 0) {
        setValidationError('You must enter a valid amount')
      } else {
        setValidationError(t('validation:allFieldsAreRequired'))
      }
      setTimeout(() => {
        setValidationError('')
      }, 5000)
    } else {
      cb()
    }
  }

  if (!deviceOrientation) return null

  return (
    <div
      className={classNames('addGoal', {
        'addGoal--withBgImg': bgImg,
        'device-portrait': deviceOrientation.type.includes('portrait'),
        'device-landscape': deviceOrientation.type.includes('landscape'),
        'img-portrait': bgImgOrientation === 'portrait',
        'img-landscape': bgImgOrientation === 'landscape'
      })}
      style={{ backgroundImage: bgImg ? `url(${bgImg})` : bgColor }}
    >
      <div className='addGoal__wrapper'>
        <div className='addGoal__header'>
          <div className='addGoal__header__title'>{t('addGoal')}</div>
          {/* <div className="add__header__close" onClick={() => handleClose()}>
            <IconStatsClose />
          </div> */}
        </div>
        {!noControls && (
          <Sidebar>
            <SidebarItem icon={<IconPollBgImg />} text={t('upload')} onClick={() => pollImgRef.current!.click()}>
              <input
                ref={pollImgRef}
                type='file'
                onChange={e => {
                  setBgColor(GRADIENTS[0])
                  handleImgUpload(e)
                }}
                multiple={true}
                id='poll__img__upload'
                accept='image/*'
                hidden={true}
                key={Math.random().toString(36)}
              />
            </SidebarItem>
            <BackgroundPicker
              background={bgColor}
              setBackground={(color: string) => {
                setBgImg(null)
                setBgImgFile(null)
                setBgColor(color)
              }}
            />
          </Sidebar>
        )}
        <div className='addPoll__content'>
          <Goal
            title={goalTitle}
            amount={goalAmount}
            validationError={validationError}
            handleTitleChange={(value: string) => setGoalTitle(value)}
            handleAmountChange={(value: string) => setGoalAmount(value)}
          />
        </div>
        <div className='addPoll__footer'>
          <Button text={t('cancel')} color='white' font='mont-14-normal' width='12' height='3' clickFn={handleClose} />
          <Button
            text={t('save')}
            color='black'
            font='mont-14-normal'
            width='13'
            height='3'
            clickFn={() => {
              validateGoal(goalTitle, parseFloat(goalAmount), () =>
                handleSetGoalData({
                  title: goalTitle,
                  amount: goalAmount,
                  goalBg: bgImg ? bgImg : bgColor,
                  goalBgImg: bgImgFile
                })
              )
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default AddGoal
