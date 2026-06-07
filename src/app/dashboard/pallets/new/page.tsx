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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Nuovo Bancale</h1>
        <Link href="/dashboard" className="text-blue-600 hover:underline font-medium">
          Indietro
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          <div className="flex flex-col space-y-2">
            <label htmlFor="name" className="text-gray-700 font-medium">
              Nome Bancale
            </label>
            <input 
              type="text" 
              name="name" 
              id="name" 
              required
              placeholder="es. Frigo Carni 1, Scaffale A..."
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="mt-4 p-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isPending ? 'Creazione in corso...' : 'Crea e Vai allo Scanner'}
          </button>
        </form>
      </div>
    </div>
  )
}
