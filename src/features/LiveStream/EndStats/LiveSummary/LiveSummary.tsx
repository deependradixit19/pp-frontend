import { FC, useState } from 'react'
import './_liveSummary.scss'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import { useTranslation } from 'react-i18next'
import one from '../../../../assets/images/faces/1.jpg'
import two from '../../../../assets/images/faces/2.jpg'
import three from '../../../../assets/images/faces/3.jpg'
import four from '../../../../assets/images/faces/4.jpg'
import five from '../../../../assets/images/faces/5.jpg'
import six from '../../../../assets/images/faces/6.jpg'
import seven from '../../../../assets/images/faces/7.jpg'
import eight from '../../../../assets/images/faces/8.jpeg'
import nine from '../../../../assets/images/faces/9.jpg'
import SwitchButton from '../../../../components/Common/SwitchButton/SwitchButton'

const LiveSummary: FC = () => {
  const [shareToFeed, setShareToFeed] = useState(true)

  const { t } = useTranslation()
  const tmpViewers = [
    {
      avatarUrl: one,
      name: 'Milan Stanojevic 1',
      handle: '@chomi 1',
      tipped: '$250'
    },
    {
      avatarUrl: two,
      name: 'Milan Stanojevic 2',
      handle: '@chomi 2',
      tipped: '$50'
    },
    {
      avatarUrl: three,
      name: 'Milan Stanojevic 3',
      handle: '@chomi 3',
      tipped: '$35'
    },
    {
      avatarUrl: four,
      name: 'Milan Stanojevic 4',
      handle: '@chomi 4',
      tipped: '$225'
    },
    {
      avatarUrl: five,
      name: 'Milan Stanojevic 5',
      handle: '@chomi 5',
      tipped: '$75'
    },
    {
      avatarUrl: six,
      name: 'Milan Stanojevic 6',
      handle: '@chomi 6',
      tipped: '$25'
    },
    {
      avatarUrl: seven,
      name: 'Milan Stanojevic 7',
      handle: '@chomi 7',
      tipped: '$125'
    },
    {
      avatarUrl: eight,
      name: 'Milan Stanojevic 7',
      handle: '@chomi 8',
      tipped: '$125'
    },
    {
      avatarUrl: nine,
      name: 'Milan Stanojevic 7',
      handle: '@chomi 9',
      tipped: '$125'
    }
  ]

  return (
    <div className='summary'>
      <div className='summary__viewers'>
        <div className='summary__viewers--value'>890</div>
        <div className='summary__viewers--title'>{t('viewers')}</div>
      </div>
      <div className='summary__tips'>
        <div className='summary__tips--value'>
          <span>$</span>1450
        </div>
        <div className='summary__tips--title'>{t('totalTips')}</div>
      </div>
      <div className='summary__slider'>
        <Swiper
          className='streamSummarySwiper'
          spaceBetween={5}
          slidesPerView={'auto'}
          centeredSlides={true}
          loop={true}
          loopedSlides={tmpViewers.length}
          onSlideChangeTransitionStart={(el: any) => {
            const activeElement = el.slides[el.activeIndex]
            el.slides.forEach((slide: any) => {
              if (slide.classList.contains('slide__outer--1')) {
                slide.classList.remove('slide__outer--1')
              }
              if (slide.classList.contains('slide__outer--2')) {
                slide.classList.remove('slide__outer--2')
              }
            })
            activeElement.previousElementSibling?.previousElementSibling?.classList.add('slide__outer--1')
            activeElement.nextElementSibling?.nextElementSibling?.classList.add('slide__outer--1')
            activeElement.previousElementSibling?.previousElementSibling?.previousElementSibling?.classList.add(
              'slide__outer--2'
            )
            activeElement.nextElementSibling?.nextElementSibling?.nextElementSibling?.classList.add('slide__outer--2')
            activeElement.previousElementSibling?.previousElementSibling?.previousElementSibling?.previousElementSibling?.classList.add(
              'slide__outer--2'
            )
            activeElement.nextElementSibling?.nextElementSibling?.nextElementSibling?.nextElementSibling?.classList.add(
              'slide__outer--2'
            )
          }}
        >
          {tmpViewers.map((viewer, idx) => {
            return (
              <SwiperSlide key={viewer.handle}>
                <img src={viewer.avatarUrl} alt='' />
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
      <div className='summary__share'>
        <div className='summary__share--wrapper'>
          <div className='summary__share--text'>{t('shareStreamToFeed')}</div>
          <SwitchButton active={shareToFeed} toggle={() => setShareToFeed(shareToFeed => !shareToFeed)} />
        </div>
      </div>
    </div>
  )
}

export default LiveSummary
