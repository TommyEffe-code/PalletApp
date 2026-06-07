'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from './auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createPalletAction(formData: FormData) {
  const session = await getSession()
  if (!session) {
    return { error: 'Unauthorized' }
  }

  const name = formData.get('name') as string

  if (!name || name.trim() === '') {
    return { error: 'Pallet name is required' }
  }

  const pallet = await prisma.pallet.create({
    data: {
      name: name.trim(),
      departmentId: session.id,
    },
  })

  revalidatePath('/dashboard')
  redirect(`/dashboard/pallets/${pallet.id}`)
}

export async function closePalletAction(palletId: string) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const pallet = await prisma.pallet.findUnique({
    where: { id: palletId, departmentId: session.id },
  })

  if (!pallet) return { error: 'Pallet non trovato' }
  if (pallet.status === 'CLOSED') return { error: 'Pallet già chiuso' }

  await prisma.pallet.update({
    where: { id: palletId },
    data: { status: 'CLOSED' },
  })

  revalidatePath(`/dashboard/pallets/${palletId}`)
  revalidatePath('/dashboard')
  return { success: true }
}
