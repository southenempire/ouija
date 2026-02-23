import { LoadCircle } from '@/components/common/load-circle'
import { CommentItem } from '@/components/profile/comments/comment-items'
import { IComments } from '@/models/comment.models'

interface CommentListProps {
  comments: IComments[]
  loading: boolean
  handleLike: (id: string) => void
  handleUnlike: (id: string) => void
}

export function CommentList({
  comments,
  loading,
  handleLike,
  handleUnlike,
}: CommentListProps) {
  return (
    <div className="space-y-4 flex items-center justify-center flex-col w-full">
      {loading && <LoadCircle />}
      {comments.map((comment) => (
        <CommentItem
          key={comment.comment.id}
          comment={comment}
          handleLike={handleLike}
          handleUnlike={handleUnlike}
        />
      ))}
    </div>
  )
}
