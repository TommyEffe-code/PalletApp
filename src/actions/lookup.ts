'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from './auth'

export async function lookupBarcodeAction(barcode: string) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const products = await prisma.productEntry.findMany({
    where: { 
      barcode,
      pallet: {
        departmentId: session.id,
        status: 'OPEN' // Only search active pallets
      }
    },
    include: {
      pallet: true
    },
    orderBy: [
      { isCase: 'desc' }, // Show cases first maybe?
      { pallet: { createdAt: 'asc' } }
    ]
  })

  return { products }
}
