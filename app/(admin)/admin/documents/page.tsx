import { getAllDocumentWithUserAndComment } from '@/data/document';
import React from 'react';
import { Metadata } from 'next';
import { DataTable } from '@/components/admin/documents/data-table';
import { columns } from '@/components/admin/documents/columns';

export const metadata: Metadata = {
  title: "Document | SAMS",
  description: "A document sharing platform with community discussions",
};

const DocumentsPage = async () => {
  const documents = await getAllDocumentWithUserAndComment();

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Community Documents</h1>
      <DataTable columns={columns} data={documents} />
    </div>
  );
};

export default DocumentsPage;
