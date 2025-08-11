/**
 * CommentPage - Admin dashboard page for managing community comments
 * Displays all comments with their associated documents and users in a sortable,
 * filterable table with pagination.
 */

// Import necessary components and utilities
import { commentColumns } from '@/components/admin/comments/columns';
import { CommentsDataTable } from '@/components/admin/comments/data-table';
import { getAllCommentWithDocAndUser } from '@/data/comment';
import React from 'react'

/**
 * The main comment management page component
 * @returns page - Rendered comments dashboard page
 */
const CommentPage = async () => {
  // Fetch all comments with their associated document and user data
  const comments = await getAllCommentWithDocAndUser();
  
  return (
    <div className="p-4">
      {/* Page heading */}
      <h1 className="text-xl font-semibold mb-4">Community Comments</h1>
      
      {/* Comments data table with configured columns and fetched data */}
      <CommentsDataTable 
        columns={commentColumns}  // Pre-defined table column configurations
        data={comments}          // Comment data fetched from the database
      />
    </div>
  )
}

export default CommentPage