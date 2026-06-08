'use client'

import { useState, useTransition } from 'react'
import { deletePalletAction } from '@/actions/pallet'
import { TrashIcon } from '@heroicons/react/24/outline'

export default function DeletePalletButton({ palletId, palletName }: { palletId: string; palletName: string }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      await deletePalletAction(palletId)
      setShowConfirm(false)
    })
  }

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setShowConfirm(true)
        }}
        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        title="Elimina bancale"
      >
        <TrashIcon className="w-4 h-4" />
      </button>

      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-3xl mb-3 text-center">🗑️</div>
            <h2 className="text-lg font-bold text-gray-900 text-center mb-1">Elimina bancale</h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              Vuoi eliminare <span className="font-semibold text-gray-700">{palletName}</span>?<br />
              Tutti i prodotti associati verranno rimossi.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {isPending ? 'Eliminazione…' : 'Elimina'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
