import { prisma } from '@/lib/prisma'
import { getSession } from '@/actions/auth'
import Link from 'next/link'
import { PlusIcon } from '@heroicons/react/24/solid' // Need to install heroicons

export default async function DashboardPage() {
  const session = await getSession()
  
  if (!session) return null // handled by layout

  const pallets = await prisma.pallet.findMany({
    where: { departmentId: session.id },
    orderBy: { createdAt: 'asc' }, // FIFO: Oldest first
    include: {
      _count: {
        select: { products: true }
      }
    }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pallets ({session.name})</h1>
        <Link 
          href="/dashboard/pallets/new" 
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Nuovo Bancale
        </Link>
      </div>

      {pallets.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-500">Nessun bancale attivo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pallets.map((pallet, index) => {
            // First one is oldest (FIFO priority)
            const isOldest = index === 0 && pallet.status === 'OPEN';
            
            return (
              <Link key={pallet.id} href={`/dashboard/pallets/${pallet.id}`}>
                <div className={`p-5 rounded-lg border-2 shadow-sm transition-all hover:shadow-md cursor-pointer flex flex-col h-full ${
                  isOldest ? 'bg-red-50 border-red-200 hover:border-red-300' : 'bg-white border-transparent hover:border-blue-100'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-bold text-gray-900">{pallet.name}</h2>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      pallet.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {pallet.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Creato il: {new Date(pallet.createdAt).toLocaleDateString('it-IT')}
                  </p>
                  <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      {pallet._count.products} Prodotti
                    </span>
                    {isOldest && (
                      <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                        Priorità (FIFO)
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
