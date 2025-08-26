import React from 'react'
import data from './data.json'
import { DataTable } from '@/components/data/data-table'
import { SectionCards } from '@/components/data/section-cards'
import { ChartAreaInteractive } from '@/components/data/chart-area-interactive'
import { columns } from '@/components/admin/documents/columns'
import { getAllDocumentWithUserAndComment } from '@/data/document'

const AdminPage = async() => {
  const documents = await getAllDocumentWithUserAndComment();
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div> */}
          <DataTable
            columns={columns}  // Column configuration from columns.tsx
            data={documents}   // Document data fetched from the database
          />
        </div>
      </div>
    </div>
  )
}

export default AdminPage