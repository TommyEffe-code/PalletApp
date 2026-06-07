'use client'

import { useEffect, useRef } from 'react'

export function useScanner(onScan: (barcode: string) => void) {
  const bufferRef = useRef('')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field or textarea
      if (
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      // Barcode scanners typically send an 'Enter' key at the end
      if (e.key === 'Enter') {
        if (bufferRef.current.length > 0) {
          onScan(bufferRef.current)
          bufferRef.current = ''
        }
        return
      }

      // Add alphanumeric characters to buffer
      if (e.key.length === 1) {
        bufferRef.current += e.key
        
        // Increase timeout to 2000ms to allow manual typing simulation
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
          bufferRef.current = ''
        }, 2000)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [onScan])
}
