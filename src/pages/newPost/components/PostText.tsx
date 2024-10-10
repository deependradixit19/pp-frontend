import { FC, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MentionsInput, Mention } from 'react-mentions'

import { debounce } from '../../../helpers/hooks'
import { getSearchedCreators } from '../../../services/endpoints/api_global'
import { IProfile } from '../../../types/interfaces/IProfile'
import { ITag } from '../../../types/interfaces/ITypes'

interface IEntry {
  id: string | number
  display: string
  name: string
  avatarUrl: string
  friends: boolean
  subscribed: boolean
}

// body:  "sadfasdf @Chomi @Stefan",
// tags: [{id: 11, start:9, end:14}, {id:12, start: 16, end:22}]

const PostText: FC<{
  body: string
  tags: ITag[]
  setText: (body: string, tags: ITag[]) => void
}> = ({ body, tags, setText }) => {
  const [localMentions, setLocalMentions] = useState<IEntry[]>([])
  const { t } = useTranslation()
  const getCreators = async (term: string, callback: any) => {
    const { data } = await getSearchedCreators(term)

    const transformedResponse = data.map((creator: IProfile) => {
      return {
        id: creator.id,
        // display: `${creator.first_name} ${creator.last_name}`,
        display: creator.display_name,
        name: `${creator.first_name} ${creator.last_name}`,
        avatarUrl: creator.avatar.url || creator.cropped_avatar.url,
        friends: creator.friends === 'Friends',
        subscribed: creator.isSubscribed
      }
    })
    setLocalMentions(transformedResponse)
    return callback(transformedResponse)
  }

  const debouncedSearch = useCallback(
    debounce((term: string, callback) => getCreators(term, callback), 1000),
    []
  )

  return (
    <MentionsInput
      className='newpost__body__text'
      style={{ suggestions: { top: '2rem' } }}
      value={body}
      onChange={(event: { target: { value: string } }, newValue, newPlainTextValue, mentions) => {
        const tmpTags = mentions.map(mention => {
          return {
            user_id: parseInt(mention.id),
            // @ts-ignore: Unreachable code error
            start: mention.plainTextIndex,
            // @ts-ignore: Unreachable code error
            end: mention.plainTextIndex + mention.display.length
          }
        })
        // setLocalBody(event.target.value);
        setText(event.target.value, tmpTags)
      }}
    >
      <Mention
        trigger='@'
        data={(search, callback) => {
          const data = debouncedSearch(search, callback)
          return data
        }}
        appendSpaceOnAdd
        markup='@{{__id__||__display__||__avatarUrl__}}'
        displayTransform={(id: any, display: any) => `@${display}`}
        renderSuggestion={(entry, search, highlightedDisplay, index, focused) => {
          return (
            <div className='newpost__body__text__mention'>
              <div className='newpost__body__text__mention__left'>
                <div className='newpost__body__text__mention__avatar'>
                  <img src={localMentions[index].avatarUrl} alt={t('avatar')} />
                </div>
                <div className='newpost__body__text__mention__content'>
                  <div className='newpost__body__text__mention__content__name'>
                    {/* {entry.display} */}
                    {localMentions[index].name}
                  </div>
                  <div className='newpost__body__text__mention__content__handle'>@{entry.display}</div>
                </div>
              </div>
              <div className='newpost__body__text__mention__right'>
                {localMentions[index].friends && (
                  <span className='newpost__body__text__mention__status newpost__body__text__mention__status--friends'>
                    {t('friends')}
                  </span>
                )}
                {localMentions[index].subscribed && (
                  <span className='newpost__body__text__mention__status newpost__body__text__mention__status--subscribed'>
                    {t('subscribed')}
                  </span>
                )}
              </div>
            </div>
          )
        }}
      />
    </MentionsInput>
  )
}

export default PostText
