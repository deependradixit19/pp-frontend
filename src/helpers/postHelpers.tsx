import { ReactNodeArray } from 'react'
import { Link } from 'react-router-dom'
import reactStringReplace from 'react-string-replace'
import { IPostTag } from '../types/interfaces/ITypes'

export const renderPostText = (text: string, tags: IPostTag[]) => {
  let modifiedText: string | React.ReactNode[] | undefined

  tags?.forEach((tag, idx) => {
    const tmp = `@{{${tag.user.id}||${tag.user.username}||__avatarUrl__}}`

    if (idx === 0) {
      modifiedText = reactStringReplace(text, tmp, (match, index) => {
        return (
          <Link key={tag.user.id} to={`/profile/${tag.user.id}/all`}>
            @{tag.user.username}
          </Link>
        )
      })
    } else {
      modifiedText = reactStringReplace(modifiedText, tmp, (match, index) => {
        return (
          <Link key={tag.user.id} to={`/profile/${tag.user.id}/all`}>
            @{tag.user.username}
          </Link>
        )
      })
    }
  })
  return modifiedText || text
}
