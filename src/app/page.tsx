import { prisma } from '@/lib/prisma'
import LoginForm from '@/components/LoginForm'
import { getSession } from '@/actions/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getSession()
  if (session) {
    redirect('/dashboard')
  }

  const departments = await prisma.department.findMany()

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">📦</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">PalletApp</h1>
          <p className="text-blue-200 mt-2 text-sm">Gestione magazzino surplus</p>
        </div>
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20">
          <LoginForm departments={departments} />
        </div>
      </div>
    </main>
  )
}
