import { useCallback, VFC } from 'react'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'

import { useTranslation } from 'react-i18next'
import Button from '../../../components/UI/Buttons/Button'
import * as SvgIcons from '../../../assets/svg/sprite'
import { addToast } from '../../../components/Common/Toast/Toast'
import { NewStory as Story } from '../../../types/types'
import { editStory, uploadStory } from '../../../services/endpoints/story'
import { useUserContext } from '../../../context/userContext'
import { getBannedWords, putBannedWord } from '../../../services/endpoints/api_global'

export type ClickActionType = 'share' | 'edit'

type StoryParams = {
  id: string
}

type ShareStoryProps = {
  story: Story
  clickAction?: ClickActionType
}

const ShareStory: VFC<ShareStoryProps> = ({ story, clickAction = 'share' }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { id } = useParams<StoryParams>()
  const userData = useUserContext()
  const { data: bannedWordsData, isLoading: isLoadingBannedWords } = useQuery('banned-words', getBannedWords)

  const onShareStory = useCallback(async () => {
    if (userData.status === 'restricted') {
      addToast('error', t('storyRestrictedAcc'))
      return
    }
    if (story.text && story.text.value !== '') {
      let usedBannedWords = []
      if (!isLoadingBannedWords && bannedWordsData?.data?.length > 0) {
        for (let i = 0; i < bannedWordsData.data.length; i++) {
          if (story.text.value.trim().toLowerCase().includes(bannedWordsData.data[i].word.toLowerCase())) {
            usedBannedWords.push(bannedWordsData.data[i].word)
            putBannedWord({ id: bannedWordsData.data[i].id, type: 'stories' })
          }
        }
      }
      if (usedBannedWords.length > 0) {
        usedBannedWords.forEach((word: string) => addToast('error', `${t('storyContainsBannedWord')} - ${word}`))
        return
      }
    }
    await uploadStory(story)
    addToast('success', t('storyCreatedSuccessfully'))
    navigate('/')
  }, [story, navigate])

  const onEditStory = useCallback(async () => {
    await editStory(story, parseInt(id ?? ''))
    addToast('success', t('storyCreatedSuccessfully'))
    navigate(-1)
  }, [story, navigate])

  const handleShareClick = () => {
    if (clickAction === 'share') {
      onShareStory()
    } else {
      onEditStory()
    }
  }

  return (
    <Button
      text={t('share')}
      color='blue'
      padding='5'
      width='fit'
      height='5'
      font='mont-14-normal'
      prevIcon={<SvgIcons.IconPlusInCircleDashed />}
      clickFn={handleShareClick}
    />
  )
}
export default ShareStory
