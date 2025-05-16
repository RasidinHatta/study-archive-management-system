import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import React from 'react'

const AdminPage = async () => {
  const session = await auth()

  return (
    <div>AdminPage</div>
  )
}

export default AdminPage