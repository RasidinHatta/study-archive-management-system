import React from 'react'
import { getCommunityDocuments } from '@/data/document'
import { Metadata } from 'next'
import CommunityPage from '@/components/documents/CommunityPage'
import { auth } from '@/auth'
import { RoleName } from '@/lib/generated/prisma'

export const metadata: Metadata = {
  title: "Community | SAMS",
  description: "A document sharing platform with community discussions",
}

// Remove the SearchParams interface - let Next.js handle the typing

const Page = async ({ 
  searchParams 
}: { 
  searchParams: Record<string, string | string[] | undefined> 
}) => {
  const query = typeof searchParams.q === 'string' 
    ? searchParams.q.toLowerCase() 
    : '';
  
  const session = await auth()
  const role = session?.user?.role.name
  const upload = role === RoleName.USER
  const documents = await getCommunityDocuments()

  const filteredDocuments = query
    ? documents.filter(
        (doc) =>
          doc.title.toLowerCase().includes(query) ||
          doc.description?.toLowerCase().includes(query)
      )
    : documents;

  return <CommunityPage documents={filteredDocuments} showUpload={upload} />;
};

export default Page