import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'

interface CommentProps {
  username?: string
  avatarUrl?: string
  commentText: string
}

const Comment: React.FC<CommentProps> = ({
  username = "You",
  avatarUrl = "https://github.com/shadcn.png",
  commentText,
}) => {
  return (
    <div className="flex space-x-3 p-4 border rounded-md">
      <Avatar>
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{username.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="font-semibold">{username}</p>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {commentText}
        </p>
      </div>
    </div>
  )
}

export default Comment
