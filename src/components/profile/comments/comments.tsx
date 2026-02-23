'use client'

import { useCurrentWallet } from '@/components/auth/hooks/use-current-wallet'
import { Alert } from '@/components/common/alert'
import { CommentInput } from '@/components/profile/comments/comment-input'
import { CommentList } from '@/components/profile/comments/comment-list'
import { useCreateComment } from '@/components/profile/hooks/use-create-comment'
import {
  useCreateLike,
  useCreateUnlike,
} from '@/components/profile/hooks/use-create-like'
import { useGetComments } from '@/components/profile/hooks/use-get-comments'
import { useEffect, useState } from 'react'

interface Props {
  username: string
}

export function Comments({ username }: Props) {
  const { mainUsername } = useCurrentWallet()

  const { data, loading, refetch } = useGetComments({
    targetProfileId: username,
    requestingProfileId: mainUsername,
  })

  const {
    createComment,
    loading: commentLoading,
    error: commentError,
    success: commentSuccess,
  } = useCreateComment()

  const { createLike, error: likeError, success: likeSuccess } = useCreateLike()

  const {
    createUnlike,
    error: unlikeError,
    success: unlikeSuccess,
  } = useCreateUnlike()

  const [commentText, setCommentText] = useState('')

  useEffect(() => {
    if (commentSuccess) {
      refetch()
      setCommentText('')
    }
  }, [commentSuccess, refetch])

  useEffect(() => {
    if (likeSuccess) {
      refetch()
    }
  }, [likeSuccess, refetch])

  useEffect(() => {
    if (unlikeSuccess) {
      refetch()
    }
  }, [unlikeSuccess, refetch])

  return (
    <>
      <CommentInput
        commentText={commentText}
        setCommentText={setCommentText}
        handleSubmit={() =>
          createComment({
            profileId: mainUsername || '',
            targetProfileId: username,
            text: commentText,
          })
        }
        loading={commentLoading}
      />

      <CommentList
        comments={data?.comments || []}
        loading={loading}
        handleLike={(id) =>
          createLike({ nodeId: id, startId: mainUsername || '' })
        }
        handleUnlike={(id) =>
          createUnlike({ nodeId: id, startId: mainUsername || '' })
        }
      />

      {commentSuccess && (
        <Alert
          type="success"
          message="Comment sent successfully!"
          duration={5000}
        />
      )}
      {commentError && (
        <Alert
          type="error"
          message={`Error sending comment: ${commentError}`}
          duration={5000}
        />
      )}
      {likeSuccess && (
        <Alert type="success" message="Like success!" duration={5000} />
      )}
      {likeError && (
        <Alert
          type="error"
          message={`Error like: ${likeError}`}
          duration={5000}
        />
      )}
      {unlikeSuccess && (
        <Alert type="success" message="Unlike success!" duration={5000} />
      )}
      {unlikeError && (
        <Alert
          type="error"
          message={`Error unlike: ${unlikeError}`}
          duration={5000}
        />
      )}
    </>
  )
}
