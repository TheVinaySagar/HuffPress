import type { Metadata } from "next"
import { ThemeWrapper } from "@/components/theme-wrapper"
import "./globals.css"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

export const metadata: Metadata = {
  title: "HuffPress",
  description: "Effortless text compression and decompression with Huffman coding.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeWrapper>
          <div className="min-h-screen flex flex-col bg-background">
            {/* Header - Har Page Pe Rahega */}
            <header className="bg-primary text-primary-foreground py-4 shadow-lg">
              <div className="container mx-auto flex justify-between items-center px-4">
                <h1 className="text-2xl font-bold">
                  <Link href="/" className="hover:underline">
                    HuffPress
                  </Link>
                </h1>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-4">
                  <Link href="/" className="hover:underline">Home</Link>
                  <Link href="/features" className="hover:underline">Features</Link>
                  <Link href="/about" className="hover:underline">About</Link>
                </nav>

                {/* Mobile Navigation */}
                <div className="flex items-center gap-4">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                      <SheetTitle>
                        <VisuallyHidden>Navigation Menu</VisuallyHidden>
                      </SheetTitle>
                      <nav className="flex flex-col gap-4 mt-8">
                        <Link
                          href="/"
                          className="text-foreground hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-accent"
                        >
                          Home
                        </Link>
                        <Link
                          href="/features"
                          className="text-foreground hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-accent"
                        >
                          Features
                        </Link>
                        <Link
                          href="/about"
                          className="text-foreground hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-accent"
                        >
                          About
                        </Link>
                      </nav>
                    </SheetContent>
                  </Sheet>
                  <ThemeToggle />
                </div>
              </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 container mx-auto p-6">{children}</main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-6 mt-auto">
              <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">

                {/* Copyright Text */}
                <p className="text-sm">&copy; {new Date().getFullYear()} <span className="font-semibold text-white">HuffPress</span>. All rights reserved.</p>

                {/* Social Links */}
                <div className="flex gap-4 mt-4 md:mt-0">
                  <a href="https://github.com/TheVinaySagar" target="_blank" className="text-gray-400 hover:text-white transition">
                    GitHub
                  </a>
                  <a href="https://linkedin.com/in/thevinaysagar" target="_blank" className="text-gray-400 hover:text-white transition">
                    LinkedIn
                  </a>
                  <a href="mailto:vinaysagar4445@gmail.com" className="text-gray-400 hover:text-white transition">
                    Email Me
                  </a>
                </div>

              </div>
            </footer>

          </div>
        </ThemeWrapper>
      </body>
    </html>
  )
}
