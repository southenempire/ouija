import { IPaginatedResponse } from '@/models/common.models'

interface IComment {
  id: string
  created_at: number
  text: string
}

interface IAuthor {
  id: string
  namespace: string
  created_at: number
  username: string
  bio: string
  image: string
}

interface ISocialCounts {
  likeCount: number
}

interface IRequestingProfileSocialInfo {
  hasLiked: boolean
}

export interface IComments {
  comment: IComment
  contentId: string
  author: IAuthor
  socialCounts: ISocialCounts
  requestingProfileSocialInfo: IRequestingProfileSocialInfo
  recentReplies: Array<{
    comment: IComment
    contentId: string
    author: IAuthor
    socialCounts: ISocialCounts
    requestingProfileSocialInfo: IRequestingProfileSocialInfo
  }>
}

export interface ICommentsResponse extends IPaginatedResponse {
  comments: IComments[]
}
