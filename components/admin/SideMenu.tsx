import Link from 'next/link'
import { Button } from '../ui/button'
import { FiHome, FiUsers, FiMessageSquare } from 'react-icons/fi'
import { FaFileAlt } from 'react-icons/fa'
import { IoSettingsSharp } from 'react-icons/io5'

interface MenuItem {
  href: string
  icon: React.ReactNode
  label: string
}

const menuItems: MenuItem[] = [
  { href: '/admin', icon: <FiHome className="h-4 w-4" />, label: 'Home' },
  { href: '/admin/documents', icon: <FaFileAlt className="h-4 w-4" />, label: 'Documents' },
  { href: '/admin/users', icon: <FiUsers className="h-4 w-4" />, label: 'Users' },
  { href: '/admin/comments', icon: <FiMessageSquare className="h-4 w-4" />, label: 'Comments' },
  { href: '/admin/setting', icon: <IoSettingsSharp className="h-4 w-4" />, label: 'Setting' },
]

const SideMenu = async () => {
  return (
    <div className="pb-12 w-full">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Manage
          </h2>
          <div className="space-y-1 gap-2">
            {menuItems.map((item) => (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                className="w-full justify-start flex gap-2 bg-accent hover:!bg-primary transition-colors"
              >
                <Link href={item.href}>
                  {item.icon}
                  {item.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideMenu