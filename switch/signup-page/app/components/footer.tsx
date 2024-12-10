import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-black">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="text-2xl font-bold text-orange-500">MyApp</Link>
            <p className="text-gray-400 text-base">
              Making the world a better place through constructing elegant hierarchies.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-orange-500 tracking-wider uppercase">Solutions</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="#" className="text-base text-gray-600 hover:text-orange-500">
                      Marketing
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-base text-gray-600 hover:text-orange-500">
                      Analytics
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-base text-gray-600 hover:text-orange-500">
                      Commerce
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-orange-500 tracking-wider uppercase">Support</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="#" className="text-base text-gray-600 hover:text-orange-500">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-base text-gray-600 hover:text-orange-500">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-base text-gray-600 hover:text-orange-500">
                      Guides
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-600 xl:text-center">
            &copy; 2023 MyApp, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

