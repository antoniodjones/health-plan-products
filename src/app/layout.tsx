import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Products & Benefits Platform',
  description: 'AI-native healthcare products and benefits management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="border-b">
          <div className="container mx-auto flex h-16 items-center gap-4 px-4">
            <Link href="/" className="text-lg font-semibold">
              Products & Benefits
            </Link>
            <div className="flex flex-1 items-center gap-4">
              <Link href="/codes">
                <Button variant="ghost">Code Library</Button>
              </Link>
              <Link href="/products">
                <Button variant="ghost">Products</Button>
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
