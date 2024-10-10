import { FC } from 'react'

import 'swiper/css'
// import Swiper core and required modules
import SwiperCore from 'swiper'
import { Pagination } from 'swiper/modules';
import 'swiper/modules/pagination/pagination.scss';
import { Swiper, SwiperSlide } from 'swiper/react'

import { IProfile } from '../../../types/interfaces/IProfile'
import { IPost } from '../../../types/interfaces/ITypes'

import Post from './Post'

// install Swiper modules
SwiperCore.use([Pagination])

const PostsSlider: FC<{
  allPosts?: Array<IPost> | null
  user?: IProfile | null
  selectedPost?: number
  selectedItem?: number
  refetchData?: () => void
  toggleComments?: boolean
}> = ({ allPosts, user, selectedPost, selectedItem, refetchData, toggleComments }) => {
  return (
    <Swiper
      className='mySwiper swiper-v'
      spaceBetween={50}
      direction={'vertical'}
      pagination={{
        clickable: true
      }}
    >
      {allPosts?.map((post: any, ind: number) => (
        <SwiperSlide key={ind}>
          <div className='preview__block'>
            {/* {console.log('from swiper')} */}
            <Post
              files={[...post.photos, ...post.videos].sort((a, b) => a.order - b.order)}
              selectedItem={selectedItem}
              user={user}
              postData={post}
              refetchData={() => refetchData && refetchData()}
            />
          </div>
        </SwiperSlide>
      ))}
      {/* <SwiperSlide>Single Post 1</SwiperSlide>
      <SwiperSlide>
        <Swiper
          className="mySwiper2 swiper-h"
          spaceBetween={50}
          pagination={{
            clickable: true,
          }}
        >
          <SwiperSlide>Vertical Slide 1</SwiperSlide>
          <SwiperSlide>Vertical Slide 2</SwiperSlide>
          <SwiperSlide>Vertical Slide 3</SwiperSlide>
          <SwiperSlide>Vertical Slide 4</SwiperSlide>
          <SwiperSlide>Vertical Slide 5</SwiperSlide>
        </Swiper>
      </SwiperSlide>
      <SwiperSlide>Horizontal Slide 3</SwiperSlide>
      <SwiperSlide>Horizontal Slide 4</SwiperSlide> */}
    </Swiper>
  )
}

export default PostsSlider

// <Carousel
//   className=""
//   axis="vertical"
//   autoPlay={true}
//   interval={600000}
//   showArrows={false}
//   showIndicators={false}
//   infiniteLoop={false}
//   showThumbs={false}
//   showStatus={false}
//   swipeScrollTolerance={40}
//   selectedItem={selectedPost}
//   preventMovementUntilSwipeScrollTolerance={true}
// >
//   {allPosts?.map((post: any, ind: number) => (
//     <div className="preview__block" key={ind}>
//       <Post
//         files={[...post.photos, ...post.videos].sort(
//           (a, b) => a.order - b.order
//         )}
//         selectedItem={selectedItem}
//         user={user}
//         postData={post}
//         refetchData={() => refetchData && refetchData()}
//       />
//     </div>
//   ))}
// </Carousel>
