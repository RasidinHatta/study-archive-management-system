/**
 * Source: /components/admin/user/columns.tsx
 *
 * This file defines the column configuration for the admin user table.
 * It includes sorting, formatting, and custom cell rendering for user data.
 * The ActionCell component provides row-level actions (view, edit, delete).
 */

"use client"

import { User } from "@/lib/generated/prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import ActionCell from "./action-cell"
import { Skeleton } from "@/components/ui/skeleton"

// Skeleton components for loading states
const TextSkeleton = () => <Skeleton className="h-4 w-3/4" />
const RoleSkeleton = () => <Skeleton className="h-4 w-16" />
const VerificationSkeleton = () => <Skeleton className="h-4 w-8" />
const ImageSkeleton = () => <Skeleton className="w-8 h-8 rounded-full" />
const DateSkeleton = () => <Skeleton className="h-4 w-20" />
const ActionsSkeleton = () => (
  <div className="flex space-x-2">
    <Skeleton className="h-8 w-8 rounded-md" />
    <Skeleton className="h-8 w-8 rounded-md" />
    <Skeleton className="h-8 w-8 rounded-md" />
  </div>
)

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row, getValue }) => {
      const value = getValue() as string
      if (!value) return <TextSkeleton />
      return value
    },
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row, getValue }) => {
      const value = getValue() as string
      if (!value) return <TextSkeleton />
      return value
    },
    enableSorting: true,
  },
  {
    accessorKey: "roleName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Role
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row, getValue }) => {
      const value = getValue() as string
      if (!value) return <RoleSkeleton />
      return value
    },
    enableSorting: true,
  },
  {
    accessorKey: "emailVerified",
    header: "Verified?",
    cell: ({ row, getValue }) => {
      const value = getValue() as Date | null
      if (value === undefined) return <VerificationSkeleton />
      return value ? "Yes" : "No"
    },
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row, getValue }) => {
      const image = getValue() as string | null
      if (image === undefined) return <ImageSkeleton />
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
    cell: ({ row, getValue }) => {
      const value = getValue() as boolean
      if (value === undefined) return <VerificationSkeleton />
      return value ? "Enabled" : "Disabled"
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Join Date
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
    header: "Last Updated",
    cell: ({ row, getValue }) => {
      const value = getValue() as Date
      if (!value) return <DateSkeleton />
      return new Date(value).toLocaleDateString()
    },
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const user = row.original
      // Show skeleton if user data is incomplete
      if (!user.id || !user.email) return <ActionsSkeleton />
      
      return (
        <ActionCell
          userId={user.id}
          userName={user.name || ""}
          userEmail={user.email}
          userRole={user.roleName}
        />
      )
    },
  },
]