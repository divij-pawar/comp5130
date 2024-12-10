import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-orange-500">MyApp</Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="text-black hover:text-orange-500 inline-flex items-center px-1 pt-1 text-sm font-medium">
                Home
              </Link>
              <Link href="/about" className="text-black hover:text-orange-500 inline-flex items-center px-1 pt-1 text-sm font-medium">
                About
              </Link>
              <Link href="/services" className="text-black hover:text-orange-500 inline-flex items-center px-1 pt-1 text-sm font-medium">
                Services
              </Link>
              <Link href="/contact" className="text-black hover:text-orange-500 inline-flex items-center px-1 pt-1 text-sm font-medium">
                Contact
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Button asChild variant="default" className="bg-orange-500 text-white hover:bg-orange-600">
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

