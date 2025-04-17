import React from 'react'
import { Skeleton } from '../ui/skeleton'

const DocumentCardSkeleton = () => {
  return (
    <div className="space-y-4 rounded-lg border p-4">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="space-y-2">
        <Skeleton className="h-48 w-full" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-9 w-16 rounded-md" />
      </div>
    </div>
  )
}

export default DocumentCardSkeleton