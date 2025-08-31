/**
 * Source: /components/documents/columns.tsx
 *
 * Document table column definitions with sorting, formatting, and skeletons.
 */

"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import DocumentActionCell from "./action-cell"
import { Document, User } from "@/lib/generated/prisma/client"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"

type DocumentWithUser = Document & {
  user: User
}

// -----------------------------
// Skeletons
// -----------------------------
const TitleSkeleton = () => (
  <div className="flex items-center space-x-2">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-4 rounded-full" />
  </div>
)

const DescriptionSkeleton = () => (
  <div className="pl-6 border-l-2 border-muted-foreground/30">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3 mt-1" />
  </div>
)

const BasicSkeleton = () => <Skeleton className="h-4 w-3/4" />
const UserSkeleton = () => (
  <div className="space-y-1">
    <Skeleton className="h-3 w-4/5" />
    <Skeleton className="h-3 w-3/5" />
  </div>
)
const DateSkeleton = () => (
  <div className="space-y-1">
    <Skeleton className="h-3 w-12" />
    <Skeleton className="h-3 w-10" />
  </div>
)
const ActionsSkeleton = () => (
  <div className="flex space-x-2">
    <Skeleton className="h-8 w-8 rounded-md" />
    <Skeleton className="h-8 w-8 rounded-md" />
    <Skeleton className="h-8 w-8 rounded-md" />
  </div>
)

// -----------------------------
// Reusable header
// -----------------------------
const SortableHeader = ({ column, label }: { column: any; label: string }) => (
  <Button
    className="bg-accent-background rounded-md text-foreground hover:bg-primary"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  >
    {label}
    <ArrowUpDown className="ml-2 h-4 w-4" />
  </Button>
)

// -----------------------------
// Formatters
// -----------------------------
const formatDateDDMMYYYY = (date: Date) => {
  const d = date.getDate().toString().padStart(2, "0")
  const m = (date.getMonth() + 1).toString().padStart(2, "0")
  const y = date.getFullYear()
  return `${d}/${m}/${y}`
}

// -----------------------------
// Columns
// -----------------------------
export const columns: ColumnDef<DocumentWithUser>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => <SortableHeader column={column} label="Title" />,
    cell: ({ getValue }) => {
      const value = getValue() as string | null
      if (!value) return <TitleSkeleton />
      return <span className="font-medium text-sm">{value}</span>
    },
    enableSorting: true,
    size: 280, // Reduced from 320
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ getValue }) => {
      const description = getValue() as string | undefined
      const maxLength = 50

      if (description === undefined) return <DescriptionSkeleton />
      if (!description) return <span className="text-muted-foreground/50">No description</span>

      const truncated =
        description.length > maxLength ? `${description.substring(0, maxLength)}...` : description

      return (
        <div className="pl-6 border-muted-foreground/30">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="line-clamp-2 text-sm">{truncated}</span>
            </TooltipTrigger>
            <TooltipContent side="top" align="start" className="max-w-[300px]">
              <p className="break-words">{description}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )
    },
    size: 300, // Reduced from 360
  },
  {
    accessorKey: "subject",
    header: ({ column }) => <SortableHeader column={column} label="Subject" />,
    cell: ({ getValue }) => {
      const value = getValue() as string | null
      if (!value) return <BasicSkeleton />
      return <span className="text-sm">{value}</span>
    },
    enableSorting: true,
    size: 140, // Reduced from 160
  },
  {
    accessorKey: "format",
    header: ({ column }) => <SortableHeader column={column} label="Format" />,
    cell: ({ getValue }) => {
      const value = getValue() as string | null
      if (!value) return <BasicSkeleton />
      return <span className="text-sm">{value}</span>
    },
    enableSorting: true,
    size: 100, // Reduced from 120
  },
  {
    accessorKey: "user",
    header: "Uploaded By",
    cell: ({ row }) => {
      const user = row.original.user
      if (!user?.name || !user?.email) return <UserSkeleton />
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-sm line-clamp-1">{`${user.name}`}</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{user.name} ({user.email})</p>
          </TooltipContent>
        </Tooltip>
      )
    },
    size: 150, // Reduced from 240
  },
  {
    id: "dates",
    header: ({ column }) => <SortableHeader column={column} label="Dates" />,
    cell: ({ row }) => {
      const { createdAt, updatedAt } = row.original

      if (!createdAt || !updatedAt) return <DateSkeleton />

      const createdDate = new Date(createdAt)
      const updatedDate = new Date(updatedAt)

      return (
        <div className="space-y-1 text-xs text-muted-foreground">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1">
                <span className="font-medium">C:</span>
                <span>{formatDateDDMMYYYY(createdDate)}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Created: {createdDate.toLocaleDateString()}</p>
              <p>Updated: {updatedDate.toLocaleDateString()}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1">
                <span className="font-medium">U:</span>
                <span>{formatDateDDMMYYYY(updatedDate)}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Created: {createdDate.toLocaleDateString()}</p>
              <p>Updated: {updatedDate.toLocaleDateString()}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )
    },
    enableSorting: true,
    sortingFn: (rowA, rowB, columnId) => {
      // Sort by updatedAt date (most recent first)
      const dateA = new Date(rowA.original.updatedAt)
      const dateB = new Date(rowB.original.updatedAt)
      return dateA.getTime() - dateB.getTime()
    },
    size: 100, // Combined from 280 (140 + 140)
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const document = row.original
      if (!document.id || !document.title) return <ActionsSkeleton />

      return <DocumentActionCell documentId={document.id} documentTitle={document.title} />
    },
    size: 100, // Reduced from 120
  },
]