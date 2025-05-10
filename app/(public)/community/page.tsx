import React from 'react';
import CommunityPage from '@/components/CommunityPage';
import { getCommunityDocuments } from '@/data/document';

const Page = async () => {
  // Fetch documents from the server
  const documents = await getCommunityDocuments();

  // Pass documents as props to CommunityPage
  return <CommunityPage documents={documents} />;
};

export default Page;
