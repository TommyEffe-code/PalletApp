'use client'

import { useState } from 'react'
import Link from 'next/link'
import DeletePalletButton from './DeletePalletButton'

type Product = { quantity: number; isCase: boolean }
type Pallet = {
  id: string
  name: string
  section: string | null
  status: string
  createdAt: Date
  products: Product[]
}

export default function DashboardTabs({ pallets }: { pallets: Pallet[] }) {
  const sections = Array.from(
    new Set(pallets.map(p => p.section).filter(Boolean) as string[])
  ).sort()

  const hasMixed = sections.length > 0 && pallets.some(p => !p.section)
  const tabs = [
    'Tutti',
    ...sections,
    ...(hasMixed ? ['—'] : []),
  ]

  const [active, setActive] = useState('Tutti')

  const filtered = active === 'Tutti'
    ? pallets
    : active === '—'
      ? pallets.filter(p => !p.section)
      : pallets.filter(p => p.section === active)

  if (pallets.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="text-5xl mb-4">📭</div>
        <p className="text-gray-500 font-medium">Nessun bancale attivo.</p>
        <p className="text-gray-400 text-sm mt-1">Crea il primo bancale per iniziare.</p>
      </div>
    )
  }

  return (
    <div>
      {tabs.length > 1 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                active === tab
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {tab === '—' ? 'Senza sezione' : tab}
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                active === tab ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {tab === 'Tutti'
                  ? pallets.length
                  : tab === '—'
                    ? pallets.filter(p => !p.section).length
                    : pallets.filter(p => p.section === tab).length}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((pallet, index) => {
          // FIFO badge only on the oldest OPEN pallet in the current view
          const isOldest = index === 0 && pallet.status === 'OPEN'
          const singoli = pallet.products.filter(p => !p.isCase).reduce((s, p) => s + p.quantity, 0)
          const colli = pallet.products.filter(p => p.isCase).reduce((s, p) => s + p.quantity, 0)

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
                  <div className="flex justify-between items-start mb-1">
                    <h2 className="text-lg font-bold text-gray-900 leading-tight">{pallet.name}</h2>
                    <div className="flex items-center gap-1 ml-2 shrink-0">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        pallet.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {pallet.status === 'OPEN' ? '● Aperto' : '✓ Chiuso'}
                      </span>
                      <DeletePalletButton palletId={pallet.id} palletName={pallet.name} />
                    </div>
                  </div>
                  {pallet.section && (
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full w-fit mb-2">
                      {pallet.section}
                    </span>
                  )}
                  <p className="text-xs text-gray-400 mb-4">
                    📅 {new Date(pallet.createdAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                  <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-3 text-sm font-semibold">
                      {singoli > 0 && (
                        <span className="flex items-center gap-1 text-blue-600">
                          <span>🔹</span>{singoli} singoli
                        </span>
                      )}
                      {colli > 0 && (
                        <span className="flex items-center gap-1 text-orange-500">
                          <span>🟧</span>{colli} colli
                        </span>
                      )}
                      {singoli === 0 && colli === 0 && (
                        <span className="text-gray-400 text-xs">Nessun prodotto</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 transition-colors">Apri →</span>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
