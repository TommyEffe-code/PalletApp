'use client'

import { createPalletAction } from '@/actions/pallet'
import Link from 'next/link'
import { useState } from 'react'

export default function NewPalletPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = await createPalletAction(formData)
    if (result?.error) {
      setError(result.error)
    }
    setIsPending(false)
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard" className="text-gray-400 hover:text-blue-600 transition-colors">
          ← Indietro
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-extrabold text-gray-900">Nuovo Bancale</h1>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="name" className="text-gray-700 font-semibold text-sm uppercase tracking-wide">
              Nome Bancale
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              placeholder="es. Frigo Carni 1, Scaffale A..."
              className="p-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white text-gray-900 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 p-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isPending ? '⏳ Creazione in corso...' : '📦 Crea e Vai allo Scanner'}
          </button>
        </form>
      </div>
    </div>
  )
}
