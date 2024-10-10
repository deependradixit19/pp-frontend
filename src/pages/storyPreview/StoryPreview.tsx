import { useEffect, useState, useRef, FC } from 'react'
import { useQuery } from 'react-query'
import { useNavigate, useLocation } from 'react-router-dom'

// Services
import { useUserContext } from '../../context/userContext'
import { getAllStories } from '../../services/endpoints/story'
import { IProgress } from '../../features/Post/components/PostStory/PostStory'
import { usePreviousState, useStorySeen } from '../../helpers/hooks'
import { StoryActionType, Story as IStory, StoryPost } from '../../types/types'

// Components
import StoryFullscreen from './components/StoryFullscreen/StoryFullscreen'
import { IPost } from '../../types/interfaces/ITypes'
import { answerPoll } from '../../services/endpoints/posts'
import { integrateStoryAnswer } from './helpers'

interface StoryPreviewProps {
  postData?: IPost
  activeStory?: number | null
  isInViewport?: boolean
}

const StoryPreview: FC<StoryPreviewProps> = ({ postData, activeStory, isInViewport = true }) => {
  const [storyInteraction, setStoryInteraction] = useState<StoryActionType>(null)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const previousIsPaused = usePreviousState(isPaused)

  const [storyPosts, setStoryPosts] = useState<StoryPost[]>([])
  const [activePostIndex, setActivePostIndex] = useState<number>(0)
  const [activeStoryIndex, setActiveStoryIndex] = useState<number>(0)
  const [progressLists, setProgressLists] = useState<IProgress[][]>([[]])

  // timerState
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [startTimeout, setStartTimeout] = useState<Date>(new Date()) /* When the timer starts */
  const [timeLeft, setTimeLeft] = useState<number>(0) /* How much time is left */
  const [timeDelay, setTimeDelay] = useState<number>(7000) /* How long the timer should be */

  const { data: posts, error: errorPost } = useQuery(['allStoryPosts'], () => getAllStories(), { enabled: !postData })
  const navigate = useNavigate()
  const location = useLocation()
  const { storySeenMutation } = useStorySeen()

  const profileData = useUserContext()

  const fromFeed = activeStory !== undefined && activeStory !== null

  useEffect(() => {
    if (postData) {
      initForSinglePost()
    } else {
      stateInitialization()
    }
  }, [posts, postData, activeStory])

  useEffect(() => {
    if (!!storyPosts.length) {
      setActiveStoryIndex(findFirstUnseenStory(storyPosts[activePostIndex]))
    }
  }, [storyPosts])

  // Timer effects
  useEffect(() => {
    if (progressLists && progressLists.length && progressLists[0].length) {
      setTimeDelay(progressLists[activePostIndex][activeStoryIndex].duration * 1000)
      startTimer()
    }
  }, [progressLists])

  useEffect(() => {
    if (storyPosts && storyPosts.length) {
      timerRef.current = null
      startTimer()
    }

    return () => {
      if (timerRef.current === null) return
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [activeStoryIndex])

  useEffect(() => {
    if (previousIsPaused) {
      storyInteraction === 'longPress' && resumeTimeout()
    } else {
      pauseTimeout()
    }

    return () => {
      if (timerRef.current === null) return
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [isPaused])
  // =====================================

  const handleStorySeen = (id: number) => {
    storySeenMutation.mutate({ storyId: id })
  }

  // const convertStoriesList = (stories: IStoryResponse[]): Story[] => {
  //   const newStories = stories.map((story) => {
  //     return {
  //       ...story,
  //       liked,
  //       duration,
  //       statistics,
  //     };
  //   });

  //   return newStories;
  // };

  const initForSinglePost = () => {
    if (postData) {
      let tempStoryPosts: StoryPost[] = []
      let tempSeenStoryPosts: StoryPost[] = []

      let tempProgressList: IProgress[][] = []
      let tempSeenPogressList: IProgress[][] = []

      if (postData.all_stories_seen) {
        tempSeenStoryPosts.push({
          all_stories_seen: postData.all_stories_seen,
          tips_sum: postData.tips_sum,
          stories_created_at: postData.stories_created_at,
          stories: postData.stories,
          user: postData.user,
          user_id: postData.user_id
        })
        tempSeenPogressList.push([...convertStoriesInProgressList(postData.stories)])
      } else {
        tempStoryPosts.push(postData)
        tempProgressList.push([...convertStoriesInProgressList(postData.stories)])
      }
      setStoryPosts([...tempStoryPosts, ...tempSeenStoryPosts])
      setProgressLists([...tempProgressList, ...tempSeenPogressList])
    }
  }

  const stateInitialization = () => {
    const urlSplit: string[] = location.pathname.split('/')
    const postId: number = urlSplit.length > 3 ? parseInt(urlSplit[3]) : 0

    if (posts && posts.length) {
      let tempStoryPosts: StoryPost[] = []
      let tempSeenStoryPosts: StoryPost[] = []

      let tempProgressList: IProgress[][] = []
      let tempSeenPogressList: IProgress[][] = []

      posts.forEach((post: StoryPost) => {
        if (post.all_stories_seen) {
          tempSeenStoryPosts.push(post)
          tempSeenPogressList.push([...convertStoriesInProgressList(post.stories)])
        } else {
          tempStoryPosts.push(post)
          tempProgressList.push([...convertStoriesInProgressList(post.stories)])
        }
      })

      setStoryPosts([...tempStoryPosts, ...tempSeenStoryPosts])
      setProgressLists([...tempProgressList, ...tempSeenPogressList])
    }

    if (profileData.stories && profileData.stories.length > 0) {
      const tipsSum = profileData.stories.reduce((previousValue: IStory, currentValue: IStory) => {
        if (previousValue.statistics && currentValue.statistics) {
          return previousValue.statistics?.tipped + currentValue.statistics?.tipped
        } else {
          return 0
        }
      }, 0)

      const ownStoryPost: StoryPost = {
        all_stories_seen: false,
        tips_sum: tipsSum,
        stories_created_at: new Date().toDateString(),
        stories: profileData.stories,
        user: profileData,
        user_id: profileData.id
      }

      setStoryPosts((prevValue: StoryPost[]) => [ownStoryPost, ...prevValue])
      setProgressLists((prevValue: IProgress[][]) => [
        [...convertStoriesInProgressList(ownStoryPost.stories)],
        ...prevValue
      ])
    }

    if (postId) {
      setActivePostIndex(postId)
    }
  }

  function startTimer() {
    if (timerRef.current !== null) return
    setStartTimeout(new Date())
    timerRef.current = setTimeout(() => onForward(storyPosts[activePostIndex]), timeDelay)
  }

  function pauseTimeout() {
    setTimeLeft(timeDelay)
    setTimeLeft(prevValue => prevValue - (new Date().getTime() - startTimeout.getTime()))

    if (timerRef.current === null) return
    clearTimeout(timerRef.current)
    timerRef.current = null
  }

  function resumeTimeout() {
    if (!timeLeft) setTimeLeft(timeDelay)

    timerRef.current = setTimeout(() => onForward(storyPosts[activePostIndex]), timeLeft)
  }

  const findFirstUnseenStory = (storyPost: StoryPost) => {
    const stories = storyPost.stories
    let firstUnseenStoryIndes = 0

    for (let index = 0; index < stories.length; index++) {
      const story = stories[index]

      if (!story.seen) {
        firstUnseenStoryIndes = index
        break
      }
    }

    return firstUnseenStoryIndes
  }

  const onBack = () => {
    if (activeStoryIndex === 0) {
      if (activePostIndex === 0) {
        !fromFeed && navigate(-1)
        return
      }
      setActiveStoryIndex(storyPosts[activePostIndex - 1].stories.length - 1)
      setActivePostIndex(prev => prev - 1)
    } else {
      setActiveStoryIndex(prev => prev - 1)
    }
  }

  const onForward = (post: StoryPost) => {
    if (post && activeStoryIndex === post.stories.length - 1) {
      if (activePostIndex === storyPosts.length - 1) {
        !fromFeed && navigate(-1)
        return
      }
      setActiveStoryIndex(0)
      setActivePostIndex(prev => prev + 1)
    } else {
      setActiveStoryIndex(prev => prev + 1)
    }
    if (!storyPosts[activePostIndex].stories[activeStoryIndex].seen) {
      handleStorySeen(storyPosts[activePostIndex].stories[activeStoryIndex].id)
    }
  }

  const onSwipeLeft = () => {
    if (activePostIndex === 0) {
      !fromFeed && navigate(-1)
      // navigate(-1);
    } else {
      setActiveStoryIndex(storyPosts[activePostIndex - 1].stories.length - 1)
      setActivePostIndex(prev => prev - 1)
    }
  }

  const onSwipeRight = (post: StoryPost) => {
    if (activePostIndex === storyPosts.length - 1) {
      !fromFeed && navigate(-1)
      // navigate(-1);
    } else {
      const firstUnseenStory = findFirstUnseenStory(post)
      if (firstUnseenStory) {
        setActiveStoryIndex(findFirstUnseenStory(post))
      } else {
        setActiveStoryIndex(0)
      }
      setActivePostIndex(prev => prev + 1)
    }
  }

  const convertStoriesInProgressList = (stories: IStory[]): IProgress[] => {
    const tmpProg = stories.map((story: IStory) => {
      return {
        id: story.id,
        duration: story.duration,
        seen: story.seen
      }
    })

    return tmpProg
  }

  const onAnswerPoll = async (params: {
    story: IStory
    pollId: number
    answer?: string | number | null
    answerId?: number
  }) => {
    setStoryPosts(prevArray => {
      const newArray = prevArray
      newArray[activePostIndex].stories[activeStoryIndex] = integrateStoryAnswer({
        story: params.story,
        answer: params.answer,
        answerId: params.answerId
      })

      return newArray
    })

    await answerPoll({
      pollId: params.pollId,
      answer: params.answer,
      answerId: params.answerId
    })
  }

  return (
    <>
      {storyPosts && !!storyPosts.length && (
        <StoryFullscreen
          story={storyPosts[activePostIndex].stories[activeStoryIndex]}
          user={storyPosts[activePostIndex].user}
          progressList={progressLists[activePostIndex]}
          activeStoryIndex={activeStoryIndex}
          withCloseButton={!fromFeed}
          isPaused={isPaused || !isInViewport}
          setIsPaused={setIsPaused}
          setAction={setStoryInteraction}
          onBack={() => onBack()}
          onForward={() => onForward(storyPosts[activePostIndex])}
          onSwipeLeft={() => onSwipeLeft()}
          onSwipeRight={() => onSwipeRight(storyPosts[activePostIndex])}
          onAnswerPoll={({ pollId, answer, answerId }) => {
            onAnswerPoll({
              story: storyPosts[activePostIndex].stories[activeStoryIndex],
              pollId,
              answer,
              answerId
            })
          }}
        />
      )}
    </>
  )
}

export default StoryPreview
