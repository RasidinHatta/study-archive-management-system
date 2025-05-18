// app/(admin)/admin/users/page.tsx
import { userColumns } from '@/components/admin/user/columns'
import { DataTable } from '@/components/admin/user/data-table'
import { getAllUser } from '@/data/user'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Users | SAMS",
  description: "A document sharing platform with community discussions",
}

const UserPage = async () => {
  const userList = (await getAllUser()) ?? []

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">User List</h1>
      <DataTable columns={userColumns} data={userList}/>
    </div>
  )
}

export default UserPage
