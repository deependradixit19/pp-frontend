import { useState, useEffect } from 'react'

import { Keyboard, FreeMode, Mousewheel } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { SwiperClass } from 'swiper/react'

import 'swiper/css'
import './_inlineTimePicker.scss'

type TimeType = 'hour' | 'minute'
type TimeOfDay = 'AM' | 'PM'

export default function InlineTimePicker({ getSelectedTime }: { getSelectedTime: Function }): JSX.Element {
  const [hour, setHour] = useState<number>(0)
  const [minutes, setMinutes] = useState<number>(0)
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('AM')

  useEffect(() => {
    const modifier = timeOfDay === 'PM' ? 12 : 0
    getSelectedTime(hour + modifier, minutes)
  }, [hour, minutes, timeOfDay, getSelectedTime])

  const setTime = (type: TimeType, value: number) => {
    const maxValue = type === 'hour' ? 12 : 59
    let temp = value

    if (value < 0) {
      temp = maxValue
    }

    if (value > maxValue) {
      temp = 0
    }

    if (type === 'hour') {
      setHour(temp)
    } else {
      setMinutes(temp)
    }
  }

  const onSlideChangeHandler = (swiper: SwiperClass) => {
    setTime('hour', swiper.activeIndex - 3)
  }

  return (
    <div className='time-picker-container'>
      <div className='swiper-digit-container'>
        <Swiper
          modules={[Keyboard, FreeMode, Mousewheel]}
          mousewheel={true}
          direction={'vertical'}
          centeredSlides={true}
          slidesPerView={3}
          height={150}
          loop={true}
          initialSlide={hour}
          onSlideChange={onSlideChangeHandler}
        >
          {[...Array(13)].map((value, index) => (
            <SwiperSlide key={index}>{index}</SwiperSlide>
          ))}
        </Swiper>
      </div>
      <span className='colon'>:</span>
      <div className='swiper-digit-container'>
        <Swiper
          modules={[Keyboard, FreeMode, Mousewheel]}
          mousewheel={true}
          direction={'vertical'}
          centeredSlides={true}
          slidesPerView={3}
          height={150}
          loop={true}
          initialSlide={minutes}
          onSlideChange={(swiper: SwiperClass) => setTime('minute', swiper.activeIndex - 3)}
        >
          {[...Array(60)].map((value, index) => (
            <SwiperSlide key={index}>{index.toString().length === 1 ? `0${index}` : index}</SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className='time-of-day-container'>
        <button className={`time-of-day-button ${timeOfDay === 'AM' && 'active'}`} onClick={() => setTimeOfDay('AM')}>
          AM
        </button>
        <button className={`time-of-day-button ${timeOfDay === 'PM' && 'active'}`} onClick={() => setTimeOfDay('PM')}>
          PM
        </button>
      </div>
    </div>
  )
}
