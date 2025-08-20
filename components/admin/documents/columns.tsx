/**
 * Source: /components/admin/documents/columns.tsx
 *
 * This file defines the column configuration for the admin documents table.
 * It includes sorting, formatting, and custom cell rendering for document data.
 * The DocumentActionCell component provides row-level actions (view, edit, delete, comments).
 */

"use client" // Marks this as a Client Component in Next.js

// Import necessary components and libraries
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import DocumentActionCell from "./action-cell"
import { Document, User } from "@/lib/generated/prisma/client"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"

// Type combining Document with User information
type DocumentWithUser = Document & {
    user: User
}

// Skeleton components for loading states
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

const DateSkeleton = () => <Skeleton className="h-4 w-16" />

const ActionsSkeleton = () => (
    <div className="flex space-x-2">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
    </div>
)

/**
 * Column definitions for the documents table
 */
export const columns: ColumnDef<DocumentWithUser>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Title
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row, getValue }) => {
            const value = getValue() as string
            if (!value) return <TitleSkeleton />
            
            return value
        },
        enableSorting: true,
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row, getValue }) => {
            const description = getValue() as string
            const maxLength = 50

            if (description === undefined) return <DescriptionSkeleton />
            
            if (!description) {
                return <span className="text-muted-foreground/50">No description</span>;
            }

            // Truncate long descriptions with ellipsis
            const truncated = description.length > maxLength
                ? `${description.substring(0, maxLength)}...`
                : description

            return (
                <div className="pl-6 border-l-2 border-muted-foreground/30">
                    {/* Tooltip shows full description on hover */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="line-clamp-2 text-sm">
                                {truncated}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="start" className="max-w-[300px]">
                            <p className="break-words">{description}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            )
        },
        size: 300, // Column width
    },
    {
        accessorKey: "subject",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Subject
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row, getValue }) => {
            const value = getValue() as string
            if (!value) return <BasicSkeleton />
            return value
        },
        enableSorting: true,
    },
    {
        accessorKey: "format",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Format
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row, getValue }) => {
            const value = getValue() as string
            if (!value) return <BasicSkeleton />
            return value
        },
        enableSorting: true,
    },
    {
        accessorKey: "user",
        header: "Uploaded By",
        cell: ({ row }) => {
            const user = row.original.user
            if (!user?.name || !user?.email) return <UserSkeleton />
            return `${user.name} (${user.email})`
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Created
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row, getValue }) => {
            const value = getValue() as Date
            if (!value) return <DateSkeleton />
            return new Date(value).toLocaleDateString()
        },
        enableSorting: true,
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Last Edited
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row, getValue }) => {
            const value = getValue() as Date
            if (!value) return <DateSkeleton />
            return new Date(value).toLocaleDateString()
        },
        enableSorting: true,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const document = row.original;
            // Show skeleton if document data is incomplete
            if (!document.id || !document.title) return <ActionsSkeleton />
            
            return (
                <DocumentActionCell
                    documentId={document.id}
                    documentTitle={document.title}
                />
            );
        },
    }
]