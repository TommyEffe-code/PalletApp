import { prisma } from '@/lib/prisma'
import { getSession } from '@/actions/auth'
import Link from 'next/link'
import { PlusIcon } from '@heroicons/react/24/solid'
import DashboardTabs from '@/components/DashboardTabs'

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) return null // handled by layout

  const pallets = await prisma.pallet.findMany({
    where: { departmentId: session.id },
    orderBy: { createdAt: 'asc' }, // FIFO: Oldest first
    include: {
      products: {
        select: { quantity: true, isCase: true }
      }
    }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Bancali attivi</h1>
          <p className="text-sm text-gray-500 mt-0.5">Reparto: <span className="font-semibold text-blue-600">{session.name}</span></p>
        </div>
        <Link
          href="/dashboard/pallets/new"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          <PlusIcon className="w-5 h-5" />
          Nuovo Bancale
        </Link>
      </div>

      <DashboardTabs pallets={pallets} />
    </div>
  )
}
