'use client'

import { useRef } from 'react'
import Barcode from 'react-barcode'

export default function PalletBarcodeButton({ palletId, palletName }: { palletId: string; palletName: string }) {
  const svgRef = useRef<HTMLDivElement>(null)
  const barcodeValue = `PLT:${palletId}`

  function handleDownload() {
    const el = svgRef.current
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
    const el = svgRef.current
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

  return (
    <div className="flex gap-2">
      {/* SVG nascosto usato per generare PNG/stampa */}
      <div ref={svgRef} className="hidden">
        <Barcode value={barcodeValue} format="CODE128" width={2} height={80} displayValue={false} />
      </div>
      <button
        onClick={handleDownload}
        className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm font-semibold hover:bg-green-700 transition-colors"
      >
        ⬇️ Barcode
      </button>
      <button
        onClick={handlePrint}
        className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors"
      >
        🖨️ Stampa
      </button>
    </div>
  )
}
