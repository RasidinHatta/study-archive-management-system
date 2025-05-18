// components/admin/users/columns.ts
"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User } from "@/lib/generated/prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: "Email",
    enableSorting: true
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "emailVerified",
    header: "Verified?",
    cell: ({ row }) => row.original.emailVerified ? "Yes" : "No",
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const image = row.original.image
      return image ? (
        <img src={image} alt="avatar" className="w-8 h-8 rounded-full" />
      ) : (
        "No Image"
      )
    },
  },
  {
    accessorKey: "twoFactorEnabled",
    header: "TwoFactor",
    cell: ({ row }) => row.original.twoFactorEnabled ? "Enabled" : "Disabled",
  },
  {
    accessorKey: "createdAt",
    header: "Join Date",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => new Date(row.original.updatedAt).toLocaleDateString(),
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const userId = row.original.id;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/admin/users/${userId}`}>
                View Details
              </Link>
            </DropdownMenuItem>
            {/* Add more actions here if needed */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }
]
