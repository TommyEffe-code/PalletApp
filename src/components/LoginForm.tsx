'use client'

import { loginAction } from '@/actions/auth'
import { useState, useActionState } from 'react'

export default function LoginForm({ departments }: { departments: any[] }) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await loginAction(formData)

    if (result?.error) {
      setError(result.error)
    }
    
    setIsPending(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="flex flex-col space-y-1.5">
        <label htmlFor="departmentId" className="text-gray-700 font-semibold text-sm uppercase tracking-wide">
          Reparto
        </label>
        <select
          name="departmentId"
          id="departmentId"
          required
          className="p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
        >
          <option value="">Seleziona reparto...</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col space-y-1.5">
        <label htmlFor="password" className="text-gray-700 font-semibold text-sm uppercase tracking-wide">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          required
          className="p-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white text-gray-900 transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 p-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
      >
        {isPending ? '⏳ Accesso...' : 'Accedi'}
      </button>
    </form>
  )
}
