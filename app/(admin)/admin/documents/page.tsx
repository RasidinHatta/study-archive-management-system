/**
 * DocumentsPage - The main page for displaying community documents in the admin panel
 * Fetches and displays all documents with associated user and comment data in a sortable,
 * filterable table with pagination.
 */

// Import necessary modules and components
import { getAllDocumentWithUserAndComment } from '@/data/document';
import React from 'react';
import { Metadata } from 'next';
import { DataTable } from '@/components/admin/documents/data-table';
import { columns } from '@/components/admin/documents/columns';

/**
 * Metadata for the documents page
 * This will be used to set the page title and description in the HTML head
 */
export const metadata: Metadata = {
  title: "Document | SAMS",
  description: "A document sharing platform with community discussions",
};

/**
 * DocumentsPage component - The main page for displaying community documents
 * @returns page - The rendered documents page with data table
 */
const DocumentsPage = async () => {
  // Fetch all documents with their associated user and comment data
  const documents = await getAllDocumentWithUserAndComment();

  return (
    <div className="p-4">
      {/* Page heading */}
      <h1 className="text-xl font-semibold mb-4">Community Documents</h1>
      
      {/* DataTable component that displays the documents */}
      <DataTable 
        columns={columns}  // Column configuration from columns.tsx
        data={documents}   // Document data fetched from the database
      />
    </div>
  );
};

export default DocumentsPage;