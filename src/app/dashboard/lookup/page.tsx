import Link from 'next/link'
import LookupScanner from '@/components/LookupScanner'

export default function LookupPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Cerca Prodotto</h1>
        <Link href="/dashboard" className="text-blue-600 hover:underline font-medium">
          Torna alla Dashboard
        </Link>
      </div>
      
      <p className="mb-6 text-gray-600">
        Usa lo scanner in qualsiasi momento per verificare se un prodotto è già presente negli avanzi (bancali attivi).
      </p>

      <LookupScanner />
    </div>
  )
}
