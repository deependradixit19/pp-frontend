import { FC } from 'react'

import TutorialCard from '../components/TutorialCard'

import bg1 from '../../../assets/images/home/bg1.png'
import bg2 from '../../../assets/images/home/bg2.png'

const Tutorials: FC = () => {
  return (
    <>
      <TutorialCard
        img={bg1}
        title='Content Creation and Editing  ries'
        text='Discover the secrets of photography and video to find success on Performer'
        hasVideo={true}
      />
      <TutorialCard
        img={bg2}
        title='Professional Photography for Performer'
        text='Learn tricks to take and edit photographs for social media on your phone'
      />
    </>
  )
}

export default Tutorials
