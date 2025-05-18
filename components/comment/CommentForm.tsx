import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'

const CommentForm = () => {
    return (
        <div className="space-y-4">
            <div className="flex space-x-3">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>You</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                    <Textarea
                        placeholder="Add to the discussion..."
                        className="min-h-[100px]"
                    />
                    <div className="flex justify-end">
                        <Button>Post Comment</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommentForm