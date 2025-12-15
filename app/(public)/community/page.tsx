import { Metadata } from 'next'
import { auth } from '@/auth'
import { RoleName } from '@/lib/generated/prisma'
import { getCommunityDocuments } from '@/data/document'
import CommunityPage from '@/components/documents/CommunityPage'

// Next.js provides this automatically; no import needed
type PageProps = {
  searchParams: Promise<{ q?: string }>
}

export const metadata: Metadata = {
  title: 'Community | SAMS',
  description: 'A document sharing platform with community discussions',
}

export default async function Page({ searchParams }: PageProps) {
  const { q } = await searchParams
  const query = q?.toLowerCase() ?? ''

  const session = await auth()
  const upload = session?.user?.role.name === RoleName.USER

  const documents = await getCommunityDocuments()
  const filtered = query
    ? documents.filter(
        d =>
          d.title.toLowerCase().includes(query) ||
          d.description?.toLowerCase().includes(query)
      )
    : documents

  return <CommunityPage documents={filtered} />
}