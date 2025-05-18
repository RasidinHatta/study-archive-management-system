"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Prisma } from "@/lib/generated/prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

export type Document = Prisma.DocumentGetPayload<{ include: { user: true } }>

export const columns: ColumnDef<Document>[] = [
    {
        accessorKey: "title",
        header: "Title",
        enableSorting: true,
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "format",
        header: "Format",
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
        header: "Created",
        cell: ({ row }) => {
            return new Date(row.original.createdAt).toLocaleDateString()
        },
    },
    {
        accessorKey: "updatedAt",
        header: "Last Edited",
        cell: ({ row }) => {
            return new Date(row.original.updatedAt).toLocaleDateString()
        },
    },
    {
        id: "action",
        header: "Action",
        cell: ({ row }) => {
            const url = row.original.url
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => {
                                // Open URL in a new tab
                                window.open(url, "_blank")
                            }}
                        >
                            View Document
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }
]
