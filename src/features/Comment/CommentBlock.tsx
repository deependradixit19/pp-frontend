import { useState, useRef, forwardRef } from 'react'
import { useQuery } from 'react-query'
import { getCommentReplies } from '../../services/endpoints/posts'
import { IComment } from '../../types/interfaces/ITypes'

import Comment from './Comment'

interface ICommentEntity {
  entityId: number
  parentId: number
  owner?: string
}
interface Props {
  data: IComment
  refetchComments: () => void
  selectedEntity: ICommentEntity | null
  setIsCommentReply: (value: boolean) => void
  setSelectedEntity: (commentEntity: ICommentEntity | null) => void
  setInitialCommentLiked: (commentId: number) => void
  deleteComment: (commentId: number, parentId: number, isReply: boolean) => void
  isMyPost: boolean
  optionsActive: boolean
  setOptionsActive: (val: boolean) => void
}

const CommentBlock = forwardRef<HTMLInputElement, Props>(
  (
    {
      data,
      refetchComments,
      selectedEntity,
      setIsCommentReply,
      setSelectedEntity,
      setInitialCommentLiked,
      deleteComment,
      isMyPost,
      optionsActive,
      setOptionsActive
    },
    ref
  ) => {
    const [repliesToggled, setRepliesToggled] = useState<boolean>(false)

    const { data: repliesData } = useQuery(['repliesForComment', data.id], () => getCommentReplies(data.id), {
      refetchOnWindowFocus: false,
      enabled: repliesToggled
    })

    const replyRef = useRef<HTMLDivElement>(null)

    return (
      <>
        <Comment
          ref={ref}
          data={data}
          refetchComments={refetchComments}
          repliesToggled={repliesToggled}
          toggleReplies={() => setRepliesToggled(!repliesToggled)}
          isReply={false}
          commentSelected={selectedEntity?.entityId === data.id}
          selectedEntity={selectedEntity}
          setIsCommentReply={setIsCommentReply}
          setSelectedEntity={setSelectedEntity}
          setInitialCommentLiked={setInitialCommentLiked}
          deleteComment={() => deleteComment(data.id, data.entity_id, false)}
          isMyPost={isMyPost}
          optionsActive={optionsActive}
          setOptionsActive={setOptionsActive}
        />

        <div
          ref={replyRef}
          style={{
            height: repliesToggled ? `auto` : 0
          }}
          className={`comment__replies ${repliesToggled ? 'comment__replies--active' : ''}`}
        >
          {repliesData &&
            !!repliesData.data.length &&
            repliesData.data.map((reply: IComment, index: number) => (
              <div key={index}>
                <Comment
                  ref={ref}
                  data={reply}
                  refetchComments={refetchComments}
                  isReply={true}
                  commentSelected={selectedEntity?.entityId === reply.id}
                  selectedEntity={selectedEntity}
                  setIsCommentReply={setIsCommentReply}
                  setSelectedEntity={setSelectedEntity}
                  setInitialCommentLiked={setInitialCommentLiked}
                  deleteComment={() => deleteComment(reply.id, reply.entity_id, true)}
                  isMyPost={isMyPost}
                  optionsActive={optionsActive}
                  setOptionsActive={setOptionsActive}
                />
              </div>
            ))}
        </div>
      </>
    )
  }
)

export default CommentBlock
