import React from 'react'
import { Skeleton } from '../ui/skeleton'

const CommentSkeleton = () => {
    return (
        <div className="flex space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-6 w-16" />
            </div>
        </div>
    )
}

export default CommentSkeleton