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
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <span className="text-2xl">📦</span>
              <span className="text-xl font-extrabold text-white tracking-tight">PalletApp</span>
            </Link>
            <Link href="/dashboard/lookup" className="text-sm font-medium text-blue-100 hover:text-white flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all">
              <span>🔍</span>
              <span>Cerca Prodotto</span>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-semibold px-3 py-1.5 bg-white/20 text-white rounded-lg flex items-center gap-1.5">
              <span>🏪</span>
              {session.name}
            </span>
            <form action={logoutAction}>
              <button type="submit" className="text-sm text-blue-100 hover:text-white font-semibold bg-white/10 hover:bg-red-500/40 px-3 py-1.5 rounded-lg transition-all">
                Esci
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
