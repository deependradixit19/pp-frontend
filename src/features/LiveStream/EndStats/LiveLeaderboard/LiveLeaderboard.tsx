import { FC, useLayoutEffect, useState } from 'react'
import './_liveLeaderboard.scss'

import one from '../../../../assets/images/faces/ferrara.jpg'
import two from '../../../../assets/images/faces/rocco.jpg'
import three from '../../../../assets/images/faces/sinns.jpg'
import four from '../../../../assets/images/faces/4.jpg'
import five from '../../../../assets/images/faces/5.jpg'
import six from '../../../../assets/images/faces/6.jpg'
import seven from '../../../../assets/images/faces/7.jpg'
import eight from '../../../../assets/images/faces/8.jpeg'
import nine from '../../../../assets/images/faces/9.jpg'
import { Crown } from '../../../../assets/svg/sprite'
import ViewersList from '../../ViewersList/ViewersList'

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

const LiveLeaderboard: FC = () => {
  const [viewersListHeight, setViewersListHeight] = useState(0)
  useLayoutEffect(() => {
    const height = window.innerHeight - 524
    setViewersListHeight(height)
  }, [])
  return (
    <div className='leaderboard'>
      <div className='leaderboard__toprated'>
        <div className='leaderboard__toprated--item second'>
          <div className='tipper'>
            <div className='tipper__rating'>2</div>
            <div className='tipper__avatar'>
              <img src={two} alt='' />
            </div>
            <div className='tipper__handle'>@roccosiffredi</div>
            <div className='tipper__amount'>
              <span>$</span>140
            </div>
          </div>
        </div>
        <div className='leaderboard__toprated--item first'>
          <div className='tipper'>
            <div className='tipper__avatar'>
              <div className='tipper__avatar--crown'>
                <Crown />
              </div>
              <img src={one} alt='' />
            </div>
            <div className='tipper__handle'>@manuelferrara</div>
            <div className='tipper__amount'>
              <span>$</span>160
            </div>
          </div>
        </div>
        <div className='leaderboard__toprated--item third'>
          <div className='tipper'>
            <div className='tipper__rating'>3</div>
            <div className='tipper__avatar'>
              <img src={three} alt='' />
            </div>
            <div className='tipper__handle'>@johnnysinns</div>
            <div className='tipper__amount'>
              <span>$</span>150
            </div>
          </div>
        </div>
      </div>
      <div className='leaderboard__viewers' style={{ height: `${viewersListHeight}px` }}>
        <ViewersList viewers={tmpViewers} type='leaderboard' />
      </div>
    </div>
  )
}

export default LiveLeaderboard
