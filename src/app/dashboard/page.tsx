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

      {pallets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-gray-500 font-medium">Nessun bancale attivo.</p>
          <p className="text-gray-400 text-sm mt-1">Crea il primo bancale per iniziare.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pallets.map((pallet, index) => {
            const isOldest = index === 0 && pallet.status === 'OPEN';

            return (
              <Link key={pallet.id} href={`/dashboard/pallets/${pallet.id}`}>
                <div className={`rounded-2xl border shadow-sm transition-all hover:shadow-md cursor-pointer flex flex-col h-full overflow-hidden ${
                  isOldest ? 'border-red-200 bg-white' : 'border-gray-100 bg-white hover:border-blue-200'
                }`}>
                  {isOldest && (
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-1.5 flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">⚠️ Priorità FIFO</span>
                    </div>
                  )}
                  {!isOldest && (
                    <div className={`h-1.5 ${pallet.status === 'OPEN' ? 'bg-gradient-to-r from-blue-400 to-indigo-500' : 'bg-gray-200'}`} />
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-lg font-bold text-gray-900 leading-tight">{pallet.name}</h2>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ml-2 shrink-0 ${
                        pallet.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {pallet.status === 'OPEN' ? '● Aperto' : '✓ Chiuso'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-4">
                      📅 {new Date(pallet.createdAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                        <span className="text-blue-500">📦</span>
                        {pallet._count.products} prodotti
                      </span>
                      <span className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors">Apri →</span>
                    </div>
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
