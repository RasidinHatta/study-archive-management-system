"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import DocumentActionCell from "./action-cell"
import { Document, User } from "@/lib/generated/prisma/client"

type DocumentWithUser = Document & {
  user: User
}


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
        enableSorting: true,
    },
    {
        accessorKey: "description",
        header: "Description",
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
        enableSorting: true,
    },
    {
        accessorKey: "user",
        header: "Uploaded By",
        cell: ({ row }) => {
            const user = row.original.user
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
        cell: ({ row }) => {
            return new Date(row.original.createdAt).toLocaleDateString()
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
        cell: ({ row }) => {
            return new Date(row.original.updatedAt).toLocaleDateString()
        },
        enableSorting: true,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const document = row.original;
            return (
                <DocumentActionCell
                    documentId={document.id}
                    documentTitle={document.title}
                />
            );
        },
    }
]