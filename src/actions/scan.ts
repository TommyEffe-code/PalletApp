'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from './auth'
import { revalidatePath } from 'next/cache'

export async function addProductToPallet(palletId: string, barcode: string, isCase: boolean = false) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const pallet = await prisma.pallet.findUnique({
    where: { id: palletId, departmentId: session.id },
  })

  if (!pallet || pallet.status === 'CLOSED') {
    return { error: 'Pallet not found or closed' }
  }

  // Fetch product info from Open Food Facts
  let productName = null
  let productImageUrl = null

  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
    const data = await res.json()
    if (data.status === 1) {
      productName = data.product.product_name || data.product.product_name_it || data.product.generic_name
      productImageUrl = data.product.image_front_small_url || data.product.image_front_url
    }
  } catch (e) {
    console.error('Error fetching from Open Food Facts:', e)
  }

  // Check if product already exists in this pallet WITH THE SAME isCase status
  const existingProduct = await prisma.productEntry.findFirst({
    where: { palletId, barcode, isCase },
  })

  let product;

  if (existingProduct) {
    product = await prisma.productEntry.update({
      where: { id: existingProduct.id },
      data: { 
        quantity: existingProduct.quantity + 1,
        name: existingProduct.name || productName,
        imageUrl: existingProduct.imageUrl || productImageUrl,
      },
    })
  } else {
    product = await prisma.productEntry.create({
      data: {
        palletId,
        barcode,
        isCase,
        name: productName,
        imageUrl: productImageUrl,
        quantity: 1,
      },
    })
  }

  revalidatePath(`/dashboard/pallets/${palletId}`)
  return { success: true, product }
}

export async function addProductToClosedPallet(palletId: string, barcode: string, isCase: boolean = false) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const pallet = await prisma.pallet.findUnique({
    where: { id: palletId, departmentId: session.id },
  })

  if (!pallet) return { error: 'Pallet non trovato' }

  let productName = null
  let productImageUrl = null

  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
    const data = await res.json()
    if (data.status === 1) {
      productName = data.product.product_name || data.product.product_name_it || data.product.generic_name
      productImageUrl = data.product.image_front_small_url || data.product.image_front_url
    }
  } catch (e) {
    console.error('Error fetching from Open Food Facts:', e)
  }

  const existingProduct = await prisma.productEntry.findFirst({
    where: { palletId, barcode, isCase },
  })

  let product;

  if (existingProduct) {
    product = await prisma.productEntry.update({
      where: { id: existingProduct.id },
      data: {
        quantity: existingProduct.quantity + 1,
        name: existingProduct.name || productName,
        imageUrl: existingProduct.imageUrl || productImageUrl,
      },
    })
  } else {
    product = await prisma.productEntry.create({
      data: { palletId, barcode, isCase, name: productName, imageUrl: productImageUrl, quantity: 1 },
    })
  }

  revalidatePath(`/dashboard/pallets/${palletId}`)
  return { success: true, product }
}

export async function updateProductQuantity(productId: string, quantity: number, palletId: string) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  if (quantity <= 0) {
    await prisma.productEntry.delete({
      where: { id: productId },
    })
  } else {
    await prisma.productEntry.update({
      where: { id: productId },
      data: { quantity },
    })
  }

  revalidatePath(`/dashboard/pallets/${palletId}`)
  return { success: true }
}
