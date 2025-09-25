import { commentColumns } from '@/components/admin/comments/columns'
import { DataTable } from '@/components/admin/comments/data-table'
import { getAllDocuments } from '@/components/data/comment/comment'
import { getAllCommentWithDocAndUser } from '@/data/comment'
import React from 'react'

const CommentPage = async () => {
  const comments = await getAllCommentWithDocAndUser()
  const documents = await getAllDocuments() // Fetch all documents

  return (
    <div className="p-4">
      {/* Page heading */}
      <h1 className="text-xl font-semibold mb-4">Community Comments</h1>

      {/* DataTable component that displays the comments */}
      <DataTable
        columns={commentColumns} // Column configuration from columns.tsx
        data={comments} // Comment data fetched from the database
        documents={documents} // Pass documents to DataTable
      />
    </div>
  )
}

export default CommentPage