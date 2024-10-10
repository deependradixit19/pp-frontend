import { FC, useEffect, useState, ChangeEvent, useContext } from 'react'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { Carousel } from '@giphy/react-components'
import styles from './_gif-popup.module.scss'
import poweredByImg from '../../assets/images/Poweredby_100px-White_VertText.png'
import { IconCloseLarge, IconSendOutline } from '../../assets/svg/sprite'

const GifPopup: FC<{ closeFn: () => void; onGifClick: (val: string) => void; customClass?: string }> = ({
  closeFn,
  onGifClick,
  customClass = ''
}) => {
  const [text, setText] = useState('')
  const [search, setSearch] = useState(' ')

  let timeout: any = null

  const key = process.env.REACT_APP_GIPHY_KEY || ''

  const gifFetch = new GiphyFetch(key)

  const fetchGifs = (offset: number) => gifFetch.search(search, { offset, limit: 10 })

  const getTrending = (offset: number) => gifFetch.trending({ offset, limit: 10 })

  useEffect(() => {
    clearTimeout(timeout)
    timeout = setTimeout(() => setSearch(text), 500)

    return () => clearTimeout(timeout)
  }, [text])

  return (
    <div className={`${styles.container} ${customClass}`}>
      <div className={styles.swiper_container}>
        <Carousel
          onGifClick={(gif: any) => onGifClick(gif)}
          gifHeight={115}
          gutter={10}
          borderRadius={20}
          fetchGifs={search.trim() === '' ? getTrending : fetchGifs}
          key={search}
          noResultsMessage={<div className={styles.no_results}>No Results</div>}
          noLink={true}
        />
      </div>
      <div className={styles.input_container}>
        <div className={styles.input_wrapper}>
          <div className={styles.input_button_wrapper}>
            <input
              type='text'
              placeholder='Search Giphy'
              value={text}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
              className={styles.input}
            />

            <div className={styles.giphy_close} onClick={closeFn}>
              <IconCloseLarge />
            </div>
          </div>
          <div className={styles.submit_button}>
            <IconSendOutline />
          </div>
        </div>
        <div className={styles.powered_by_logo}>
          <img src={poweredByImg} alt='Powered By Giphy' />
        </div>
      </div>
    </div>
  )
}

export default GifPopup
