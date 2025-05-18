import React from 'react'
import { getCommunityDocuments } from '@/data/document'
import { Metadata } from 'next'
import CommunityPage from '@/components/documents/CommunityPage'

export const metadata: Metadata = {
  title: "Community | SAMS",
  description: "A document sharing platform with community discussions",
}

type CommunityPageProps = {
  searchParams: Promise<{ q: string }>;
}

const Page = async ({ searchParams }: CommunityPageProps) => {
  const params = await searchParams;
  const query = params.q?.toLowerCase() || '';

  const documents = await getCommunityDocuments();

  const filteredDocuments = query
    ? documents.filter(
        (doc) =>
          doc.title.toLowerCase().includes(query) ||
          doc.description?.toLowerCase().includes(query)
      )
    : documents;

  return <CommunityPage documents={filteredDocuments} />;
};


export default Page
