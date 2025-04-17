import { MessageSquare } from 'lucide-react'
import React from 'react'

const CommentsEmpty = () => {
  return (
    <div className="text-center py-12">
      <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-2 text-lg font-medium">No comments yet</h3>
      <p className="mt-1 text-muted-foreground">
        Be the first to start the discussion
      </p>
    </div>
  )
}

export default CommentsEmpty