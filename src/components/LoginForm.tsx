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
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="flex flex-col space-y-2">
        <label htmlFor="departmentId" className="text-gray-700 font-medium">
          Reparto (Department)
        </label>
        <select 
          name="departmentId" 
          id="departmentId" 
          required
          className="p-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a department...</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="password" className="text-gray-700 font-medium">
          Password
        </label>
        <input 
          type="password" 
          name="password" 
          id="password" 
          required
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" 
        />
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="mt-4 p-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
