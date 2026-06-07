'use client'

import { useScanner } from '@/hooks/useScanner'
import { lookupBarcodeAction } from '@/actions/lookup'
import { useState, useCallback } from 'react'
import Link from 'next/link'
import { MagnifyingGlassIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/solid'

export default function LookupScanner() {
  const [results, setResults] = useState<any[] | null>(null)
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const handleScan = useCallback(async (barcode: string) => {
    setScannedBarcode(barcode)
    setIsSearching(true)
    setResults(null)
    
    const res = await lookupBarcodeAction(barcode)
    if (res.products) {
      setResults(res.products)
    }
    
    setIsSearching(false)
  }, [])

  useScanner(handleScan)

  return (
    <div className="flex flex-col space-y-6">
      <div className={`p-8 rounded-xl flex flex-col items-center justify-center border-4 border-dashed transition-colors duration-300 ${
        isSearching ? 'bg-blue-50 border-blue-400' : 'bg-white border-blue-200'
      }`}>
        <MagnifyingGlassIcon className={`w-16 h-16 ${isSearching ? 'text-blue-500 animate-pulse' : 'text-blue-200'} mb-2`} />
        <h2 className="text-xl font-bold text-gray-800">
          {isSearching ? 'Ricerca in corso...' : 'In attesa di scansione...'}
        </h2>
        <p className="text-gray-500 mt-2 text-center">
          Punta lo scanner su un prodotto e premi il grilletto.
        </p>
      </div>

      {scannedBarcode && !isSearching && results !== null && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            Risultato per: <span className="font-mono bg-gray-100 px-2 py-1 rounded text-blue-600">{scannedBarcode}</span>
          </h3>
          
          {results.length === 0 ? (
            <div className="flex flex-col items-center p-6 bg-red-50 text-red-700 rounded-lg">
              <ExclamationTriangleIcon className="w-12 h-12 mb-2" />
              <p className="font-bold text-lg">Prodotto non trovato</p>
              <p className="text-sm mt-1">Non è presente in nessun bancale attivo del reparto.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-700 font-bold mb-4">
                <CheckCircleIcon className="w-6 h-6" />
                <span>Trovato in {results.length} bancali!</span>
              </div>
              
              {results.map((product, idx) => (
                <div key={product.id} className={`p-4 rounded-lg border flex justify-between items-center ${
                  idx === 0 ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-center gap-4">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-contain rounded border bg-white" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-400">
                        IMG
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-gray-900 leading-tight">
                        {product.name || 'Prodotto Sconosciuto'}
                        {product.isCase && (
                          <span className="ml-2 bg-orange-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded">COLLO</span>
                        )}
                      </div>
                      <Link href={`/dashboard/pallets/${product.pallet.id}`} className="text-sm font-bold text-blue-600 hover:underline">
                        Bancale: {product.pallet.name}
                      </Link>
                      <p className="text-xs text-gray-400">
                        Posizionato il: {new Date(product.createdAt).toLocaleDateString('it-IT')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="block text-2xl font-bold">{product.quantity}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Pezzi</span>
                  </div>
                  {idx === 0 && (
                    <div className="ml-4">
                      <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-bold rounded-full uppercase">
                        Raccomandato (FIFO)
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
