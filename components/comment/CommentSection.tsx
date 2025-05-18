"use client"

import React from "react"
import CommentForm from "./CommentForm"
import Comment from "./Comment"
import CommentsEmpty from "../empty-states/CommentsEmpty"

interface User {
  name?: string | null
  image?: string | null
}

interface CommentType {
  id: string
  content: string
  user?: User | null
  replies?: CommentType[]
  createdAt: Date
  parentId?: string | null
}

interface CommentSectionProps {
  documentId: string
  user: User | null
  comments: CommentType[]
}

const CommentSection: React.FC<CommentSectionProps> = ({ documentId, user, comments }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Discussion</h2>
      <CommentForm
        user={user || { name: "Anonymous", image: null }}
        documentId={documentId}
      />
      {comments.length === 0 ? (
        <CommentsEmpty />
      ) : (
        <div className="space-y-6">
          {comments.map((comment) =>
            !comment.parentId ? (
              <Comment
                key={comment.id}
                comment={comment}
                documentId={documentId}
                user={user}
              />
            ) : null
          )}
        </div>
      )}
    </div>
  )
}

export default CommentSection
