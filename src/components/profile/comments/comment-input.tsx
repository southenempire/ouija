import { Button } from '@/components/common/button'
import { Card } from '@/components/common/card'
import { LoadCircle } from '@/components/common/load-circle'

interface CommentInputProps {
  commentText: string
  setCommentText: (text: string) => void
  handleSubmit: () => void
  loading: boolean
}

export function CommentInput({
  commentText,
  setCommentText,
  handleSubmit,
  loading,
}: CommentInputProps) {
  return (
    <Card>
      <div className="flex flex-col items-end space-y-2">
        <input
          type="text"
          className="border-b border-muted-light p-2 w-full outline-0"
          value={commentText}
          placeholder="Write a comment"
          onChange={(e) => setCommentText(e.target.value)}
        />
        <Button
          variant="secondary"
          onClick={handleSubmit}
          disabled={loading || !commentText}
        >
          {loading ? <LoadCircle /> : 'Send comment'}
        </Button>
      </div>
    </Card>
  )
}
