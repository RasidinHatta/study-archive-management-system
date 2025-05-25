import React from 'react';
import { getAllDocumentWithUserAndComment } from '@/data/document';
import { columns as documentColumns } from '@/components/admin/documents/columns';
import { getAllUserWithRole } from '@/data/user';
import { userColumns } from '@/components/admin/user/columns';
import { DataTable as DocumentTable } from '@/components/admin/documents/data-table'
import { DataTable as UserTable } from '@/components/admin/user/data-table'
import { CommentsDataTable } from '@/components/admin/comments/data-table';
import { commentColumns } from '@/components/admin/comments/columns';
import { getAllCommentWithDocAndUser } from '@/data/comment';

const AdminPage = async () => {
  const documents = await getAllDocumentWithUserAndComment();
  const users = (await getAllUserWithRole()) ?? [];
  const comments = await getAllCommentWithDocAndUser();

  return (
    <div className="p-4 space-y-12">
      {/* Analytics Summary */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border bg-card text-card-foreground shadow p-4">
          <h2 className="text-sm text-muted-foreground">Total Users</h2>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="rounded-2xl border bg-card text-card-foreground shadow p-4">
          <h2 className="text-sm text-muted-foreground">Total Documents</h2>
          <p className="text-2xl font-bold">{documents.length}</p>
        </div>
      </section>

      {/* Community Documents Table */}
      <section>
        <h1 className="text-xl font-semibold mb-4">Community Documents</h1>
        <DocumentTable columns={documentColumns} data={documents} />
      </section>

      {/* User List Table */}
      <section>
        <h1 className="text-xl font-semibold mb-4">User List</h1>
        <UserTable columns={userColumns} data={users} />
      </section>

      {/* Comment List Table */}
      <section>
        <h1 className="text-xl font-semibold mb-4">Comment List</h1>
        <CommentsDataTable columns={commentColumns} data={comments} />
      </section>
    </div>
  );
};

export default AdminPage;
