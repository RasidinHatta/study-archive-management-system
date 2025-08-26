import React from 'react'
// import { DataTable } from '@/components/data/data-table';
import data from '../data.json'
import { columns } from '@/components/admin/documents/columns';
import { getAllDocumentWithUserAndComment } from '@/data/document';
import { DataTable } from '@/components/admin/documents/data-table';

const DocumentsPage = async () => {
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
      {/* <DataTable data={data} /> */}
    </div>
  );
}

export default DocumentsPage