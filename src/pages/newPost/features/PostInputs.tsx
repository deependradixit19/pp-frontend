import { FC } from 'react'

import { useTranslation } from 'react-i18next'
import { useModalContext } from '../../../context/modalContext'
import PriceModal from '../../../components/UI/Modal/Price/PriceModal'
import DateModal from '../../../components/UI/Modal/Date/DateModal'
import PostSchedule from './PostSchedule'
import * as SvgIcons from '../../../assets/svg/sprite'
import SvgIconButton from '../../../components/UI/Buttons/SvgIconButton'
import Button from '../../../components/UI/Buttons/Button'
import { useUserContext } from '../../../context/userContext'
import { addToast } from '../../../components/Common/Toast/Toast'

const PostInputs: FC<{
  isUploading: boolean | false
  price: number | null
  hasCategories: boolean
  setPrice: any
  scheduleDate: Date | null
  removeSchedule: any
  submitPost: () => void
  postReady: boolean
  updateDate: any
  shareOnTwitter: boolean
  addCategories: () => void
  toggleShareOnTwitter: () => void
}> = ({
  isUploading,
  price,
  hasCategories,
  setPrice,
  submitPost,
  postReady,
  updateDate,
  scheduleDate,
  removeSchedule,
  shareOnTwitter,
  addCategories,
  toggleShareOnTwitter
}) => {
  const modalData = useModalContext()
  const userData = useUserContext()
  const { t } = useTranslation()
  const togglePriceModal = () => {
    modalData.addModal(t('setPrice'), <PriceModal updatePrice={setPrice} />)
  }

  const toggleDateModal = () => {
    modalData.addModal(t('schedulePost'), <DateModal confirmFn={(val: Date) => updateDate(val)} />)
  }

  const removePrice = () => setPrice(null)

  return (
    <div className='newpost__body__input '>
      {price || scheduleDate ? (
        <PostSchedule
          price={price}
          removePrice={removePrice}
          scheduleDate={scheduleDate}
          removeSchedule={removeSchedule}
        />
      ) : (
        ''
      )}
      <div className='newpost__body__input--post'>
        <div className='newpost__input__buttons'>
          {scheduleDate ? (
            <SvgIconButton
              icon={<SvgIcons.IconCalendarActive />}
              desc={t('schedulePost')}
              clickFn={toggleDateModal}
              customClass='newpost__input__buttons__button'
            />
          ) : (
            <SvgIconButton
              icon={<SvgIcons.IconCalendarInactive />}
              desc={t('schedulePost')}
              clickFn={toggleDateModal}
              customClass='newpost__input__buttons__button'
            />
          )}
          {price ? (
            <SvgIconButton
              icon={<SvgIcons.IconDolarCircleActive />}
              desc={t('setPrice')}
              clickFn={togglePriceModal}
              customClass='newpost__input__buttons__button'
            />
          ) : (
            <SvgIconButton
              icon={<SvgIcons.IconDolarCircleInactive />}
              desc={t('setPrice')}
              clickFn={togglePriceModal}
              customClass='newpost__input__buttons__button'
            />
          )}
          <SvgIconButton
            icon={<SvgIcons.IconList color={hasCategories ? '#00B3FF' : '#AFAFAF'} />}
            desc={t('setPrice')}
            clickFn={() => addCategories()}
            customClass='newpost__input__buttons__button'
          />
        </div>
        <div className='newpost__input__special'>
          <SvgIconButton
            icon={<SvgIcons.IconTwitter color={shareOnTwitter && userData.twitter ? '#00B3FF' : undefined} />}
            desc={t('postOnTwitter')}
            clickFn={() => {
              if (userData.twitter) {
                toggleShareOnTwitter()
              } else {
                addToast('error', t('error:addYourTwitterAccountInAccountSettings'))
              }
            }}
            customClass='newpost__input__buttons__button'
          />
          <Button
            text={t('post')}
            color='blue'
            font='mont-16-semi-bold'
            height='5'
            width='fit'
            padding='3'
            customClass='submitPost__button'
            clickFn={() => submitPost()}
            disabled={!postReady || isUploading}
          />
          {/* <div
            className="newpost__input__special__post"
            onClick={() => submitPost()}
          >
            Post
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default PostInputs
