import { FC, useMemo } from 'react'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'

import { getAccessToken } from '../../services/storage/storage'
import { getAllStories } from '../../services/endpoints/story'
import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import WithHeaderSection from '../../layouts/WithHeaderSection/WithHeaderSection'
import HomeFeed from '../../features/HomeFeed/HomeFeed'
import StoriesList, { IStoriesListElement } from '../../features/StoriesList/StoriesList'
import Auth from '../auth/Auth'

import './_feed.scss'
import { useUserContext } from '../../context/userContext'
import SuggestedList from '../../features/SuggestedList/SuggestedList'
import DesktopAdditionalContent from '../../features/DesktopAdditionalContent/DesktopAdditionalContent'

const Feed: FC = () => {
  const { t } = useTranslation()
  const userData = useUserContext()

  const { data: usersWithStories } = useQuery(['allStoryPosts'], () => getAllStories())

  const reorderedStories = useMemo(() => reorderStories(), [usersWithStories])

  function reorderStories(): IStoriesListElement[] {
    let tempStories: IStoriesListElement[] = []
    let tempUnseenStories: IStoriesListElement[] = []

    if (usersWithStories && usersWithStories.length) {
      usersWithStories.map((user: IStoriesListElement) => {
        if (user.all_stories_seen) {
          tempUnseenStories.push(user)
        } else {
          tempStories.push(user)
        }
      })
    }
    return [...tempStories, ...tempUnseenStories]
  }

  const renderFeedPage = () => {
    if (getAccessToken()) {
      return Boolean(
        (usersWithStories && usersWithStories.length !== 0) || (userData.stories && userData.stories.length !== 0)
      ) ? (
        <WithHeaderSection
          customClass='home'
          headerSection={
            reorderedStories && <StoriesList page='feed' customClass='home__stories' stories={reorderedStories} />
          }
        >
          <HomeFeed />
        </WithHeaderSection>
      ) : (
        <>
          <HomeFeed />
          <DesktopAdditionalContent>
            <SuggestedList />
          </DesktopAdditionalContent>
        </>
      )
    } else {
      return <Auth />
    }
  }

  return (
    <BasicLayout
      title={userData.role === 'model' ? t('following') : t('home')}
      hideFooter={!getAccessToken()}
      hideBackButton={true}
      customClass='home'
    >
      {renderFeedPage()}
    </BasicLayout>
  )
}

export default Feed
