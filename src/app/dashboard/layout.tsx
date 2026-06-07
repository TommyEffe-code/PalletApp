import { getSession, logoutAction } from '@/actions/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import GlobalPalletScanner from '@/components/GlobalPalletScanner'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              PalletApp
            </Link>
            <Link href="/dashboard/lookup" className="text-sm font-medium text-gray-600 hover:text-blue-600 flex items-center gap-1">
              <span>🔍 Cerca Prodotto</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded-full">
              {session.name}
            </span>
            <form action={logoutAction}>
              <button type="submit" className="text-sm text-red-600 hover:text-red-800 font-semibold">
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>
      <GlobalPalletScanner />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
