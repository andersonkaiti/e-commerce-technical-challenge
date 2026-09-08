import { ThemeToggle } from '@components/theme-toggle'
import { Toaster } from '@components/ui/toast'
import { CartProvider } from '@contexts/cart-context'
import { QueryProvider } from '@contexts/query-context'
import { ThemeProvider } from '@contexts/theme-context'
import { cn } from 'cn'
import type { Metadata } from 'next'
import { Geist, Geist_Mono, Inter } from 'next/font/google'
import type { ReactNode } from 'react'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'E-commerce',
  description: 'Aplicação para o processo seletivo com foco em e-commerce',
}

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={cn(
        'h-full',
        'antialiased',
        geistSans.variable,
        geistMono.variable,
        'font-sans',
        inter.variable,
      )}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <Toaster>
              <CartProvider>
                <div className="absolute top-4 right-4">
                  <ThemeToggle />
                </div>

                {children}
              </CartProvider>
            </Toaster>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
