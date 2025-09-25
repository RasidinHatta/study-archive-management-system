"use client"

import { useSession, signOut } from "next-auth/react"
import {
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react"
import { useState, useTransition, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { z } from "zod"
import { updateAdminInfo, getAdminInfo } from "@/actions/user"
import { AdminProfileSchema } from "@/lib/schemas"

export function NavUser() {
  const { data: session, update } = useSession()
  const { isMobile } = useSidebar()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(false)

  const user = session?.user

  const form = useForm<z.infer<typeof AdminProfileSchema>>({
    resolver: zodResolver(AdminProfileSchema),
    defaultValues: {
      name: user?.name || "",
      twoFactorEnabled: user?.twoFactorEnabled ?? false,
    },
  })

  // 🔹 Fetch fresh DB values when dialog opens
  useEffect(() => {
    if (open) {
      setLoading(true)
      getAdminInfo().then((fresh) => {
        if (fresh) {
          form.reset({
            name: fresh.name || "",
            twoFactorEnabled: fresh.twoFactorEnabled ?? false,
          })
        }
        setLoading(false)
      })
    }
  }, [open, form])

  function onSubmit(values: z.infer<typeof AdminProfileSchema>) {
    startTransition(async () => {
      const toastId = toast.loading("Saving changes...")

      const res = await updateAdminInfo(values)
      if (res.success) {
        await update() // refresh session object
        toast.success("Profile updated successfully", { id: toastId })
        setOpen(false)
      } else {
        toast.error(res.error || "Failed to update profile", { id: toastId })
        console.error(res.error || res.issues)
      }
    })
  }

  if (!user) return null

  const { name, email, image } = user

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={image ?? ""} alt={name ?? "User"} />
                  <AvatarFallback className="rounded-lg">
                    {name?.charAt(0) ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {email}
                  </span>
                </div>
                <IconDotsVertical className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={image ?? ""} alt={name ?? "User"} />
                    <AvatarFallback className="rounded-lg">
                      {name?.charAt(0) ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{name}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setOpen(true)}>
                  <IconUserCircle />
                  <span>Profile</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <IconLogout />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Profile Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Profile</DialogTitle>
            <DialogDescription>Update your profile details</DialogDescription>
          </DialogHeader>

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 rounded-lg">
                  <AvatarImage src={image ?? ""} alt={name ?? "User"} />
                  <AvatarFallback className="rounded-lg">
                    {name?.charAt(0) ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{email}</span>
                  <span className="text-muted-foreground text-sm">
                    Email (read-only)
                  </span>
                </div>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 mt-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="twoFactorEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Two-Factor Authentication</FormLabel>
                          <DialogDescription>
                            Adds extra security to your account
                          </DialogDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isPending}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full text-secondary"
                  >
                    {isPending ? "Saving..." : "Save changes"}
                  </Button>
                </form>
              </Form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}