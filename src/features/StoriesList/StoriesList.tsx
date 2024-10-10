import { FC } from 'react'
import { Link, useParams } from 'react-router-dom'

import { useTranslation } from 'react-i18next'
import { useUserContext } from '../../context/userContext'
import { IProfile } from '../../types/interfaces/IProfile'
import { Story as IStory } from '../../types/types'
import Story from '../../components/UI/Story/Story'

import './_storiesList.scss'
export interface IStoriesListElement {
  stories_created_at: string
  all_stories_seen: boolean
  stories: IStory[]
  user: IProfile
}
interface StoriesListProps {
  stories: Array<IStoriesListElement> | null
  customClass?: string
  page: string
}

const StoriesList: FC<StoriesListProps> = ({ stories, customClass, page }) => {
  const userData = useUserContext()
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()

  const filteredStories = stories && id ? stories.filter(story => story.user.id === parseInt(id)) : []

  return (
    <div className={`storieslist__wrapper ${customClass ? customClass : ''}`}>
      <div className='storieslist'>
        <div className='storieslist__list'>
          {userData.role === 'model' && page === 'profile' && (
            <Link to={'/new/story'}>
              <div className='storieslist__add'>
                <Story text={t('addStory')} type='add' />
              </div>
            </Link>
          )}
          {userData.role === 'fan' &&
            filteredStories &&
            filteredStories.length > 0 &&
            filteredStories.map((story: IStoriesListElement, key: number) => (
              <Link to={userData.stories > 0 ? `/view/story/${key}` : `/view/story/${key + 1}`} key={key}>
                <Story
                  img={story.user.avatar.url}
                  text={story.user.username}
                  viewed={story.all_stories_seen}
                  type='story'
                />
              </Link>
            ))}
          {userData.role === 'model' && page === 'profile' && userData.stories && userData.stories.length > 0 && (
            <Link to={`/view/story`}>
              <Story img={userData.avatar.url} text='Your Story' viewed={false} type='story' />
            </Link>
          )}
          {page === 'feed' &&
            stories &&
            stories.length > 0 &&
            stories.map((story: IStoriesListElement, key: number) => (
              <Link to={userData.stories > 0 ? `/view/story/${key}` : `/view/story/${key + 1}`} key={key}>
                <Story
                  img={story.user.avatar.url}
                  text={story.user.username}
                  viewed={story.all_stories_seen}
                  type='story'
                />
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}

export default StoriesList
