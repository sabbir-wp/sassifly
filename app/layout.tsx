import type React from "react"
import { Inter } from "next/font/google"
import Link from "next/link"
import { Github } from "lucide-react"

import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { ThemeCustomizer } from "@/components/theme-customizer"
import { HeaderNav } from "@/components/header-nav"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ToolHub - Free Online Tools & Calculators",
  description: "A collection of free online tools and calculators to help you make better financial decisions.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="flex min-h-screen flex-col bg-black text-white">
            <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
              <div className="container flex h-16 items-center justify-between">
                <div className="flex gap-6 md:gap-10">
                  <Link href="/" className="flex items-center space-x-2">
                    <span className="font-bold inline-block text-[#AAFF00]">ToolHub</span>
                  </Link>
                  <HeaderNav />
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <ThemeCustomizer className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800" />
                  <ModeToggle />
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                    className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <Link href="https://github.com" target="_blank" rel="noreferrer">
                      <Github className="h-4 w-4" />
                      <span className="sr-only">GitHub</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t border-zinc-800 py-6 md:py-0 bg-black">
              <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                <p className="text-sm text-zinc-500">&copy; {new Date().getFullYear()} ToolHub. All rights reserved.</p>
                <div className="flex gap-4">
                  <Link href="/privacy" className="text-sm text-zinc-500 hover:text-white">
                    Privacy
                  </Link>
                  <Link href="/terms" className="text-sm text-zinc-500 hover:text-white">
                    Terms
                  </Link>
                  <Link href="/contact" className="text-sm text-zinc-500 hover:text-white">
                    Contact
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'