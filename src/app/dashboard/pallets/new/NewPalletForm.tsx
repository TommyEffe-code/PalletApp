'use client'

import { createPalletAction } from '@/actions/pallet'
import Link from 'next/link'
import { useState } from 'react'

export default function NewPalletForm({ existingSections }: { existingSections: string[] }) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [sectionInput, setSectionInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filtered = existingSections.filter(s =>
    s.toLowerCase().includes(sectionInput.toLowerCase()) && s !== sectionInput
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = await createPalletAction(formData)
    if (result?.error) {
      setError(result.error)
      setIsPending(false)
    }
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

          <div className="flex flex-col space-y-1.5 relative">
            <label htmlFor="section" className="text-gray-700 font-semibold text-sm uppercase tracking-wide">
              Sezione <span className="text-gray-400 font-normal normal-case">(opzionale)</span>
            </label>
            <input
              type="text"
              name="section"
              id="section"
              value={sectionInput}
              onChange={e => { setSectionInput(e.target.value); setShowSuggestions(true) }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              autoComplete="off"
              placeholder="es. Freschi, Surgelati, Macelleria..."
              className="p-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white text-gray-900 transition-all"
            />
            {showSuggestions && filtered.length > 0 && (
              <ul className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                {filtered.map(s => (
                  <li
                    key={s}
                    onMouseDown={() => { setSectionInput(s); setShowSuggestions(false) }}
                    className="px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
            {existingSections.length > 0 && sectionInput === '' && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {existingSections.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSectionInput(s)}
                    className="text-xs px-2.5 py-1 bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-600 rounded-full transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
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
