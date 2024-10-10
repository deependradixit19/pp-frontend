import { useState, useEffect } from 'react'
import Calendar, { CalendarProps } from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

import { useUserContext } from '../../../context/userContext'
import { getDateTimeLocale } from '../../../lib/dayjs'

import './_inlineDatePicker.scss'

interface IExtendedCalendarProps extends CalendarProps {
  scheduledPosts?: { scheduled: Date; type: string }[]
}

interface ITileWithDots {
  date: Date
  dots: string[]
}

export default function InlineDatePicker(props: IExtendedCalendarProps): JSX.Element {
  const [tilesWithDots, setTilesWithDots] = useState<ITileWithDots[]>([])

  const userData = useUserContext()

  const convertScheduledPostsToTilesWithDots = () => {
    let tiles: ITileWithDots[] = []

    props.scheduledPosts?.forEach(post => {
      if (post.scheduled) {
        const newDate = post.scheduled
        newDate.setHours(0, 0, 0, 0)
        const existingTileIndex = tiles.findIndex(tile => tile.date.getTime() === newDate.getTime())

        if (existingTileIndex >= 0) {
          Boolean(tiles[existingTileIndex].dots.length <= 5 && !tiles[existingTileIndex].dots.includes(post.type)) &&
            tiles[existingTileIndex].dots.push(post.type)
        } else {
          tiles.push({
            date: newDate,
            dots: [post.type]
          })
        }
      }
    })
    setTilesWithDots(tiles)
  }

  useEffect(() => {
    convertScheduledPostsToTilesWithDots()
  }, [props.scheduledPosts])

  const tileContent = ({
    date,
    view
  }: {
    date: Date
    view: 'month' | 'year' | 'decade' | 'century'
  }): JSX.Element | null => {
    if (view === 'month') {
      const tileIndex = tilesWithDots.findIndex(tile => {
        date.setHours(0, 0, 0, 0)
        tile.date.setHours(0, 0, 0, 0)
        return tile.date.getTime() === date.getTime()
      })
      if (tileIndex >= 0) {
        return (
          <div className='dots-container'>
            {tilesWithDots[tileIndex].dots.map(type => (
              <span className={`dot ${type}`}></span>
            ))}
          </div>
        )
      }
    }
    return <div className='dots-container'></div>
  }

  return (
    <Calendar
      tileContent={tileContent}
      minDate={new Date()}
      locale={getDateTimeLocale(userData.language.code.toLowerCase())}
      {...props}
    />
  )
}
