"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { ThemeCustomizer } from "@/components/theme-customizer"

export function HeaderNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-6">
        <Link href="/" className="flex items-center text-sm font-medium text-zinc-400 hover:text-white">
          Home
        </Link>
        <Link href="/tools" className="flex items-center text-sm font-medium text-zinc-400 hover:text-white">
          All Tools
        </Link>
        <Link href="/about" className="flex items-center text-sm font-medium text-zinc-400 hover:text-white">
          About
        </Link>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Button
          variant="outline"
          size="icon"
          className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-black border-b border-zinc-800 p-4 z-50">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              className="flex items-center text-sm font-medium text-zinc-400 hover:text-white py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/tools"
              className="flex items-center text-sm font-medium text-zinc-400 hover:text-white py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              All Tools
            </Link>
            <Link
              href="/about"
              className="flex items-center text-sm font-medium text-zinc-400 hover:text-white py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
              <ThemeCustomizer className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800" />
              <ModeToggle />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

