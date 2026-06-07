'use client'

import { useScanner } from '@/hooks/useScanner'
import { addProductToPallet, updateProductQuantity } from '@/actions/scan'
import { useState, useCallback } from 'react'
import { CheckCircleIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/solid'

export default function PalletScanner({ 
  palletId, 
  initialProducts 
}: { 
  palletId: string, 
  initialProducts: any[] 
}) {
  const [products, setProducts] = useState(initialProducts)
  const [lastScanned, setLastScanned] = useState<string | null>(null)
  const [flash, setFlash] = useState(false)
  const [isCaseMode, setIsCaseMode] = useState(false)

  const handleScan = useCallback(async (barcode: string) => {
    // Capture current mode
    const currentMode = isCaseMode;
    
    // Optimistic update
    setLastScanned(barcode)
    setFlash(true)
    setTimeout(() => setFlash(false), 500)
    
    try {
      const audio = new Audio('/beep.mp3')
      audio.play().catch(() => {})
    } catch(e) {}

    // Server update
    const result = await addProductToPallet(palletId, barcode, currentMode)
    
    if (result.success && result.product) {
      setProducts(prev => {
        const index = prev.findIndex(p => p.id === result.product.id)
        if (index >= 0) {
          const updated = [...prev]
          updated[index] = result.product
          return updated
        }
        return [result.product, ...prev]
      })
    } else if (result.error) {
      alert(result.error)
    }
  }, [palletId, isCaseMode])

  // Attach global scanner listener
  useScanner(handleScan)

  const updateQuantity = async (productId: string, newQuantity: number) => {
    setProducts(products.map(p => p.id === productId ? { ...p, quantity: newQuantity } : p).filter(p => p.quantity > 0))
    await updateProductQuantity(productId, newQuantity, palletId)
  }

  // Group products by barcode for display
  const groupedProducts = products.reduce((acc: Record<string, any>, p) => {
    if (!acc[p.barcode]) {
      acc[p.barcode] = {
        barcode: p.barcode,
        name: p.name,
        imageUrl: p.imageUrl,
        single: null,
        case: null
      }
    }
    if (p.isCase) {
      acc[p.barcode].case = p
    } else {
      acc[p.barcode].single = p
    }
    return acc
  }, {})

  const displayList = Object.values(groupedProducts).sort((a: any, b: any) => {
    const timeA = Math.max(
      a.single ? new Date(a.single.createdAt).getTime() : 0,
      a.case ? new Date(a.case.createdAt).getTime() : 0
    )
    const timeB = Math.max(
      b.single ? new Date(b.single.createdAt).getTime() : 0,
      b.case ? new Date(b.case.createdAt).getTime() : 0
    )
    return timeB - timeA
  })

  return (
    <div className="flex flex-col space-y-6">
      {/* Mode Toggle Selector */}
      <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex p-1 h-20">
        <button
          onClick={() => setIsCaseMode(false)}
          className={`flex-1 flex items-center justify-center gap-3 rounded-lg font-black text-xl transition-all ${
            !isCaseMode 
            ? 'bg-blue-600 text-white shadow-lg scale-[1.02]' 
            : 'text-gray-400 hover:bg-gray-50'
          }`}
        >
          🍎 PEZZO SINGOLO
        </button>
        <button
          onClick={() => setIsCaseMode(true)}
          className={`flex-1 flex items-center justify-center gap-3 rounded-lg font-black text-xl transition-all ${
            isCaseMode 
            ? 'bg-orange-600 text-white shadow-lg scale-[1.02]' 
            : 'text-gray-400 hover:bg-gray-50'
          }`}
        >
          📦 COLLO (INTERO)
        </button>
      </div>

      <div className={`p-10 rounded-2xl flex items-center justify-center border-4 border-dashed transition-all duration-300 ${
        flash 
          ? 'bg-green-100 border-green-500 scale-[1.02]' 
          : isCaseMode ? 'bg-orange-50 border-orange-200' : 'bg-white border-blue-200'
      }`}>
        <div className="text-center">
          {flash ? (
            <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-2" />
          ) : (
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2 text-4xl shadow-inner ${
              isCaseMode ? 'bg-orange-100' : 'bg-blue-100'
            }`}>
              {isCaseMode ? '📦' : '🍎'}
            </div>
          )}
          <h2 className={`text-2xl font-black ${flash ? 'text-green-700' : 'text-gray-800'}`}>
            {flash 
              ? `REGISTRATO: ${isCaseMode ? '1 COLLO' : '1 PEZZO'}` 
              : isCaseMode ? 'MODALITÀ COLLO' : 'MODALITÀ SINGOLO'
            }
          </h2>
          <p className="text-gray-500 font-medium mt-2">
            {isCaseMode 
              ? 'Tutto ciò che scansionerai ora verrà contato come COLLO.' 
              : 'Tutto ciò che scansionerai ora verrà contato come SINGOLO.'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold flex justify-between">
          <span>Contenuto ({displayList.length} prodotti)</span>
        </div>
        <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
          {displayList.length === 0 ? (
            <li className="p-8 text-center text-gray-500 font-medium italic">Il bancale è vuoto. Inizia a scansionare!</li>
          ) : (
            displayList.map((group: any) => (
              <li key={group.barcode} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {group.imageUrl ? (
                      <img src={group.imageUrl} alt={group.name} className="w-16 h-16 object-contain rounded-lg border bg-white shadow-sm" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-50 rounded-lg border flex items-center justify-center text-[10px] text-gray-300 font-bold">
                        NO IMG
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 leading-tight text-lg">{group.name || 'Prodotto Sconosciuto'}</div>
                    <div className="text-xs font-mono text-gray-400 mt-0.5">{group.barcode}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-8">
                  {/* Single Units Counter */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-blue-500 uppercase mb-1">Pezzi</span>
                    <div className="flex items-center bg-blue-50 rounded-lg p-1">
                      <button 
                        onClick={() => group.single && updateQuantity(group.single.id, group.single.quantity - 1)}
                        className={`p-1 rounded transition-colors ${group.single ? 'hover:bg-blue-200 text-blue-700' : 'text-gray-300 pointer-events-none'}`}
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className={`w-8 text-center font-black text-xl ${group.single ? 'text-blue-900' : 'text-gray-300'}`}>
                        {group.single ? group.single.quantity : 0}
                      </span>
                      <button 
                        onClick={() => group.single ? updateQuantity(group.single.id, group.single.quantity + 1) : addProductToPallet(palletId, group.barcode, false)}
                        className="p-1 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Case Units Counter */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-orange-600 uppercase mb-1">Colli</span>
                    <div className="flex items-center bg-orange-50 rounded-lg p-1">
                      <button 
                        onClick={() => group.case && updateQuantity(group.case.id, group.case.quantity - 1)}
                        className={`p-1 rounded transition-colors ${group.case ? 'hover:bg-orange-200 text-orange-700' : 'text-gray-300 pointer-events-none'}`}
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className={`w-8 text-center font-black text-xl ${group.case ? 'text-orange-900' : 'text-gray-300'}`}>
                        {group.case ? group.case.quantity : 0}
                      </span>
                      <button 
                        onClick={() => group.case ? updateQuantity(group.case.id, group.case.quantity + 1) : addProductToPallet(palletId, group.barcode, true)}
                        className="p-1 hover:bg-orange-200 text-orange-700 rounded transition-colors"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}

function barcodeToDisplay(barcode: string) {
  return barcode;
}
