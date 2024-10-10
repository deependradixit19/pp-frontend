import { FC, useState, useRef, useEffect } from 'react'
import ReactPlayer from 'react-player'

import { useMutation } from 'react-query'

import EmojiPicker from 'emoji-picker-react'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
// import Swiper core and required modules
import SwiperCore from 'swiper'
import { Pagination } from 'swiper/modules';
import 'swiper/modules/pagination/pagination.scss';

import bg1 from '../../../assets/images/home/bg1.png'
import { AllIcons } from '../../../helpers/allIcons'
import axiosInstance from '../../../services/http/axiosInstance'
import AvatarHolder from '../../../components/UI/AvatarHolder/AvatarHolder'

// install Swiper modules
SwiperCore.use([Pagination])

const Post: FC<{
  files: Array<{
    caption?: string | null
    created_at: string
    id: number
    order: number
    url: string
    thumbnail_src?: null | string
  }>
  selectedItem?: number
  user: any
  postData: any
  refetchData: any
}> = ({ files, selectedItem, user, postData, refetchData }) => {
  const [videoPlaying, setVideoPlaying] = useState<boolean>(false)
  const [tagsActive, setTagsActive] = useState<boolean>(false)
  const [commentsActive, setCommentsActive] = useState<boolean>(false)
  const [newComment, setNewComment] = useState<string>('')
  const [toggleEmojiPicker, setToggleEmojiPicker] = useState<boolean>(false)

  const [like, setLike] = useState<{
    status: boolean
    count: number
  }>({
    status: false,
    count: 0
  })

  const tagsRef = useRef<HTMLDivElement>(null)

  const likePost = useMutation(
    async () => {
      await axiosInstance({
        method: 'post',
        url: `/api/like/post/${postData.id}`
      })
    },
    {
      onMutate: () => {
        setLike({
          status: !like.status,
          count: like.status ? like.count - 1 : like.count + 1
        })
      },
      onSettled: () => {
        refetchData()
      }
    }
  )

  useEffect(() => {
    if (postData) {
      setLike({
        status: postData.isLiked,
        count: postData.likes_count
      })
    }
    //eslint-disable-next-line
  }, [])

  const onEmojiClick = (emojiObject: { emoji: string }) => {
    setNewComment(`${newComment}${emojiObject.emoji}`)
  }

  return (
    <div className='preview__post'>
      <div className='preview__user'>
        <div
          className='preview__user__info'
          onClick={() => {
            setTagsActive(!tagsActive)
          }}
        >
          <img
            className={`preview__user__chevron ${tagsActive ? 'preview__user__chevron--active' : ''}`}
            src={AllIcons.preview_chevrondown}
            alt='Toggle tags block'
          />
          <p>@{user.display_name}</p>
        </div>
        <div
          ref={tagsRef}
          className='preview__user__tags'
          style={{
            height: tagsActive ? `calc(${tagsRef.current?.scrollHeight}px + 1rem)` : ''
          }}
        >
          <span>#tag1</span> <span>#tag1</span> <span>#tag1</span>
          <span>#tag1</span> <span>#tag1</span> <span>#tag1</span>
          <span>#tag1</span> <span>#tag1</span> <span>#tag1</span>
        </div>
      </div>

      <div className='preview__actions'>
        <AvatarHolder
          img={user.cropped_avatar.url || user.avatar.url || bg1}
          size='50'
          hasStory={true}
          customClass='preview__actions__avatar'
        />
        <div
          className='preview__actions__item'
          onClick={() => {
            likePost.mutate()
          }}
        >
          <img src={AllIcons.preview_heart} alt='Like' />
          <p>{like.count}</p>
        </div>
        <div
          className='preview__actions__item'
          onClick={() => {
            setCommentsActive(!commentsActive)
          }}
        >
          <img src={AllIcons.preview_chat} alt='Comments' />
          <p>2K</p>
        </div>
      </div>

      <div className={`preview__comments${commentsActive ? ' preview__comments--active' : ''}`}>
        <div className='preview__comments__title' onClick={() => setCommentsActive(false)}>
          <p onClick={(e: any) => e.stopPropagation()}>300 comments</p>
          <img
            // onClick={() => setCommentsActive(false)}
            src={AllIcons.preview_close}
            alt='Close comments'
          />
        </div>
        <div className='preview__comments__add'>
          <div className='preview__comments__input'>
            <input
              type='text'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNewComment(e.currentTarget.value)
              }}
              value={newComment}
              placeholder='New Comment...'
            />
            <div className='preview__comments__input__emoji' onClick={() => setToggleEmojiPicker(!toggleEmojiPicker)}>
              <img src={AllIcons.smile} alt='Emojis' />
            </div>
            {toggleEmojiPicker ? (
              <div className='emojiPicker'>
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            ) : (
              ''
            )}
          </div>
          <div className='preview__comments__send' onClick={() => console.log(newComment)}>
            <img src={AllIcons.button_send} alt='Send message' />
          </div>
        </div>
        {/* <div className="preview__comments__container">
          <CommentBlock
            data={{
              comment: 'Ovo je moj prvi normalan komentar :D.',
              user_id: 31,
              entity_id: 5,
              entity_type: 'App\\Models\\Post',
              updated_at: '2021-10-20T08:31:49.000000Z',
              created_at: '2021-10-20T08:31:49.000000Z',
              id: 1,
              photos: [],
              videos: [],
              sounds: [],
            }}
            refetchComments={() => console.log('refetching')}
          />
          <CommentBlock
            data={{
              comment: 'Ovo je moj prvi normalan komentar :D.',
              user_id: 31,
              entity_id: 5,
              entity_type: 'App\\Models\\Post',
              updated_at: '2021-10-20T08:31:49.000000Z',
              created_at: '2021-10-20T08:31:49.000000Z',
              id: 1,
              photos: [],
              videos: [],
              sounds: [],
            }}
            refetchComments={() => console.log('refetching')}
          />
          <CommentBlock
            data={{
              comment: 'Ovo je moj prvi normalan komentar :D.',
              user_id: 31,
              entity_id: 5,
              entity_type: 'App\\Models\\Post',
              updated_at: '2021-10-20T08:31:49.000000Z',
              created_at: '2021-10-20T08:31:49.000000Z',
              id: 1,
              photos: [],
              videos: [],
              sounds: [],
            }}
            refetchComments={() => console.log('refetching')}
          />
        </div> */}
      </div>
      <Swiper
        className='mySwiper swiper-h'
        spaceBetween={50}
        pagination={{
          clickable: true
        }}
      >
        {files.map(
          (
            item: {
              created_at: string
              id: number
              order: number
              url: string
            },
            key: number
          ) => {
            if (item.url.includes('/images/originals')) {
              return (
                <SwiperSlide key={key}>
                  <div onClick={() => setCommentsActive(false)} className='preview__file'>
                    <img className='preview__background' src={item.url} alt='Background' />
                    <img className='preview__file__image' src={item.url} alt='Preview' />
                  </div>
                </SwiperSlide>
              )
            } else if (item.url.includes('/videos/originals')) {
              return (
                <SwiperSlide key={key}>
                  <div onClick={() => setCommentsActive(false)} className='preview__file'>
                    <img className='preview__background' src={bg1} alt='Video background' />
                    <div className='preview__videoctrl' onClick={() => setVideoPlaying(!videoPlaying)}>
                      {videoPlaying ? (
                        <img className='preview__videoctrl--playing' src={AllIcons.video_pause} alt='Pause' />
                      ) : (
                        <img src={AllIcons.video_play} alt='Play' />
                      )}
                    </div>
                    <ReactPlayer
                      className='preview__file__video'
                      width='100%'
                      height='100%'
                      url={item.url}
                      controls={true}
                      playing={videoPlaying}
                      onPlay={() => setVideoPlaying(true)}
                      onEnded={() => setVideoPlaying(false)}
                    />
                  </div>
                </SwiperSlide>
              )
            } else {
              return <div className='preview__video'>Whatever</div>
            }
          }
        )}
      </Swiper>

      {/* <Carousel
        axis="horizontal"
        autoPlay={false}
        interval={60000}
        showArrows={false}
        showIndicators={true}
        infiniteLoop={false}
        showThumbs={false}
        showStatus={false}
        swipeScrollTolerance={80}
        useKeyboardArrows={true}
        selectedItem={selectedItem}
        onChange={() => {
          setVideoPlaying(false);
        }}
        className="preview__carousel"
      >
        {files.map(
          (
            item: {
              created_at: string;
              id: number;
              order: number;
              url: string;
            },
            key: number
          ) => {
            if (item.url.includes('/images/originals')) {
              return (
                <div
                  onClick={() => setCommentsActive(false)}
                  className="preview__file"
                  key={key}
                >
                  <img
                    className="preview__background"
                    src={item.url}
                    alt="Background"
                  />
                  <img
                    className="preview__file__image"
                    src={item.url}
                    alt="Preview"
                  />
                </div>
              );
            } else if (item.url.includes('/videos/originals')) {
              return (
                <div
                  onClick={() => setCommentsActive(false)}
                  className="preview__file"
                  key={key}
                >
                  <img
                    className="preview__background"
                    src={bg1}
                    alt="Video background"
                  />
                  <div
                    className="preview__videoctrl"
                    onClick={() => setVideoPlaying(!videoPlaying)}
                  >
                    {videoPlaying ? (
                      <img
                        className="preview__videoctrl--playing"
                        src={AllIcons.video_pause}
                        alt="Pause"
                      />
                    ) : (
                      <img src={AllIcons.video_play} alt="Play" />
                    )}
                  </div>
                  <ReactPlayer
                    className="preview__file__video"
                    width="100%"
                    height="100%"
                    url={item.url}
                    controls={true}
                    playing={videoPlaying}
                    onPlay={() => setVideoPlaying(true)}
                    onEnded={() => setVideoPlaying(false)}
                  />
                </div>
              );
            } else {
              return <div className="preview__video">Whatever</div>;
            }
          }
        )}
      </Carousel> */}
    </div>
  )
}

export default Post
