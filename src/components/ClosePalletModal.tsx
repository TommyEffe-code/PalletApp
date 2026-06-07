'use client'

import { useState, useRef } from 'react'
import Barcode from 'react-barcode'
import { closePalletAction } from '@/actions/pallet'

export default function ClosePalletModal({ palletId, palletName }: { palletId: string; palletName: string }) {
  const [state, setState] = useState<'idle' | 'confirm' | 'closed'>('idle')
  const [error, setError] = useState<string | null>(null)
  const printRef = useRef<HTMLDivElement>(null)

  const barcodeValue = `PLT:${palletId}`

  async function handleClose() {
    const result = await closePalletAction(palletId)
    if (result.error) {
      setError(result.error)
    } else {
      setState('closed')
    }
  }

  function handleDownload() {
    const el = printRef.current
    if (!el) return
    const svg = el.querySelector('svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)

    const img = new Image()
    img.onload = () => {
      const padding = 40
      const canvas = document.createElement('canvas')
      canvas.width = img.width + padding * 2
      canvas.height = img.height + padding * 2 + 80
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, padding, padding)
      ctx.fillStyle = '#111111'
      ctx.font = 'bold 28px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(palletName, canvas.width / 2, img.height + padding + 40)
      ctx.font = '18px sans-serif'
      ctx.fillStyle = '#666666'
      ctx.fillText(new Date().toLocaleDateString('it-IT'), canvas.width / 2, img.height + padding + 68)
      URL.revokeObjectURL(url)
      canvas.toBlob((blob) => {
        if (!blob) return
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `bancale-${palletName.replace(/\s+/g, '-')}.png`
        a.click()
        URL.revokeObjectURL(a.href)
      })
    }
    img.src = url
  }

  function handlePrint() {
    const el = printRef.current
    if (!el) return
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <html><head><title>Bancale: ${palletName}</title>
      <style>
        body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; padding: 40px; }
        h1 { font-size: 28px; margin-bottom: 8px; }
        p { color: #666; margin-bottom: 24px; font-size: 16px; }
      </style></head>
      <body>
        <h1>${palletName}</h1>
        <p>${new Date().toLocaleDateString('it-IT')}</p>
        ${el.innerHTML}
      </body></html>
    `)
    win.document.close()
    win.focus()
    win.print()
    win.close()
  }

  if (state === 'idle') {
    return (
      <button
        onClick={() => setState('confirm')}
        className="px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors"
      >
        Chiudi Pallet
      </button>
    )
  }

  if (state === 'confirm') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-black mb-2">Chiudere il pallet?</h2>
          <p className="text-gray-500 mb-6">
            Il pallet <strong>{palletName}</strong> verrà chiuso e non sarà più possibile aggiungere prodotti.
          </p>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <div className="flex gap-3">
            <button
              onClick={() => setState('idle')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annulla
            </button>
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Chiudi
            </button>
          </div>
        </div>
      </div>
    )
  }

  // state === 'closed'
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-black mb-1">Pallet Chiuso!</h2>
        <p className="text-gray-500 mb-6">
          Stampa questo barcode e applicalo al bancale. Scansionandolo potrai visualizzarne il contenuto.
        </p>

        <div ref={printRef} className="flex justify-center mb-6">
          <Barcode
            value={barcodeValue}
            format="CODE128"
            width={2}
            height={80}
            displayValue={false}
          />
        </div>

        <p className="text-xs text-gray-400 font-mono mb-6">{barcodeValue}</p>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-black text-lg hover:bg-green-700 transition-colors"
            >
              ⬇️ Scarica PNG
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-black text-lg hover:bg-blue-700 transition-colors"
            >
              🖨️ Stampa
            </button>
          </div>
          <a
            href="/dashboard"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
