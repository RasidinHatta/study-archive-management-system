"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { routeTitles } from "@/data/navigation"
import { ThemeSelector } from "@/components/theme/theme-selector"
import { ModeToggle } from "@/components/theme/ModeToggle"

export function SiteHeader() {
  const pathname = usePathname()
  const [pageTitle, setPageTitle] = useState("Documents")

  useEffect(() => {
    // Check if we have a custom title for this route
    const customTitle = routeTitles[pathname]
    if (customTitle) {
      setPageTitle(customTitle)
      return
    }

    // Fallback to generating from URL
    const pathSegments = pathname.split('/').filter(segment => segment !== '')
    const lastSegment = pathSegments[pathSegments.length - 1]

    const formattedTitle = lastSegment
      ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
      : "Documents"

    setPageTitle(formattedTitle);
  }, [pathname])

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{pageTitle}</h1>
        <div className="ml-auto flex items-center gap-2">
          <ThemeSelector />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}