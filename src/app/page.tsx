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
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">PalletApp</h1>
        <LoginForm departments={departments} />
      </div>
    </main>
  )
}
