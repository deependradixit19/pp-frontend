import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Icons } from '../../../helpers/newPostIcons'

const PostTypes: FC<{
  pageType: string
  setPageType: (val: string) => void
}> = ({ pageType, setPageType }) => {
  const { t } = useTranslation()
  return (
    <div className='newpost__body__types'>
      <div className='newpost__type' onClick={() => setPageType('post')}>
        <div className={`newpost__type__img ${pageType === 'post' ? 'newpost__type__img--active' : ''}`}>
          <img src={Icons.addpost} alt={t('newPost')} />
        </div>
        {t('post')}
      </div>
      <div className='newpost__type'>
        <div
          className={`newpost__type__img ${pageType === 'message' ? 'newpost__type__img--active' : ''}`}
          onClick={() => setPageType('message')}
        >
          <img src={Icons.addmessage} alt={t('newMessage')} />
        </div>
        {t('message')}
      </div>
      <div className='newpost__type'>
        <div
          className={`newpost__type__img ${pageType === 'story' ? 'newpost__type__img--active' : ''}`}
          onClick={() => setPageType('story')}
        >
          <img src={Icons.addstory} alt={t('newStory')} />
        </div>
        {t('story')}
      </div>
    </div>
  )
}

export default PostTypes
