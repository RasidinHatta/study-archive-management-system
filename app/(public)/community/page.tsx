import React from 'react';
import { getCommunityDocuments } from '@/data/document';
import { Metadata } from 'next';
import CommunityPage from '@/components/documents/CommunityPage';

export const metadata: Metadata = {
  title: "Community | SAMS",
  description: "A document sharing platform with community discussions",
};

const Page = async () => {
  // Fetch documents from the server
  const documents = await getCommunityDocuments();

  // Pass documents as props to CommunityPage
  return <CommunityPage documents={documents} />;
};

export default Page;
