import { FC } from 'react'
import './_liveTopRated.scss'
import one from '../../../assets/images/faces/ferrara.jpg'
import two from '../../../assets/images/faces/rocco.jpg'
import three from '../../../assets/images/faces/sinns.jpg'
import { CrownTilted } from '../../../assets/svg/sprite'

const LiveTopRated: FC = () => {
  return (
    <div className='livetoprated'>
      <div className='livetoprated__tipper'>
        <div className='livetoprated__tipper--crown'>
          <CrownTilted color='#F6C334' />
        </div>
        <img src={one} alt='' />
      </div>
      <div className='livetoprated__tipper'>
        <div className='livetoprated__tipper--crown'>
          <CrownTilted color='#E1E1E1' />
        </div>
        <img src={two} alt='' />
      </div>
      <div className='livetoprated__tipper'>
        <div className='livetoprated__tipper--crown'>
          <CrownTilted color='#E09427' />
        </div>
        <img src={three} alt='' />
      </div>
    </div>
  )
}

export default LiveTopRated
