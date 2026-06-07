'use client'

import { useScanner } from '@/hooks/useScanner'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export default function GlobalPalletScanner() {
  const router = useRouter()

  const handleScan = useCallback((barcode: string) => {
    if (barcode.startsWith('PLT:')) {
      const palletId = barcode.slice(4)
      router.push(`/dashboard/pallets/${palletId}`)
    }
  }, [router])

  useScanner(handleScan)

  return null
}
