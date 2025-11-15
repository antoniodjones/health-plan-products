'use client';

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  FileCode,
  Link2,
  BarChart3,
  Settings,
  Bell,
  Search,
  User,
} from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Code Library', href: '/codes', icon: FileCode },
  { name: 'Mappings', href: '/mappings', icon: Link2 },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen overflow-hidden bg-gray-50">
          {/* Sidebar */}
          <div className="hidden w-64 flex-col border-r bg-white md:flex">
            {/* Logo */}
            <div className="flex h-16 items-center border-b px-6">
              <h1 className="text-xl font-bold text-gray-900">
                Products & Benefits
              </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* User section */}
            <div className="border-t p-4">
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold">Admin User</div>
                  <div className="text-xs text-gray-500">admin@company.com</div>
                </div>
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Top bar */}
            <header className="flex h-16 items-center justify-between border-b bg-white px-6">
              <div className="flex flex-1 items-center gap-4">
                <div className="relative w-96">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
              </div>
            </header>

            {/* Page content */}
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
